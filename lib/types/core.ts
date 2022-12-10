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
  metadata?: { [key: string]: any };
};

export type PropertyOptions = {
  swagger?: ApiPropertyOptions;
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
  validator?: PropertyDecorator[];
  mongoose?: PropOptions;
  metadata?: { [key: string]: any };
  [group: string]: PropertyDecorator[] | any;
};
