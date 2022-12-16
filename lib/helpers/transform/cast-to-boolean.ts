import { TransformFnParams } from 'class-transformer';
import { CastToBooleanOptions, castToBoolean as castToBooleanFn } from '../cast';

export function castToBoolean(options: CastToBooleanOptions = {}) {
  return (params: TransformFnParams) => {
    return castToBooleanFn(params.value, options);
  };
}
