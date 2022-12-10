import { Schema } from '@nestjs/mongoose';
import { _MetadataStorageV1 } from '../libs';
import { SchemaOptions } from '../types';

export function $Schema(options: SchemaOptions = {}): ClassDecorator {
  return (target) => {
    // Add information to metadata storage
    _MetadataStorageV1.setSchema(target);

    // Apply custom metadata
    if (options.metadata !== undefined) {
      for (let key in options.metadata) {
        _MetadataStorageV1.setMetadata(key, options.metadata[key], target);
      }
    }

    // Apply mongoose decorators
    if (options?.mongoose !== undefined) {
      Schema(options.mongoose)(target);
    }
  };
}
