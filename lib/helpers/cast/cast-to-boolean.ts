import { checkNullOrUndefinedString, CommonCastOptions } from './common';

export type CastToBoolean = {};

export type CastToBooleanOptions = CommonCastOptions &
  CastToBoolean & {
    default?: boolean;
  };

export type CastToBooleanArrayOptions = CommonCastOptions &
  CastToBoolean & {
    default?: boolean[];
  };

export function castToBoolean(value: any, options: CastToBooleanOptions = {}) {
  value = checkNullOrUndefinedString(value, options);
  let newValue: boolean | null | undefined;
  if (value !== null && value !== undefined) {
    try {
      newValue = _castToBoolean(value, options);
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

export function castToBooleanArray(value: any, options: CastToBooleanArrayOptions = {}) {
  value = checkNullOrUndefinedString(value, options);
  value = Array.isArray(value) ? value : undefined;
  let newValue: boolean[] | null | undefined;
  if (newValue !== null && newValue !== undefined) {
    try {
      newValue = [];
      for (let element of value) {
        newValue.push(_castToBoolean(element, options));
      }
    } catch (_) {
      newValue = options.default;
    }
  } else if (options.default !== undefined) {
    newValue = options.default;
  }
  return newValue;
}

function _castToBoolean(value: any, options: CastToBoolean = {}) {
  let newValue: boolean;
  if (typeof value === 'boolean') {
    newValue = value;
  } else {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      newValue = trimmed !== '0' && trimmed.toLowerCase() !== 'false' && trimmed !== '';
    } else {
      newValue = Boolean(value);
    }
  }
  return newValue;
}
