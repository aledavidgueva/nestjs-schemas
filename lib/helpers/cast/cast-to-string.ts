import { checkNullOrUndefinedString, CommonCastOptions } from './common';

export type CastToString = {
  trim?: boolean;
  case?: 'upperCase' | 'lowerCase';
};

export type CastToStringOptions = CommonCastOptions &
  CastToString & {
    default?: string;
  };

export type CastToStringArrayOptions = CommonCastOptions &
  CastToString & {
    default?: string[];
  };

export function castToString(
  value: any,
  options: CastToStringOptions = {},
): string | null | undefined {
  value = checkNullOrUndefinedString(value, options);
  let newValue: string | null | undefined;
  if (value !== null && value !== undefined) {
    try {
      newValue = _castToString(value, options);
    } catch (_) {
      newValue = options.default;
    }
  } else if (options.default !== undefined) {
    newValue = options.default;
  }
  return newValue;
}

export function castToStringArray(
  value: any,
  options: CastToStringArrayOptions = {},
): string[] | null | undefined {
  value = checkNullOrUndefinedString(value, options);
  value = Array.isArray(value) ? value : undefined;
  let newValue: string[] | null | undefined;
  if (value !== null && value !== undefined) {
    try {
      newValue = [];
      for (let element of value) {
        newValue.push(_castToString(element, options));
      }
    } catch (_) {
      newValue = options.default;
    }
  } else if (options.default !== undefined) {
    newValue = options.default;
  }
  return newValue;
}

// TODO: Add more case opts as https://github.com/techniboogie-dart/recase/blob/master/lib/recase.dart
function _castToString(value: any, options: CastToString = {}) {
  let newValue: string;
  if (typeof value === 'string') {
    newValue = value;
  } else {
    if (typeof value['toString'] === 'function') {
      newValue = value.toString();
    } else {
      newValue = String(value);
    }
  }

  // Apply type transformation
  if (options.trim) {
    newValue = newValue?.trim();
  }

  if (options.case) {
    switch (options.case) {
      case 'upperCase':
        newValue = newValue?.toUpperCase();
        break;
      case 'lowerCase':
        newValue = newValue?.toLowerCase();
        break;
    }
  }

  return newValue;
}
