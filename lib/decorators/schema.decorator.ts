import { _MetadataStorageV1 } from '../libs';

export function _Schema(metadata?: Map<string, any>): ClassDecorator {
  return (target) => {
    _MetadataStorageV1.setSchema(target, metadata);
  };
}
