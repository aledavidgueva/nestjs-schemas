import { IsArray, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { $Prop } from './prop.decorator';
import { CommonPropOpts, Nullable, PropCommonOpts, PropertyOptions } from '../types';
import { ClassConstructor } from 'class-transformer';
import { $Metadata } from './metadata.decorator';
import { METADATA } from '../constants/metadata.const';
import { ApiHideProperty } from '@nestjs/swagger';

type PropSubSchemaCommonOpts = PropCommonOpts & {
  lookup: LookupOpts;
};

export type LookupOpts = {
  from: string;
  localField: string;
  foreignField: string;
  justOne: true;
  preserveNullAndEmptyArrays: true;
};

export type PropSubSchemaOpts = PropSubSchemaCommonOpts & {
  default?: undefined;
};
export type PropSubSchemaOptionalOpts<T> = PropSubSchemaCommonOpts & {
  default?: Nullable<T>;
};
export type PropSubSchemaArrayOpts = PropSubSchemaCommonOpts & {
  default?: undefined;
};
export type PropSubSchemaArrayOptionalOpts<T> = PropSubSchemaCommonOpts & {
  default?: Nullable<T[]>;
};

type SetPropOptions<T> =
  | PropSubSchemaOpts
  | PropSubSchemaOptionalOpts<T>
  | PropSubSchemaArrayOpts
  | PropSubSchemaArrayOptionalOpts<T>;

export function $PropSubSchema<T>(
  subSchema: ClassConstructor<T>,
  opts: PropSubSchemaOpts,
): PropertyDecorator {
  return (target: any, property: any) => {
    setProp(
      subSchema,
      {
        ...opts,
        isArray: false,
        isOptional: false,
      },
      target,
      property,
    );
  };
}

export function $PropSubSchemaArray<T>(
  subSchema: ClassConstructor<T>,
  opts: PropSubSchemaArrayOpts,
): PropertyDecorator {
  return (target: any, property: any) => {
    setProp(
      subSchema,
      {
        ...opts,
        isArray: true,
        isOptional: false,
      },
      target,
      property,
    );
  };
}

export function $PropSubSchemaOptional<T>(
  subSchema: ClassConstructor<T>,
  opts: PropSubSchemaOptionalOpts<T>,
): PropertyDecorator {
  return (target: any, property: any) => {
    setProp(
      subSchema,
      {
        ...opts,
        isArray: false,
        isOptional: true,
      },
      target,
      property,
    );
  };
}

export function $PropSubSchemaArrayOptional<T>(
  subSchema: ClassConstructor<T>,
  opts: PropSubSchemaArrayOptionalOpts<T>,
): PropertyDecorator {
  return (target: any, property: any) => {
    setProp(
      subSchema,
      {
        ...opts,
        isArray: true,
        isOptional: true,
      },
      target,
      property,
    );
  };
}

function setProp<T>(
  subSchema: ClassConstructor<T>,
  opts: CommonPropOpts & SetPropOptions<T>,
  target: any,
  property: any,
) {
  // Init final opts
  const prop: PropertyOptions = {
    swagger:
      opts.private === true
        ? undefined
        : {
            type: 'object',
            name: subSchema.name,
            nullable: opts.isOptional,
            default: opts.default,
            required: !opts.isOptional,
          },
    mongoose: {
      type: !opts.isArray ? subSchema : [subSchema],
      required: !opts.isOptional,
      default: opts.default,
    },
    transformer: {
      expose: opts.exclude === true || opts.private === true ? false : true,
      exclude: opts.exclude === true || opts.private === true ? true : undefined,
      type: () => subSchema,
      transform: [],
    },
    validators: [],
    decorators: {
      __propDef: [$Metadata<LookupOpts>(METADATA.MONGOOSE_LOOKUP, opts.lookup)],
    },
  };

  // User custom transform chain fn
  if (opts.transform !== undefined) {
    prop.transformer!.transform = [...prop.transformer!.transform!, ...opts.transform];
  }

  // Validations

  // Exists validation
  if (!opts.isOptional) {
    prop.validators!.push(IsNotEmpty({ each: opts.isArray }));
  } else {
    prop.validators!.push(IsOptional({ each: opts.isArray }));
  }

  // Type validation
  if (opts.isArray) prop.validators!.push(IsArray());
  prop.validators!.push(ValidateNested({ each: opts.isArray }));

  // Other validations
  if (opts.validators !== undefined) {
    prop.validators = [...prop.validators!, ...opts.validators];
  }

  $Prop(prop)(target, property);
}
