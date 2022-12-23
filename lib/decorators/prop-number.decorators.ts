import { Schema } from 'mongoose';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsNumberOptions,
  IsInt,
  IsPositive,
} from 'class-validator';
import { $Prop } from './prop.decorator';
import { CommonPropOpts, Nullable, PropCommonOpts, PropertyOptions } from '../types';
import {
  CastToNumberArrayOptions,
  CastToNumberOptions,
  TransformToNumber,
  TransformToNumberArray,
} from '../helpers';
import { ApiHideProperty } from '@nestjs/swagger';

type PropNumberCommonOpts = PropCommonOpts & {
  min?: number;
  max?: number;
  isInt?: boolean;
  isPositive?: boolean;
  isUnique?: boolean;
} & IsNumberOptions;

export type PropNumberOpts = PropNumberCommonOpts & CastToNumberOptions;
export type PropNumberOptionalOpts = Omit<PropNumberOpts, 'default'> & {
  default?: Nullable<PropNumberOpts['default']>;
};
export type PropNumberArrayOpts = PropNumberCommonOpts & CastToNumberArrayOptions;
export type PropNumberArrayOptionalOpts = Omit<PropNumberArrayOpts, 'default'> & {
  default?: Nullable<PropNumberOpts['default']>;
};
type SetPropOptions =
  | PropNumberOpts
  | PropNumberOptionalOpts
  | PropNumberArrayOpts
  | PropNumberArrayOptionalOpts;

export function $PropNumber(opts: PropNumberOpts = {}): PropertyDecorator {
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

export function $PropNumberArray(opts: PropNumberArrayOpts = {}): PropertyDecorator {
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

export function $PropNumberOptional(opts: PropNumberOptionalOpts = {}): PropertyDecorator {
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

export function $PropNumberArrayOptional(
  opts: PropNumberArrayOptionalOpts = {},
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
      type: 'number',
      maximum: opts.max,
      minimum: opts.min,
      nullable: opts.isOptional,
      default: opts.default,
      required: !opts.isOptional,
    },
    mongoose: {
      type: !opts.isArray ? Schema.Types.Number : [Schema.Types.Number],
      required: !opts.isOptional,
      default: opts.default,
      unique: opts.isUnique,
      max: opts.max,
      min: opts.min,
    },
    transformer: {
      expose: opts.exclude === true ? false : true,
      exclude: opts.exclude === true ? true : undefined,
      type: () => Number,
      transform: [],
    },
    validators: [],
    decorators: { __propDef: [] },
  };

  // Set transform functions
  const transformToTypeOpts: CastToNumberOptions = {
    nullString: opts.nullString,
    undefinedString: opts.undefinedString,
    fixed: opts.fixed,
    round: opts.round,
  };

  if (!opts.isArray) {
    prop.transformer?.transform?.push([
      TransformToNumber({
        ...transformToTypeOpts,
        default: <any>(<unknown>opts.default),
      }),
      { toClassOnly: true },
    ]);
  } else {
    prop.transformer?.transform?.push([
      TransformToNumberArray({
        ...transformToTypeOpts,
        default: <any>(<unknown>opts.default),
      }),
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
  prop.validators!.push(
    IsNumber(
      {
        allowInfinity: opts.allowInfinity ?? false,
        allowNaN: opts.allowNaN ?? false,
        maxDecimalPlaces: opts.maxDecimalPlaces,
      },
      { each: opts.isArray },
    ),
  );

  // Lenght validation
  if (opts.min !== undefined) prop.validators!.push(Min(opts.min, { each: opts.isArray }));
  if (opts.max !== undefined) prop.validators!.push(Max(opts.max, { each: opts.isArray }));

  // Format validation
  if (opts.isInt === true) prop.validators!.push(IsInt({ each: opts.isArray }));
  if (opts.isPositive === true) prop.validators!.push(IsPositive({ each: opts.isArray }));

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
