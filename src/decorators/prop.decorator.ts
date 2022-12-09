import { metadataStorage } from '../lib/storage';
import { TypeInfo } from '../types';

export function _Prop(typeInfo: TypeInfo = {}): PropertyDecorator {
  return (target: any, key: any) => {
    metadataStorage.setPropInSchema(target, key, typeInfo);
  };
}
