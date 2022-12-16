export type CastToBooleanOptions = {
  default?: boolean;
  nullString?: boolean;
  undefinedString?: boolean;
  isArray?: boolean;
};

export function castToBoolean(value: any, options: CastToBooleanOptions = {}) {
  const type = 'boolean';

  if (typeof value === 'string') {
    if (options.nullString && value.trim() === 'null') value = null;
    if (options.undefinedString && value.trim() === 'undefined') value = undefined;
  }

  let newValue: boolean | null | undefined;
  if (typeof value === type || value === null || value === undefined) {
    newValue = value;
  } else {
    try {
      if (typeof value === 'string') {
        const trimmed = value.trim();
        newValue = trimmed !== '0' && trimmed.toLowerCase() !== 'false' && trimmed !== '';
      } else {
        newValue = Boolean(value);
      }
    } catch (_) {
      newValue = undefined;
    }
  }

  if (options.default && typeof newValue !== type) {
    return options.default;
  }

  return newValue;
}
