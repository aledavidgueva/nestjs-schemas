import { TransformFnParams } from 'class-transformer';
import { CastToDateOptions, castToDate as castToDateFn } from '../cast';

export function castToDate(options: CastToDateOptions = {}) {
  return (params: TransformFnParams) => {
    return castToDateFn(params.value, options);
  };
}
