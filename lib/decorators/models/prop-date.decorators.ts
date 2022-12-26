import { Schema } from 'mongoose';
import { IsArray, IsNotEmpty, IsOptional, IsDate, IsUrl, MaxDate, MinDate } from 'class-validator';
import { $Prop } from './prop.decorator';
import { CommonPropOpts, Nullable, PropCommonOpts, PropertyOptions } from '../../types';
import {
  CastToDateArrayOptions,
  CastToDateOptions,
  TransformToDate,
  TransformToDateArray,
} from '../../helpers';

type PropDateCommonOpts = PropCommonOpts & {
  minDate?: Date;
  maxDate?: Date;
  unique?: boolean;
};

export type PropDateOpts = PropDateCommonOpts & CastToDateOptions;
export type PropDateOptionalOpts = Omit<PropDateOpts, 'default'> & {
  default?: Nullable<PropDateOpts['default']>;
};
export type PropDateArrayOpts = PropDateCommonOpts & CastToDateArrayOptions;
export type PropDateArrayOptionalOpts = Omit<PropDateArrayOpts, 'default'> & {
  default?: Nullable<PropDateOpts['default']>;
};
type SetPropOptions =
  | PropDateOpts
  | PropDateOptionalOpts
  | PropDateArrayOpts
  | PropDateArrayOptionalOpts;

export function $PropDate(opts: PropDateOpts = {}): PropertyDecorator {
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

export function $PropDateArray(opts: PropDateArrayOpts = {}): PropertyDecorator {
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

export function $PropDateOptional(opts: PropDateOptionalOpts = {}): PropertyDecorator {
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

export function $PropDateArrayOptional(opts: PropDateArrayOptionalOpts = {}): PropertyDecorator {
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
      format: 'date-time',
      nullable: opts.isOptional,
      default: opts.default,
      required: !opts.isOptional,
      hidden: opts.private,
    },
    mongoose: {
      type: !opts.isArray ? Schema.Types.Date : [Schema.Types.Date],
      required: !opts.isOptional,
      default: opts.default,
      unique: opts.unique,
    },
    transformer: {
      expose: opts.exclude === true || opts.private === true ? false : true,
      exclude: opts.exclude === true || opts.private === true ? true : undefined,
      type: () => Date,
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
  };

  if (!opts.isArray) {
    prop.transformer?.transform?.push([
      TransformToDate(transformToTypeOpts),
      { toClassOnly: true },
    ]);
  } else {
    prop.transformer?.transform?.push([
      TransformToDateArray(transformToTypeOpts),
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
  prop.validators!.push(IsDate({ each: opts.isArray }));

  // Date validation
  if (opts.minDate !== undefined)
    prop.validators!.push(MinDate(opts.minDate, { each: opts.isArray }));
  if (opts.maxDate !== undefined)
    prop.validators!.push(MaxDate(opts.maxDate, { each: opts.isArray }));

  // Other validations
  if (opts.validators !== undefined) {
    prop.validators = [...prop.validators!, ...opts.validators];
  }

  $Prop(prop)(target, property);
}
