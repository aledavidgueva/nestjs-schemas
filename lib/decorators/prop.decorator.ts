import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import {
  Exclude,
  ExcludeOptions,
  Expose,
  ExposeOptions,
  Transform,
  TransformFnParams,
  TransformOptions,
  TypeHelpOptions,
  TypeOptions,
} from 'class-transformer';
import { _MetadataStorageV1 } from '../libs';
import { TypeInfo } from '../types';

export function $Prop(
  options: {
    property?: ApiPropertyOptions;
    transformer?: {
      expose?: boolean | ExposeOptions;
      exclude?: boolean | ExcludeOptions;
      transform?: (
        | {
            fn: (params: TransformFnParams) => any;
            options?: TransformOptions;
          }
        | ((params: TransformFnParams) => any)
      )[];
      type?:
        | {
            typeFunction?: (type?: TypeHelpOptions) => Function;
            options?: TypeOptions;
          }
        | ((type?: TypeHelpOptions) => Function);
    };
    validator?: PropertyDecorator[];
    metadata?: { [key: string]: any };
  } = {},
): PropertyDecorator {
  return (target: any, property: any) => {
    //_MetadataStorageV1.setPropInSchema(target, property, typeInfo);
    /*
    for (let key in metadata) {
      _MetadataStorageV1.setMetadata(key, metadata[key], target, property);
    }
    */
    // Apply other decorators

    // Apply swagger decorators
    ApiProperty(options.property)(target, property);

    // Apply class transformer decorators
    if (options?.transformer) {
      // Expose
      if (options.transformer.expose !== undefined) {
        if (options.transformer.expose === true) {
          Expose()(target, property);
        } else if (options.transformer.expose !== false) {
          Expose(options.transformer.expose)(target, property);
        }
      }
      // Exclude
      if (options.transformer.exclude !== undefined) {
        if (options.transformer.exclude === true) {
          Exclude()(target, property);
        } else if (options.transformer.exclude !== false) {
          Exclude(options.transformer.exclude)(target, property);
        }
      }
      // Transform
      if (options.transformer.transform !== undefined) {
        options.transformer.transform.forEach((element) => {
          if (typeof element === 'function') {
            Transform(element)(target, property);
          } else {
            Transform(element.fn, element.options)(target, property);
          }
        });
      }
    }

    // Apply class validator decorators
    if (options?.validator) {
      options.validator.forEach((element) => {
        //
      });
    }
  };
}
