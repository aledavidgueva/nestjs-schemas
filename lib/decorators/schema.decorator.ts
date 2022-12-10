import { _MetadataStorageV1 } from '../libs';

export function $Schema(
  options: {
    metadata?: { [key: string]: any };
  } = {},
): ClassDecorator {
  return (target) => {
    _MetadataStorageV1.setSchema(target);
    if (options.metadata !== undefined) {
      for (let key in options.metadata) {
        _MetadataStorageV1.setMetadata(key, options.metadata[key], target);
      }
    }
  };
}
