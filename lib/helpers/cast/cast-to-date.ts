import moment from 'moment';
import { checkNullOrUndefinedString, CommonCastOptions } from './common';

export type CastToDate = {};

export type CastToDateOptions = CommonCastOptions &
  CastToDate & {
    default?: Date;
  };

export type CastToDateArrayOptions = CommonCastOptions &
  CastToDate & {
    default?: Date[];
  };

export function castToDate(value: any, options: CastToDateOptions = {}): Date | null | undefined {
  value = checkNullOrUndefinedString(value, options);
  let newValue: Date | null | undefined;
  if (value !== null && value !== undefined) {
    try {
      newValue = _castToDate(value, options);
    } catch (_) {
      newValue = options.default;
    }
  } else if (options.default !== undefined) {
    newValue = options.default;
  }
  return newValue;
}

export function castToDateArray(
  value: any,
  options: CastToDateArrayOptions = {},
): Date[] | null | undefined {
  value = checkNullOrUndefinedString(value, options);
  value = Array.isArray(value) ? value : undefined;
  let newValue: Date[] | null | undefined;
  if (value !== null && value !== undefined) {
    try {
      newValue = [];
      for (let element of value) {
        newValue.push(_castToDate(element, options));
      }
    } catch (_) {
      newValue = options.default;
    }
  } else if (options.default !== undefined) {
    newValue = options.default;
  }
  return newValue;
}

function _castToDate(value: any, options: CastToDate = {}) {
  let newValue: Date;
  if (typeof value === 'object' && value instanceof Date) {
    newValue = value;
  } else {
    newValue = moment(value).toDate();
    if (typeof newValue !== 'object' || !(newValue instanceof Date))
      throw new Error('Cast to date error');
  }
  return newValue;
}
