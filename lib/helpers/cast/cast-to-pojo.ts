import { checkNullOrUndefinedString, CommonCastOptions } from './common';

export type CastToPojo = {};

export type CastToPojoOptions = CommonCastOptions &
  CastToPojo & {
    default?: object;
  };
export type CastToPojoArrayOptions = CommonCastOptions &
  CastToPojo & {
    default?: object[];
  };

export function castToPojo(value: any, options: CastToPojoOptions = {}): object | null | undefined {
  value = checkNullOrUndefinedString(value, options);
  let newValue: object | null | undefined;
  if (value !== null && value !== undefined) {
    try {
      newValue = _castToPojo(value, options);
    } catch (_) {
      newValue = options.default;
    }
  } else if (options.default !== undefined) {
    newValue = options.default;
  }
  return newValue;
}

export function castToPojoArray(
  value: any,
  options: CastToPojoArrayOptions = {},
): object[] | null | undefined {
  value = checkNullOrUndefinedString(value, options);
  value = Array.isArray(value) ? value : undefined;
  let newValue: object[] | null | undefined;
  if (value !== null && value !== undefined) {
    try {
      newValue = [];
      for (let element of value) {
        newValue.push(_castToPojo(element, options));
      }
    } catch (_) {
      newValue = options.default;
    }
  } else if (options.default !== undefined) {
    newValue = options.default;
  }
  return newValue;
}

function _castToPojo(value: any, options: CastToPojo = {}) {
  let newValue: object;
  if (typeof value === 'object') {
    // clean object
    newValue = JSON.parse(JSON.stringify(value));
  } else if (typeof value === 'string') {
    newValue = JSON.parse(value.trim());
  } else {
    throw new Error('Cast to pojo error');
  }

  if (typeof newValue !== 'object' || !newValue) throw new Error('Cast to pojo error');

  return newValue;
}
