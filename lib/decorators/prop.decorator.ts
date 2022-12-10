import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { _MetadataStorageV1 } from '../libs';
import { PropertyOptions } from '../types';

export function $Prop(options: PropertyOptions = {}): PropertyDecorator {
  return (target: any, property: any) => {
    // Add information to metadata storage
    _MetadataStorageV1.setPropInSchema(target, property, options);

    // Apply custom metadata
    if (options.metadata !== undefined) {
      for (let key in options.metadata) {
        _MetadataStorageV1.setMetadata(key, options.metadata[key], target, property);
      }
    }

    // Apply swagger decorators
    ApiProperty(options.swagger)(target, property);

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
            Transform(element[0], element[1])(target, property);
          }
        });
      }
      // Type
      if (options.transformer.type !== undefined) {
        if (typeof options.transformer.type === 'function') {
          Type(options.transformer.type)(target, property);
        } else {
          Type(options.transformer.type[0], options.transformer.type[1])(target, property);
        }
      }
    }

    // Apply class validator decorators
    if (options?.validator !== undefined) {
      options.validator.forEach((ValidationDecorator) => {
        if (ValidationDecorator(target, property) !== undefined) {
          throw new Error(`
            Invalid value detected in the validator config of property ${property} in schema ${
            target.name ?? target.constructor.name
          } => ${ValidationDecorator.name ?? ValidationDecorator.constructor.name}.
            The value passed is not a valid decorator.
            Remember make call over decorator function (add parenthesis).
            For example, IsArray(). Warning to use IsArray without valid brackets.
          `);
        }
      });
    }

    // Apply mongoose decorators
    if (options?.mongoose !== undefined) {
      Prop(options.mongoose)(target, property);
    }
  };
}
