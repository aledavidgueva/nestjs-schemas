import { TransformFnParams } from 'class-transformer';
import {
  CastToBooleanOptions,
  castToBoolean as castToBooleanFn,
  CastToBooleanArrayOptions,
  castToBooleanArray as castToBooleanArrayFn,
} from '../cast';

export function castToBoolean(options: CastToBooleanOptions = {}) {
  return (params: TransformFnParams) => {
    return castToBooleanFn(params.value, options);
  };
}

export function castToBooleanArray(options: CastToBooleanArrayOptions = {}) {
  return (params: TransformFnParams) => {
    return castToBooleanArrayFn(params.value, options);
  };
}
