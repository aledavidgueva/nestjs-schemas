import { Types } from 'mongoose';

export type CastToObjectIdOptions = {
  default?: string;
  nullString?: boolean;
  undefinedString?: boolean;
  isArray?: boolean;
};

export function castToObjectId(value: any, options: CastToObjectIdOptions = {}) {
  if (typeof value === 'string') {
    if (options.nullString && value.trim() === 'null') value = null;
    if (options.undefinedString && value.trim() === 'undefined') value = undefined;
  }

  let newValue: Types.ObjectId | null | undefined;
  if (
    (typeof value === 'object' && value instanceof Types.ObjectId) ||
    value === null ||
    value === undefined
  ) {
    newValue = value;
  } else {
    try {
      if (Types.ObjectId.isValid(value)) {
        newValue = new Types.ObjectId(value);
      } else {
        newValue = undefined;
      }
    } catch (_) {
      newValue = undefined;
    }
  }

  if (options.default && (typeof newValue !== 'object' || !(newValue instanceof Types.ObjectId))) {
    return options.default;
  }

  /*   if (typeof value === 'object' && value instanceof Types.ObjectId) {
    // Apply type transformation
  } */
  return newValue;
}
