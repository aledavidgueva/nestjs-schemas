import { TransformFnParams } from 'class-transformer';
import {
  CastToDateOptions,
  castToDate as castToDateFn,
  CastToDateArrayOptions,
  castToDateArray as castToDateArrayFn,
} from '../cast';

export function castToDate(options: CastToDateOptions = {}) {
  return (params: TransformFnParams) => {
    return castToDateFn(params.value, options);
  };
}

export function castToDateArray(options: CastToDateArrayOptions = {}) {
  return (params: TransformFnParams) => {
    return castToDateArrayFn(params.value, options);
  };
}
