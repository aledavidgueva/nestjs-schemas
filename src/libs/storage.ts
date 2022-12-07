/* eslint-disable @typescript-eslint/ban-types */
import { PropType, SchemaMap, TypeInfo } from '../types';

class MetadataStorageHost {
  private _schemas: SchemaMap = new Map();

  //private _cacheProjections: Map<string, any> = new Map();
  //private _cachePopulate: Map<string, any> = new Map();

  setSchema(
    schema: string | Function, //
    metadata: Map<string, any> = new Map(),
  ) {
    // check and get schema
    const schemaName = this._schemaName(schema);
    if (!this._schemas.has(schemaName)) {
      this._schemas.set(schemaName, {
        schemaName,
        metadata,
        props: new Map(),
      });
    }
  }

  setPropInSchema(
    schema: string | Function, //
    propertyName: string,
    typeInfo: TypeInfo,
    initialMetadata: Map<string, any> = new Map(),
  ) {
    // check and get schema
    this.setSchema(schema);
    const schemaName = this._schemaName(schema);
    const schemaDef = this._schemas.get(schemaName)!;
    // check and get prop
    try {
      schemaDef.props.set(propertyName, {
        parent: schemaName,
        isNulleable: undefined,
        type: this._objectTypeDetector(typeInfo),
        metadata: initialMetadata,
      });
    } catch (err) {
      throw new Error(
        `Error trying detect type for prop '${propertyName}' on schema ${schemaName}`,
      );
    }
  }

  setMetadata(
    schema: string | Function, //
    propertyName: string,
    key: string,
    value: any,
  ) {
    const schemaName = this._schemaName(schema);
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
    schema: string | Function, //
    propertyName: string,
    key: string,
  ): any {
    const schemaName = this._schemaName(schema);
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

  getSchema(schema: string | Function) {
    const schemaName = this._schemaName(schema);
    return this._schemas.get(schemaName);
  }

  getSchemaTypes(schema: string | Function) {
    const schemaName = this._schemaName(schema);
    const schemaDef = this._schemas.get(schemaName);
    const map = new Map();
    schemaDef?.props.forEach((propDef, propertyName) => {
      map.set(propertyName, propDef.type);
    });
    return map;
  }

  getProp(schema: string | Function, propertyName: string) {
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

  // TODO: Sort
  /* 
  private _sortSchema(schemaName: string) {
    const oldSchema = this.getSchema(schemaName);
    if (oldSchema) {
      this._schemas.set(schemaName, new Map([...oldSchema].sort()));
    }
  }
  */

  private _objectTypeDetector(typeInfo: TypeInfo): PropType {
    if (typeInfo.objectType) {
      return typeInfo.objectType;
    }

    let type = typeInfo?.type ?? typeInfo?.typeConstructor?.() ?? typeInfo?.reflectedType;
    let className = 'undefined';

    const isArray =
      Array.isArray(typeInfo?.type) ||
      typeInfo?.type === Array ||
      typeInfo?.reflectedType === Array;

    if (Array.isArray(type)) {
      type = type[0];
      className = this._getTypeName(type);
    } else {
      className = this._getTypeName(type);
    }

    if (className === 'undefined' || className === 'Array') {
      /*       console.log({
        metadata,
        isArray,
        type,
      }); */
      throw new Error();
    }

    return {
      type: className,
      isArray: isArray,
      isFinal: this._isFinal(className),
    };
  }

  private _getTypeName(type: any) {
    let typeName = 'undefined';
    if (type?.schemaName) {
      typeName = type.schemaName;
    } else {
      typeName =
        type instanceof Function ? type?.name ?? 'undefined' : type.constructor.name ?? 'undefined';
    }
    return typeName;
  }

  private _isFinal(typeName: string) {
    const isDto =
      typeName.lastIndexOf('Dto') === typeName.length - 3 ||
      typeName.lastIndexOf('DTO') === typeName.length - 3;
    return (
      !isDto &&
      (typeName === 'String' ||
        typeName === 'Number' ||
        typeName === 'Boolean' ||
        typeName === 'Date' ||
        typeName === 'Mixed' ||
        typeName === 'ObjectId')
    );
  }

  private _schemaName(schema: string | Function) {
    return typeof schema === 'string' ? schema : schema.name;
  }

  /**
   * Helpers
   */
  getProps(schema: string | Function) {
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
}

///
const globalRef: any = global;
export const metadataStorage: MetadataStorageHost =
  globalRef.metadataStorage || (globalRef.metadataStorage = new MetadataStorageHost());
