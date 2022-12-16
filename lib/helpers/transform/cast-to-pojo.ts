import { TransformFnParams } from 'class-transformer';
import { CastToPojoOptions, castToPojo as castToPojoFn } from '../cast';

export function castToPojo(options: CastToPojoOptions = {}) {
  return (params: TransformFnParams) => {
    return castToPojoFn(params.value, options);
  };
}
