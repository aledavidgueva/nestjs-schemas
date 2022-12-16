import { TransformFnParams } from 'class-transformer';
import {
  CastToStringOptions,
  castToString as castToStringFn,
  CastToStringArrayOptions,
  castToStringArray as castToStringArrayFn,
} from '../cast';

export function TransformToString(options: CastToStringOptions = {}) {
  return (params: TransformFnParams) => {
    return castToStringFn(params.value, options);
  };
}

export function TransformToStringArray(options: CastToStringArrayOptions = {}) {
  return (params: TransformFnParams) => {
    return castToStringArrayFn(params.value, options);
  };
}
