import { checkNullOrUndefinedString, CommonCastOptions } from './common';

export type CastToNumber = {
  round?: 'round' | 'floor' | 'ceil' | 'trunc';
  fixed?: number;
  isArray?: boolean;
};

export type CastToNumberOptions = CommonCastOptions &
  CastToNumber & {
    default?: number;
  };

export type CastToNumberArrayOptions = CommonCastOptions &
  CastToNumber & {
    default?: number[];
  };

export function castToNumber(value: any, options: CastToNumberOptions = {}) {
  value = checkNullOrUndefinedString(value, options);
  let newValue: number | null | undefined;
  if (newValue !== null && newValue !== undefined) {
    try {
      newValue = _castToNumber(value);
    } catch (_) {
      newValue = options.default;
    }
  } else if (options.default !== undefined) {
    newValue = options.default;
  }
  return newValue;
}

export function castToNumberArray(value: any, options: CastToNumberArrayOptions = {}) {
  value = checkNullOrUndefinedString(value, options);
  value = Array.isArray(value) ? value : undefined;
  let newValue: number[] | null | undefined;
  if (value !== null && value !== undefined) {
    try {
      newValue = [];
      for (let element of value) {
        newValue.push(_castToNumber(element, options));
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

function _castToNumber(value: any, options: CastToNumber = {}) {
  let newValue: number;
  if (typeof value === 'number') {
    newValue = value;
  } else {
    newValue = Number(value);
    if (Number.isNaN(newValue) || !Number.isFinite(newValue))
      throw new Error('Cast to number error');
  }

  // Apply type transformation
  if (options.round) {
    switch (options.round) {
      case 'round':
        newValue = Math.round(newValue!);
        break;
      case 'floor':
        newValue = Math.floor(newValue!);
        break;
      case 'ceil':
        newValue = Math.ceil(newValue!);
        break;
      case 'trunc':
        newValue = Math.trunc(newValue!);
        break;
    }
  }

  if (options.fixed) {
    newValue = Number(newValue?.toFixed(options.fixed));
  }

  return newValue;
}
