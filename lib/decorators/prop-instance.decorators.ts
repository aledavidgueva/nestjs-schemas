import { IsArray, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { $Prop } from './prop.decorator';
import { CommonPropOpts, Nullable, PropCommonOpts, PropertyOptions } from '../types';
import { ClassConstructor } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

type PropInstanceCommonOpts = PropCommonOpts & {};

export type PropInstanceOpts = PropInstanceCommonOpts & {
  default?: undefined;
};

export type PropInstanceOptionalOpts<T> = PropInstanceCommonOpts & {
  default?: Nullable<T>;
};

export type PropInstanceArrayOpts = PropInstanceCommonOpts & {
  default?: undefined;
};

export type PropInstanceArrayOptionalOpts<T> = PropInstanceCommonOpts & {
  default?: Nullable<T[]>;
};

type SetPropOptions<T> =
  | PropInstanceOpts
  | PropInstanceOptionalOpts<T>
  | PropInstanceArrayOpts
  | PropInstanceArrayOptionalOpts<T>;

export function $PropInstance<T>(
  type: ClassConstructor<T>,
  opts: PropInstanceOpts = {},
): PropertyDecorator {
  return (target: any, property: any) => {
    setProp(
      type,
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

export function $PropInstanceArray<T>(
  type: ClassConstructor<T>,
  opts: PropInstanceArrayOpts = {},
): PropertyDecorator {
  return (target: any, property: any) => {
    setProp(
      type,
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

export function $PropInstanceOptional<T>(
  type: ClassConstructor<T>,
  opts: PropInstanceOptionalOpts<T> = {},
): PropertyDecorator {
  return (target: any, property: any) => {
    setProp(
      type,
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

export function $PropInstanceArrayOptional<T>(
  type: ClassConstructor<T>,
  opts: PropInstanceArrayOptionalOpts<T> = {},
): PropertyDecorator {
  return (target: any, property: any) => {
    setProp(
      type,
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
  type: ClassConstructor<T>,
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
            name: type.name,
            nullable: opts.isOptional,
            default: opts.default,
            required: !opts.isOptional,
          },
    mongoose: {
      type: !opts.isArray ? type : [type],
      required: !opts.isOptional,
      default: opts.default,
    },
    transformer: {
      expose: opts.exclude === true || opts.private === true ? false : true,
      exclude: opts.exclude === true || opts.private === true ? true : undefined,
      type: () => type,
      transform: [],
    },
    validators: [],
    decorators: { __propDef: [] },
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

  // Is private field?
  if (opts.private === true) {
    prop.decorators?.__propDef.push(ApiHideProperty());
  }

  $Prop(prop)(target, property);
}
