/* eslint-disable @typescript-eslint/ban-types */
class MetadataStorageHost {
  private _schemas: Map<string, Map<string, any>> = new Map();
  private _cacheProjections: Map<string, any> = new Map();
  private _cachePopulate: Map<string, any> = new Map();

  addToSchema(schema: string | Function, metadata: any) {
    const schemaName = this._schemaName(schema);
    if (!this._schemas.has(schemaName)) {
      this._schemas.set(schemaName, new Map());
    }
    metadata.schemaName = schemaName;
    metadata.objectType = this.objectTypeDetector(metadata);
    this._schemas.get(schemaName)?.set(metadata.propertyName, { ...metadata });
    // this._sortSchema(schemaName);
  }

  addMetadata(metadata: any) {
    const schema =
      metadata.target instanceof Function ? metadata.target : metadata.target.constructor;
    this.addToSchema(schema, metadata);
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
    const schemas = this._schemas.get(schemaName);
    const map = new Map();
    schemas?.forEach((metadata, property) => {
      map.set(property, { ...metadata.objectType });
    });
    return map;
  }

  getProperty(schema: string | Function, propertyName: string) {
    const schemas = this.getSchema(schema);
    return schemas?.get(propertyName);
  }

  getSchemaByName(schemaName: string) {
    return this._schemas.get(schemaName);
  }

  clear() {
    this._schemas.clear();
    //this._properties.clear();
  }

  private _sortSchema(schemaName: string) {
    const oldSchema = this.getSchema(schemaName);
    if (oldSchema) {
      this._schemas.set(schemaName, new Map([...oldSchema].sort()));
    }
  }

  objectTypeDetector(metadata: any) {
    if (metadata.objectType) {
      return metadata.objectType;
    }

    let type = metadata?.type ?? metadata?.typeFunction?.() ?? metadata?.reflectedType;
    let className = 'undefined';

    const isArray =
      Array.isArray(metadata?.type) ||
      metadata?.type === Array ||
      metadata?.reflectedType === Array;

    if (Array.isArray(type)) {
      type = type[0];
      className = this._getTypeName(type);
    } else {
      className = this._getTypeName(type);
    }

    if (className === 'undefined' || className === 'Array') {
      console.log({
        metadata,
        isArray,
        type,
      });
      throw 'No se pudo detectar el tipo de dato exacto para la propiedad ' + metadata.propertyName;
    }

    const objectType = {
      type: className,
      isArray: isArray,
      isFinal: this._isFinal(className),
    };

    return objectType;
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
    return (
      typeName.lastIndexOf('Dto') !== typeName.length - 3 &&
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
  getProperties(schema: string | Function) {
    const schemaMetadata = this.getSchema(schema);
    if (!schemaMetadata) {
      return null;
    }
    const properties = [];
    for (const property of schemaMetadata.keys()) {
      properties.push(property);
    }
    return properties;
  }

  getProjection(schema: string | Function, target?: string | Function) {
    const schemaName = this._schemaName(schema);
    const targetName = target ? this._schemaName(target) : null;
    const cacheKey = !targetName ? schemaName : `${schemaName}:${targetName}`;
    if (this._cacheProjections.has(cacheKey)) {
      return this._cacheProjections.get(cacheKey);
    }
    const schemaProjection = this._getProjection(schema);
    const targetProjection = this._getProjection(schema);
    if (targetProjection) {
      for (const key in schemaProjection) {
        if (targetProjection[key] === undefined) {
          delete schemaProjection[key];
        }
      }
    }
    this._cacheProjections.set(cacheKey, schemaProjection);
    return schemaProjection;
  }

  private _getProjection(target: any, projection: any = {}, parents: string[] = []) {
    const schemaMetadata = metadataStorage.getSchema(target);
    if (!schemaMetadata) {
      return null;
    }
    for (const [property, metadata] of schemaMetadata.entries()) {
      const key = [...parents, property].join('.');
      if (metadata.objectType.isFinal || metadata?.ref) {
        projection[key] = 1;
      } else {
        this._getProjection(metadata.objectType.type, projection, [...parents, property]);
      }
    }
    return projection;
  }

  getPopulate(schema: string | Function) {
    const schemaName = this._schemaName(schema);
    if (this._cachePopulate.has(schemaName)) {
      return this._cachePopulate.get(schemaName);
    }
    const schemaPopulate = this._getPopulate(schema);
    this._cachePopulate.set(schemaName, schemaPopulate);
    return schemaPopulate;
  }

  private _getPopulate(schema: string | Function) {
    const schemaMetadata = metadataStorage.getSchema(schema);
    if (!schemaMetadata) {
      return null;
    }
    const populate: any[] = [];
    for (const [property, metadata] of schemaMetadata.entries()) {
      if (!metadata.objectType.isFinal && metadata?.ref) {
        const def: any = {
          path: property,
          select: this._getSelect(metadata.objectType.type),
        };
        // is nested object?
        const nested = this._getPopulate(metadata.objectType.type);
        if (nested?.length) {
          def.populate = nested;
        }
        populate.push(def);
      }
    }
    return populate;
  }

  /**
   * Return the select expected by mongoose for the populate object
   * i.e. "_id name address etc"
   */
  private _getSelect(schemaName: string) {
    const schemaMetadata = metadataStorage.getSchema(schemaName);
    if (!schemaMetadata) {
      return null;
    }
    const select: string[] = [];
    for (const property of schemaMetadata.keys()) {
      select.push(property);
    }
    return select.join(' ');
  }
}

///
const globalRef: any = global;
export const metadataStorage: MetadataStorageHost =
  globalRef.metadataStorage || (globalRef.metadataStorage = new MetadataStorageHost());
