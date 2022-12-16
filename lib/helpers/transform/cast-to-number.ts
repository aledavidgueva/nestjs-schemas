import { TransformFnParams } from 'class-transformer';
import {
  CastToNumberOptions,
  castToNumber as castToNumberFn,
  CastToNumberArrayOptions,
  castToNumberArray as castToNumberArrayFn,
} from '../cast';

export function castToNumber(options: CastToNumberOptions = {}) {
  return (params: TransformFnParams) => {
    return castToNumberFn(params.value, options);
  };
}

export function castToNumberArray(options: CastToNumberArrayOptions = {}) {
  return (params: TransformFnParams) => {
    return castToNumberArrayFn(params.value, options);
  };
}
