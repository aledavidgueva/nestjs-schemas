import { TransformFnParams } from 'class-transformer';
import { CastToObjectIdOptions, castToObjectId as castToObjectIdFn } from '../cast';

export function castToObjectId(options: CastToObjectIdOptions = {}) {
  return (params: TransformFnParams) => {
    return castToObjectIdFn(params.value, options);
  };
}
