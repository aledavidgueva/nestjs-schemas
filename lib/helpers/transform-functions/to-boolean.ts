import { TransformFnParams } from 'class-transformer';
import {
  CastToBooleanOptions,
  castToBoolean as castToBooleanFn,
  CastToBooleanArrayOptions,
  castToBooleanArray as castToBooleanArrayFn,
} from '../cast';

export function TransformToBoolean(options: CastToBooleanOptions = {}) {
  return (params: TransformFnParams) => {
    return castToBooleanFn(params.value, options);
  };
}

export function TransformToBooleanArray(options: CastToBooleanArrayOptions = {}) {
  return (params: TransformFnParams) => {
    return castToBooleanArrayFn(params.value, options);
  };
}
