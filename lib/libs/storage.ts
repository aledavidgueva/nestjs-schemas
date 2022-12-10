/* eslint-disable @typescript-eslint/ban-types */
import { PropType, SchemaMap, TypeInfo } from '../types';
import 'reflect-metadata';

/**
 * Storage for simple reflect and custom metadata storage.
 */
class MetadataStorageHostV1 {
  private _schemas: SchemaMap = new Map();

  setSchema(
    schema: Function | Object, //
    metadata: Map<string, any> = new Map(),
  ) {
    // check and get schema
    const schemaName = this._getName(schema);
    if (!this._schemas.has(schemaName)) {
      // inheritance detection
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
    property: string,
    typeInfo?: TypeInfo,
    metadata: Map<string, any> = new Map(),
  ) {
    // check and get schema
    this.setSchema(schema);
    const schemaName = this._getName(schema);
    const schemaDef = this._schemas.get(schemaName)!;
    // check and get prop
    try {
      schemaDef.props.set(property, {
        type: this._objectTypeDetector(schema, property, typeInfo),
        metadata,
      });
    } catch (err) {
      throw new Error(`Error trying detect type for prop '${property}' on schema ${schemaName}`);
    }
  }

  setMetadata(
    key: string,
    value: any,
    schema: Function | Object, //
    property?: string,
  ) {
    const schemaName = this._getName(schema);
    const schemaDef = this._schemas.get(schemaName);
    if (!schemaDef) {
      throw new Error(`Error setting metadata: Schema ${schemaName} not found.`);
    }
    if (property === undefined) {
      schemaDef.metadata.set(key, value);
    } else {
      const propDef = schemaDef.props.get(property);
      if (!propDef) {
        throw new Error(
          `Error setting metadata: Property ${property} not found in schema ${schemaName}.`,
        );
      }
      propDef.metadata.set(key, value);
    }
  }

  getSchemas(
    opts: {
      includeMiddleSchemas?: boolean;
    } = {
      includeMiddleSchemas: false,
    },
  ) {
    return new Map(
      [...this._schemas].filter(([key, value]) => {
        return (
          opts.includeMiddleSchemas === true ||
          (<any>(<unknown>value.factory))._OPENAPI_METADATA_FACTORY === undefined ||
          value.parent !== null
        );
      }),
    );
  }

  getSchema(schema: string | Function | Object) {
    const schemaName = this._getName(schema);
    return this._schemas.get(schemaName);
  }

  schemaExists(schema: string | Function | Object) {
    const schemaName = this._getName(schema);
    return this._schemas.has(schemaName);
  }

  getProps(schema: string | Function | Object) {
    const schemaName = this._getName(schema);
    return this._schemas.get(schemaName)?.props;
  }

  getProp(schema: string | Function | Object, property: string) {
    const schemas = this.getSchema(schema);
    return schemas?.props.get(property);
  }

  getPropsList(schema: string | Function | Object) {
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

  getMetadata(
    key: string,
    schema: string | Function | Object, //
    property?: string,
  ): any {
    const schemaName = this._getName(schema);
    const schemaDef = this._schemas.get(schemaName);
    if (!schemaDef) {
      throw new Error(`Error getting metadata: Schema ${schemaName} not found.`);
    }
    if (property === undefined) {
      return schemaDef.metadata.get(key);
    } else {
      const propDef = schemaDef.props.get(property);
      if (!propDef) {
        throw new Error(
          `Error getting metadata: Property ${property} not found in schema ${schemaName}.`,
        );
      }
      return propDef.metadata.get(key);
    }
  }

  /**
   * Copy properties from class to another.
   */
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

  /**
   * Try to recognize type of schema property
   */
  private _objectTypeDetector(schema: any, property: any, typeInfo: TypeInfo = {}): PropType {
    const reflectedType = Reflect.getMetadata('design:type', schema, property);

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

  /**
   * Find constructor of class
   */
  private _getFactory(schema: Function | Object) {
    return schema instanceof Function ? schema : schema.constructor;
  }

  /**
   * Find parent of class
   */
  private _getParent(schema: Function | Object) {
    return Object.getPrototypeOf(this._getFactory(schema));
  }

  /**
   * Find parent name of class
   */
  private _getParentName(schema: Function | Object): string | null {
    const name = this._getParent(schema).name ?? null;
    return name ? name : null;
  }

  /**
   * Get name of schema
   */
  private _getName(schema: string | Function | Object): string {
    return typeof schema === 'string' ? schema : this._getFactory(schema).name;
  }
}

///
const globalRef: any = global;
export const _MetadataStorageV1: MetadataStorageHostV1 =
  globalRef._MetadataStorageV1 || (globalRef._MetadataStorageV1 = new MetadataStorageHostV1());
