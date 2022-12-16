import { TransformFnParams } from 'class-transformer';
import {
  CastToPojoOptions,
  castToPojo as castToPojoFn,
  CastToPojoArrayOptions,
  castToPojoArray as castToPojoArrayFn,
} from '../cast';

export function castToPojo(options: CastToPojoOptions = {}) {
  return (params: TransformFnParams) => {
    return castToPojoFn(params.value, options);
  };
}

export function castToPojoArray(options: CastToPojoArrayOptions = {}) {
  return (params: TransformFnParams) => {
    return castToPojoArrayFn(params.value, options);
  };
}
