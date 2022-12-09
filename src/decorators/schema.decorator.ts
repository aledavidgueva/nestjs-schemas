import { metadataStorage } from '../lib/storage';

export function _Schema(): ClassDecorator {
  return (target) => {
    metadataStorage.setSchema(target);
  };
}
