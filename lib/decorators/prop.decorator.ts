import { _MetadataStorageV1 } from '../libs';
import { TypeInfo } from '../types';

export function _Prop(typeInfo: TypeInfo = {}, metadata?: Map<string, any>): PropertyDecorator {
  return (target: any, key: any) => {
    _MetadataStorageV1.setPropInSchema(target, key, typeInfo, metadata);
  };
}
