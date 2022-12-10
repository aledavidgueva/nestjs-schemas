import { _MetadataStorageV1 } from '../libs';

export function _Metadata(metadata: { [key: string]: any }): PropertyDecorator {
  return (target: any, property?: any) => {
    for (let key in metadata) {
      _MetadataStorageV1.setMetadata(key, metadata[key], target, property);
    }
  };
}
