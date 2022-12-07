export type PropType = {
  type: string;
  isArray: boolean;
  isFinal: boolean;
};

export type PropDef = {
  parent: string; // schema name
  metadata: Map<string, any>;
  type: PropType; // type of prop
  isNulleable: boolean | undefined; // TODO: detection pending
};

export type SchemaDef = {
  schemaName: string;
  props: Map<string, PropDef>;
  metadata: Map<string, any>;
};

export type TypeInfo = {
  type?: any;
  typeConstructor?: any;
  reflectedType?: any;
  objectType?: any;
};

export type SchemaMap = Map<string, SchemaDef>;

export type PropMap = Map<string, PropDef>;
