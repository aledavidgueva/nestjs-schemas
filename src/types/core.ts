export type PropType = {
  type: string;
  isArray: boolean;
  required: boolean;
  enum?: { [key: string | number]: string | number } | undefined;
  factory?: (any?: any) => Function | undefined;
};

export type TypeInfo = Partial<
  Omit<PropType, 'type'> & {
    type: any;
  }
>;

export type PropDef = {
  metadata: Map<string, any>;
  type: PropType; // type of prop
};

export type SchemaDef = {
  factory: Function;
  parent: string;
  metadata: Map<string, any>;
  props: Map<string, PropDef>;
};

export type SchemaMap = Map<string, SchemaDef>;

export type PropMap = Map<string, PropDef>;
