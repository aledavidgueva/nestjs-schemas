import { Schema } from 'mongoose';
import ValidatorJS from 'validator';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { $Prop } from './prop.decorator';
import { CommonPropOpts, Nullable, PropCommonOpts, PropertyOptions } from '../types';
import {
  CastToStringArrayOptions,
  CastToStringOptions,
  TransformToString,
  TransformToStringArray,
} from '../helpers';
import { ApiHideProperty } from '@nestjs/swagger';

type PropStringCommonOpts = PropCommonOpts & {
  minLenght?: number;
  maxLenght?: number;
  format?: string;
  pattern?: RegExp;
  isUnique?: boolean;
  isUrl?: boolean | ValidatorJS.IsURLOptions;
};

export type PropStringOpts = PropStringCommonOpts & CastToStringOptions;
export type PropStringOptionalOpts = Omit<PropStringOpts, 'default'> & {
  default?: Nullable<PropStringOpts['default']>;
};
export type PropStringArrayOpts = PropStringCommonOpts & CastToStringArrayOptions;
export type PropStringArrayOptionalOpts = Omit<PropStringArrayOpts, 'default'> & {
  default?: Nullable<PropStringOpts['default']>;
};
type SetPropOptions =
  | PropStringOpts
  | PropStringOptionalOpts
  | PropStringArrayOpts
  | PropStringArrayOptionalOpts;

export function $PropString(opts: PropStringOpts = {}): PropertyDecorator {
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

export function $PropStringArray(opts: PropStringArrayOpts = {}): PropertyDecorator {
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

export function $PropStringOptional(opts: PropStringOptionalOpts = {}): PropertyDecorator {
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

export function $PropStringArrayOptional(
  opts: PropStringArrayOptionalOpts = {},
): PropertyDecorator {
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
    swagger: {
      type: 'string',
      format: opts.format,
      pattern: opts.pattern ? opts.pattern.toString() : undefined,
      maxLength: opts.maxLenght,
      minLength: opts.minLenght,
      nullable: opts.isOptional,
      default: opts.default,
      required: !opts.isOptional,
    },
    mongoose: {
      type: !opts.isArray ? Schema.Types.String : [Schema.Types.String],
      required: !opts.isOptional,
      default: opts.default,
      unique: opts.isUnique,
      minlength: opts.minLenght,
      maxlength: opts.maxLenght,
    },
    transformer: {
      expose: opts.exclude === true ? false : true,
      exclude: opts.exclude === true ? true : undefined,
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

  if (!opts.isArray) {
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
  prop.validators!.push(IsString({ each: opts.isArray }));

  // Lenght validation
  if (opts.minLenght !== undefined)
    prop.validators!.push(MinLength(opts.minLenght, { each: opts.isArray }));
  if (opts.maxLenght !== undefined)
    prop.validators!.push(MaxLength(opts.maxLenght, { each: opts.isArray }));

  // Format validation
  if (opts.isUrl !== undefined && opts.isUrl !== false) {
    prop.validators!.push(opts.isUrl === true ? IsUrl() : IsUrl(opts.isUrl));
  }

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
