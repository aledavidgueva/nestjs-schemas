import { ObjectId } from '../../types';
import { checkNullOrUndefinedString, CommonCastOptions } from './common';

export type CastToObjectId = {};

export type CastToObjectIdOptions = CommonCastOptions &
  CastToObjectId & {
    default?: ObjectId;
  };

export type CastToObjectIdArrayOptions = CommonCastOptions &
  CastToObjectId & {
    default?: ObjectId[];
  };

export function castToObjectId(
  value: any,
  options: CastToObjectIdOptions = {},
): ObjectId | null | undefined {
  value = checkNullOrUndefinedString(value, options);
  let newValue: ObjectId | null | undefined;
  if (value !== null && value !== undefined) {
    try {
      newValue = _castToObjectId(value);
    } catch (_) {
      newValue = options.default;
    }
  } else if (options.default !== undefined) {
    newValue = options.default;
  }
  return newValue;
}

export function castToObjectIdArray(
  value: any,
  options: CastToObjectIdArrayOptions = {},
): ObjectId[] | null | undefined {
  value = checkNullOrUndefinedString(value, options);
  value = Array.isArray(value) ? value : undefined;
  let newValue: ObjectId[] | null | undefined;
  if (value !== null && value !== undefined) {
    try {
      newValue = [];
      for (let element of value) {
        newValue.push(_castToObjectId(element, options));
      }
    } catch (_) {
      newValue = options.default;
    }
  } else if (options.default !== undefined) {
    newValue = options.default;
  }
  return newValue;
}

function _castToObjectId(value: any, options: CastToObjectId = {}) {
  let newValue: ObjectId;
  if (ObjectId.isValid(value)) {
    newValue = new ObjectId(value);
  } else {
    throw new Error('Cast to object id error');
  }
  return newValue;
}
