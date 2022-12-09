/* eslint-disable @typescript-eslint/ban-types */
import { PropType, SchemaMap, TypeInfo } from '../types';
import 'reflect-metadata';

class MetadataStorageHost {
  private _schemas: SchemaMap = new Map();

  setSchema(
    schema: Function | Object, //
    metadata: Map<string, any> = new Map(),
  ) {
    // check and get schema
    const schemaName = this._getName(schema);
    if (!this._schemas.has(schemaName)) {
      const parentName = this._getParentName(schema);

      this._schemas.set(schemaName, {
        factory: this._getFactory(schema),
        parent: parentName,
        props: new Map(),
        metadata,
      });

      if (parentName) {
        this.copyProps(this._getParent(schema), schema);
      }
    }
  }

  setPropInSchema(
    schema: Function | Object, //
    propertyName: string,
    typeInfo?: TypeInfo,
    initialMetadata: Map<string, any> = new Map(),
  ) {
    // check and get schema
    this.setSchema(schema);
    const schemaName = this._getName(schema);
    const schemaDef = this._schemas.get(schemaName)!;
    // check and get prop
    try {
      schemaDef.props.set(propertyName, {
        type: this._objectTypeDetector(schema, propertyName, typeInfo),
        metadata: initialMetadata,
      });
    } catch (err) {
      throw new Error(
        `Error trying detect type for prop '${propertyName}' on schema ${schemaName}`,
      );
    }
  }

  setMetadata(
    schema: Function | Object, //
    propertyName: string,
    key: string,
    value: any,
  ) {
    const schemaName = this._getName(schema);
    const schemaDef = this._schemas.get(schemaName);
    if (!schemaDef) {
      throw new Error(`Error setting metadata: Schema ${schemaName} not found.`);
    }
    const propDef = schemaDef.props.get(propertyName);
    if (!propDef) {
      throw new Error(
        `Error setting metadata: Property ${propertyName} not found in schema ${schemaName}.`,
      );
    }
    propDef.metadata.set(key, value);
  }

  getMetadata(
    schema: string | Function | Object, //
    propertyName: string,
    key: string,
  ): any {
    const schemaName = this._getName(schema);
    const schemaDef = this._schemas.get(schemaName);
    if (!schemaDef) {
      throw new Error(`Error getting metadata: Schema ${schemaName} not found.`);
    }
    const propDef = schemaDef.props.get(propertyName);
    if (!propDef) {
      throw new Error(
        `Error getting metadata: Property ${propertyName} not found in schema ${schemaName}.`,
      );
    }
    return propDef.metadata.get(key);
  }

  getSchemas() {
    return this._schemas;
  }

  getSchema(schema: string | Function | Object) {
    const schemaName = this._getName(schema);
    return this._schemas.get(schemaName);
  }

  getSchemaProps(schema: string | Function | Object) {
    const schemaName = this._getName(schema);
    return this._schemas.get(schemaName)?.props;
  }

  getSchemaTypes(schema: string | Function | Object) {
    const schemaName = this._getName(schema);
    const schemaDef = this._schemas.get(schemaName);
    const map = new Map();
    schemaDef?.props.forEach((propDef, propertyName) => {
      map.set(propertyName, propDef.type);
    });
    return map;
  }

  getProp(schema: string | Function | Object, propertyName: string) {
    const schemas = this.getSchema(schema);
    return schemas?.props.get(propertyName);
  }

  getSchemaByName(schemaName: string) {
    return this._schemas.get(schemaName);
  }

  clear() {
    this._schemas.clear();
    //this._properties.clear();
  }

  private _objectTypeDetector(schema: any, propertyName: any, typeInfo: TypeInfo = {}): PropType {
    const reflectedType = Reflect.getMetadata('design:type', schema, propertyName);

    let type: any = 'undefined';
    if (typeInfo.type) {
      type = typeInfo.type;
    } else if (typeInfo.factory) {
      type = typeInfo.factory();
    } else {
      type = reflectedType;
    }

    let className = 'undefined';

    const isArray =
      Array.isArray(typeInfo.type) || typeInfo.type === Array || reflectedType === Array;

    if (Array.isArray(type)) {
      type = type[0];
      className = this._getName(type);
    } else {
      className = this._getName(type);
    }

    if (className === 'undefined' || className === 'Array' || className === 'Object') {
      throw new Error(`Unrecognized type`);
    }

    return {
      type: className,
      isArray: isArray,
      required: typeInfo.required ?? true,
      factory: typeInfo.factory,
      enum: typeInfo.enum,
    };
  }

  private _getFactory(schema: Function | Object) {
    return schema instanceof Function ? schema : schema.constructor;
  }

  private _getParent(schema: Function | Object) {
    return Object.getPrototypeOf(this._getFactory(schema));
  }

  private _getParentName(schema: Function | Object): string | null {
    const name = this._getParent(schema).name ?? null;
    return name ? name : null;
  }

  private _getName(schema: string | Function | Object): string {
    return typeof schema === 'string' ? schema : this._getFactory(schema).name;
  }

  schemaExists(schema: string | Function | Object) {
    const schemaName = this._getName(schema);
    return this._schemas.has(schemaName);
  }

  getProps(schema: string | Function | Object) {
    const schemaMetadata = this.getSchema(schema);
    if (!schemaMetadata) {
      return undefined;
    }
    const properties = [];
    for (const property of schemaMetadata.props.keys()) {
      properties.push(property);
    }
    return properties;
  }

  copyProps(
    source: Function | Object,
    dest: Function | Object,
    opts: {
      includeProps?: string[];
      excludeProps?: string[];
      makePartial?: boolean;
    } = {},
  ) {
    // check and get props of source schema
    if (!this.schemaExists(source))
      throw new Error(`Source schema ${this._getName(source)} not exists.`);
    const sourceProps = this._schemas.get(this._getName(source))!.props;
    // check and get dest schema
    this.setSchema(dest);
    const destProps = this._schemas.get(this._getName(dest))!.props;
    // copy process
    sourceProps.forEach((def, key) => {
      if (
        (opts.excludeProps === undefined || !opts.excludeProps.includes(key)) &&
        (opts.includeProps === undefined || opts.includeProps.includes(key))
      ) {
        destProps.set(key, {
          metadata: new Map(def.metadata),
          type: { ...def.type },
        });
        if (opts.makePartial === true) destProps.get(key)!.type.required = false;
      }
    });
  }
}

///
const globalRef: any = global;
export const metadataStorage: MetadataStorageHost =
  globalRef.metadataStorage || (globalRef.metadataStorage = new MetadataStorageHost());
