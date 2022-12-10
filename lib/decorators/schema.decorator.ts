import { _MetadataStorageV1 } from '../libs';

export function $Schema(metadata: { [key: string]: any }): ClassDecorator {
  return (target) => {
    _MetadataStorageV1.setSchema(target);
    for (let key in metadata) {
      _MetadataStorageV1.setMetadata(key, metadata[key], target);
    }
  };
}
