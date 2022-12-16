import moment from 'moment';

export type CastToDateOptions = {
  default?: Date;
  nullString?: boolean;
  undefinedString?: boolean;
  isArray?: boolean;
};

export function castToDate(value: any, options: CastToDateOptions = {}) {
  if (typeof value === 'string') {
    if (options.nullString && value.trim() === 'null') value = null;
    if (options.undefinedString && value.trim() === 'undefined') value = undefined;
  }

  let newValue: Date | null | undefined;
  if (
    (typeof value === 'object' && value instanceof Date) ||
    value === null ||
    value === undefined
  ) {
    newValue = value;
  } else {
    try {
      newValue = moment(value).toDate();
    } catch (_) {
      newValue = undefined;
    }
  }

  if (options.default && (typeof newValue !== 'object' || !(newValue instanceof Date))) {
    return options.default;
  }

  /*   if (typeof value === 'object' && value instanceof Date) {
    // Apply type transformation
  } */

  return newValue;
}
