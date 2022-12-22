export type QueryBuilderGroup = {
  condition: 'and' | 'or';
  rules: (QueryBuilderGroup | QueryBuilderRule)[];
};

export type QueryBuilderRule =
  | {
      field: string;
    }
  | {
      operation: 'eq' | 'ne' | 'like';
      type: 'string';
      value: string;
    }
  | {
      type: 'string';
      operation: 'in' | 'nin';
      value: string[];
    }
  | {
      type: 'number';
      operation: 'equal' | 'notEqual' | 'startsWith' | 'endsWith' | 'contains';
    }
  | {
      operation: 'isNull' | 'isNotNull';
      type: 'string' | 'number' | 'boolean' | 'datetime';
      value: null;
    };
