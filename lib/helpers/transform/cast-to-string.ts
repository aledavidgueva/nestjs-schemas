import { TransformFnParams } from 'class-transformer';
import { CastToStringOptions, castToString as castToStringFn } from '../cast';

export function castToString(options: CastToStringOptions = {}) {
  return (params: TransformFnParams) => {
    return castToStringFn(params.value, options);
  };
}
