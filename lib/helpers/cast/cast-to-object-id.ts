import { Types } from 'mongoose';
import { checkNullOrUndefinedString, CommonCastOptions } from './common';

export type CastToObjectId = {};

export type CastToObjectIdOptions = CommonCastOptions &
  CastToObjectId & {
    default?: Types.ObjectId;
  };

export type CastToObjectIdArrayOptions = CommonCastOptions &
  CastToObjectId & {
    default?: Types.ObjectId[];
  };

export function castToObjectId(value: any, options: CastToObjectIdOptions = {}) {
  value = checkNullOrUndefinedString(value, options);
  let newValue: Types.ObjectId | null | undefined;
  if (newValue !== null && newValue !== undefined) {
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

export function castToObjectIdArray(value: any, options: CastToObjectIdArrayOptions = {}) {
  value = checkNullOrUndefinedString(value, options);
  value = Array.isArray(value) ? value : undefined;
  let newValue: Types.ObjectId[] | null | undefined;
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
  } else {
    newValue = value;
  }
  return newValue;
}

function _castToObjectId(value: any, options: CastToObjectId = {}) {
  let newValue: Types.ObjectId;
  if (typeof value === 'object' && value instanceof Types.ObjectId) {
    newValue = value;
  } else {
    if (Types.ObjectId.isValid(value)) {
      newValue = new Types.ObjectId(value);
    } else {
      throw new Error('Cast to object id error');
    }
  }
  return newValue;
}
