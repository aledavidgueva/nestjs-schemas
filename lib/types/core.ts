import * as mongoose from 'mongoose';
import { PropOptions } from '@nestjs/mongoose';
import { ApiPropertyOptions } from '@nestjs/swagger';
import {
  ExcludeOptions,
  ExposeOptions,
  TransformFnParams,
  TransformOptions,
  TypeHelpOptions,
  TypeOptions,
} from 'class-transformer';

export type Nullable<T> = T | null;

export import ObjectId = mongoose.Types.ObjectId;

export type PropType = {
  type: string;
  isArray: boolean;
  required: boolean;
  enum?: any[] | Record<string, any>;
  factory?: (any?: any) => Function | undefined;
};

export type PropDef = {
  metadata: Map<string, any>;
  type: PropType; // type of prop
  options: Omit<PropertyOptions, 'metadata'>;
};

export type SchemaDef = {
  factory: Function;
  parent: string | null;
  metadata: Map<string, any>;
  props: Map<string, PropDef>;
};

export type SchemaMap = Map<string, SchemaDef>;

export type PropMap = Map<string, PropDef>;

export type MetadataModuleOptions = {
  /**
   * If "true", registers `ConfigModule` as a global module.
   * See: https://docs.nestjs.com/modules#global-modules
   */
  isGlobal?: boolean;
};

export type SchemaOptions = {
  mongoose?: mongoose.SchemaOptions;
  decorators?: { [key: string]: ClassDecorator[] };
};

export type PropertyOptions = {
  swagger?: ApiPropertyOptions & { hidden?: boolean };
  transformer?: {
    expose?: boolean | ExposeOptions;
    exclude?: boolean | ExcludeOptions;
    transform?: (
      | [(params: TransformFnParams) => any, TransformOptions]
      | ((params: TransformFnParams) => any)
    )[];
    type?:
      | [(type?: TypeHelpOptions) => Function, TypeOptions]
      | ((type?: TypeHelpOptions) => Function);
  };
  validators?: PropertyDecorator[];
  mongoose?: PropOptions;
  decorators?: { [key: string]: PropertyDecorator[] };
};

export type CommonPropOpts = {
  isArray: boolean;
  isOptional: boolean;
};

export type PropCommonOpts = Pick<
  NonNullable<PropertyOptions['transformer']>,
  'exclude' | 'transform'
> &
  Pick<PropertyOptions, 'validators'> & {
    private?: boolean;
  } & {
    arrayMinSize?: number;
    arrayMaxSize?: number;
  };
