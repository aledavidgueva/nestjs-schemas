import { TransformFnParams } from 'class-transformer';
import {
  CastToObjectIdOptions,
  castToObjectId as castToObjectIdFn,
  CastToObjectIdArrayOptions,
  castToObjectIdArray as castToObjectIdArrayFn,
} from '../cast';

export function TransformToObjectId(options: CastToObjectIdOptions = {}) {
  return (params: TransformFnParams) => {
    return castToObjectIdFn(params.value, options);
  };
}

export function TransformToObjectIdArray(options: CastToObjectIdArrayOptions = {}) {
  return (params: TransformFnParams) => {
    return castToObjectIdArrayFn(params.value, options);
  };
}
