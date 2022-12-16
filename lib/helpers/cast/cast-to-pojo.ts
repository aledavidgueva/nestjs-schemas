export type CastToPojoOptions = {
  default?: object;
  nullString?: boolean;
  undefinedString?: boolean;
  isArray?: boolean;
};

export function castToPojo(value: any, options: CastToPojoOptions = {}) {
  const type = 'object';

  if (typeof value === 'string') {
    if (options.nullString && value.trim() === 'null') value = null;
    if (options.undefinedString && value.trim() === 'undefined') value = undefined;
  }

  let newValue: object | null | undefined;
  if (value === null || value === undefined) {
    newValue = value;
  } else {
    try {
      if (typeof value === type) {
        // clean object
        newValue = JSON.parse(JSON.stringify(value));
      } else if (typeof value === 'string') {
        newValue = JSON.parse(value.trim());
      } else {
        newValue = undefined;
      }
    } catch (_) {
      newValue = undefined;
    }
  }

  if (options.default && typeof newValue !== type) {
    return options.default;
  }

  /*   if (typeof newValue === type) {
    // Apply type transformation
  }
 */
  return newValue;
}
