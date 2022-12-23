import { Schema } from '@nestjs/mongoose';
import { _MetadataStorageV1 } from '../libs/storage';
import { SchemaOptions } from '../types';

export function $Schema(options: SchemaOptions = {}): ClassDecorator {
  return (target) => {
    // Add information to metadata storage
    _MetadataStorageV1.setSchema(target);

    // Apply custom decorators
    if (options.decorators !== undefined) {
      for (let groupKey in options.decorators) {
        const decorators = options.decorators[groupKey];
        decorators.forEach((Decorator: ClassDecorator) => {
          if (Decorator(target) !== undefined) {
            throw new Error(`
              Invalid value detected in the metadata config in schema ${
                target.name ?? target.constructor.name
              } => ${Decorator.name ?? Decorator.constructor.name ?? Decorator}.
              The value passed is not a valid decorator.
              Remember make call over decorator function (add parenthesis).
              For example, CustomDecorator(). Warning to use CustomDecorator without valid brackets.
            `);
          }
        });
      }
    }

    // Apply mongoose decorators
    if (options?.mongoose !== undefined) {
      Schema(options.mongoose)(target);
    }
  };
}
