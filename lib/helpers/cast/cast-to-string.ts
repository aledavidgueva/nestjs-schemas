export type CastToStringOptions = {
  trim?: boolean;
  case?: 'upperCase' | 'lowerCase';
  default?: string;
  nullString?: boolean;
  undefinedString?: boolean;
  isArray?: boolean;
};

// TODO: Add more case opts as https://github.com/techniboogie-dart/recase/blob/master/lib/recase.dart
export function castToString(value: any, options: CastToStringOptions = {}) {
  const type = 'string';

  if (typeof value === 'string') {
    if (options.nullString && value.trim() === 'null') value = null;
    if (options.undefinedString && value.trim() === 'undefined') value = undefined;
  }

  let newValue: string | null | undefined;
  if (typeof value === type || value === null || value === undefined) {
    newValue = value;
  } else {
    try {
      newValue = String(value);
    } catch (_) {
      newValue = undefined;
    }
  }

  if (options.default && typeof newValue !== type) {
    return options.default;
  }

  if (typeof newValue === type) {
    // Apply type transformation
    if (options.trim) newValue = newValue?.trim();
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
  }

  return newValue;
}
