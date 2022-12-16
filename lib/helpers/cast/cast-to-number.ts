export type CastToNumberOptions = {
  default?: number;
  nullString?: boolean;
  undefinedString?: boolean;
  round?: 'round' | 'floor' | 'ceil' | 'trunc';
  fixed?: number;
  isArray?: boolean;
};

export function castToNumber(value: any, options: CastToNumberOptions = {}) {
  const type = 'number';

  if (typeof value === 'string') {
    if (options.nullString && value.trim() === 'null') value = null;
    if (options.undefinedString && value.trim() === 'undefined') value = undefined;
  }

  let newValue: number | null | undefined;
  if (typeof value === type || value === null || value === undefined) {
    newValue = value;
  } else {
    try {
      newValue = Number(value);
      if (Number.isNaN(newValue) || !Number.isFinite(newValue)) {
        newValue = undefined;
      }
    } catch (_) {
      newValue = undefined;
    }
  }

  if (options.default && typeof newValue !== type) {
    return options.default;
  }

  if (typeof newValue === type) {
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
  }

  return newValue;
}
