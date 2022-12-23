import { Schema } from 'mongoose';
import { IsArray, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { $Prop } from './prop.decorator';
import { CommonPropOpts, Nullable, PropCommonOpts, PropertyOptions } from '../types';
import { CastToStringArrayOptions, CastToStringOptions } from '../helpers';
import { ApiHideProperty } from '@nestjs/swagger';

type PropEnumCommonOpts = PropCommonOpts & {
  enum: any[] | Record<string, any>;
  enumName: string;
  isUnique?: boolean;
};

export type PropEnumOpts = PropEnumCommonOpts & CastToStringOptions;
export type PropEnumOptionalOpts = Omit<PropEnumOpts, 'default'> & {
  default?: Nullable<PropEnumOpts['default']>;
};
export type PropEnumArrayOpts = PropEnumCommonOpts & CastToStringArrayOptions;
export type PropEnumArrayOptionalOpts = Omit<PropEnumArrayOpts, 'default'> & {
  default?: Nullable<PropEnumOpts['default']>;
};
type SetPropOptions =
  | PropEnumOpts
  | PropEnumOptionalOpts
  | PropEnumArrayOpts
  | PropEnumArrayOptionalOpts;

export function $PropEnum(opts: PropEnumOpts): PropertyDecorator {
  return (target: any, property: any) => {
    setProp(
      {
        default: undefined,
        ...opts,
        isArray: false,
        isOptional: false,
      },
      target,
      property,
    );
  };
}

export function $PropEnumArray(opts: PropEnumArrayOpts): PropertyDecorator {
  return (target: any, property: any) => {
    setProp(
      {
        default: undefined,
        ...opts,
        isArray: true,
        isOptional: false,
      },
      target,
      property,
    );
  };
}

export function $PropEnumOptional(opts: PropEnumOptionalOpts): PropertyDecorator {
  return (target: any, property: any) => {
    setProp(
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

export function $PropEnumArrayOptional(opts: PropEnumArrayOptionalOpts): PropertyDecorator {
  return (target: any, property: any) => {
    setProp(
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

function setProp(opts: CommonPropOpts & SetPropOptions, target: any, property: any) {
  // Init final opts
  const prop: PropertyOptions = {
    swagger:
      opts.private === true
        ? undefined
        : {
            type: 'string',
            enum: opts.enum,
            enumName: opts.enumName,
            nullable: opts.isOptional,
            default: opts.default,
            required: !opts.isOptional,
          },
    mongoose: {
      type: !opts.isArray ? Schema.Types.String : [Schema.Types.String],
      enum: !opts.isOptional ? Object.values(opts.enum) : [...Object.values(opts.enum), null],
      required: !opts.isOptional,
      default: opts.default,
      unique: opts.isUnique,
    },
    transformer: {
      expose: opts.exclude === true || opts.private === true ? false : true,
      exclude: opts.exclude === true || opts.private === true ? true : undefined,
      type: () => String,
      transform: [],
    },
    validators: [],
    decorators: { __propDef: [] },
  };

  // Set transform functions
  const transformToTypeOpts = {
    default: <any>(<unknown>opts.default),
    nullString: opts.nullString,
    undefinedString: opts.undefinedString,
    case: opts.case,
    trim: opts.trim ?? true,
  };

  /*   if (!opts.isArray) {
    prop.transformer?.transform?.push([
      TransformToString(transformToTypeOpts),
      { toClassOnly: true },
    ]);
  } else {
    prop.transformer?.transform?.push([
      TransformToStringArray(transformToTypeOpts),
      { toClassOnly: true },
    ]);
  }
 */

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
  prop.validators!.push(IsEnum({ each: opts.isArray }));

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
