import { TransformFnParams } from 'class-transformer';
import { CastToNumberOptions, castToNumber as castToNumberFn } from '../cast';

export function castToNumber(options: CastToNumberOptions = {}) {
  return (params: TransformFnParams) => {
    return castToNumberFn(params.value, options);
  };
}
