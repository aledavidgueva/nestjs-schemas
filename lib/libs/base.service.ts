/* eslint-disable @typescript-eslint/ban-types */
import { ClassConstructor, ClassTransformOptions, plainToInstance } from 'class-transformer';
import { FilterQuery, Document, PipelineStage } from 'mongoose';
import { ObjectId, SchemaDef } from '../types';
import { defaultTransformOptions, METADATA } from '../constants';
import {
  BaseModel,
  InsertManyOptions,
  InsertOptions,
  FindAllOptions,
  UpdateManyOptions,
  UpdateOneOptions,
  UpdateOptions,
  DeleteOptions,
  DeleteOneOptions,
  DeleteManyOptions,
  ExistsOption,
  CountOptions,
  SoftDeleteOption,
} from './base.model';
import { MetadataService } from '../metadata.service';
import { LookupOpts } from '../decorators';

export type FindAllDocumentsOpts<T> = Omit<FindAllOptions<T>, 'toObject' | 'projection'> & {
  filter?: FilterQuery<any>;
  returnAs?: ClassConstructor<T>;
  transformOptions?: ClassTransformOptions;
};
export type FindOneDocumentOpts<T> = Omit<FindAllDocumentsOpts<T>, 'limit'>;
export type FindDocumentByIdOpts<T> = Omit<FindOneDocumentOpts<T>, 'filter'>;

export type ListDocuments = {
  match?: PipelineStage.Match['$match'];
  sort?: PipelineStage.Sort['$sort'];
  projection?: PipelineStage.Project['$project'];
  skip?: PipelineStage.Skip['$skip'];
  limit?: PipelineStage.Limit['$limit'];
};

export type ListDocumentsOptions<V> = ListDocuments &
  SoftDeleteOption & {
    returnAs?: ClassConstructor<V>;
    transformOptions?: ClassTransformOptions;
  };

/**
 * Proveedor de funciones relacionadas al módulo.
 * Interfaz entre el controlador u otros servicios y el modelo del módulo.
 *
 * @author Alejandro D. Guevara
 */
export abstract class BaseService<
  TDocument extends Document,
  TModel extends BaseModel<TDocument>,
  TReturnDto,
> {
  defaultTransformOptions: ClassTransformOptions = defaultTransformOptions;

  protected _cacheProjections: Map<string, PipelineStage.Project['$project']> = new Map();

  protected _cachePipelines: Map<string, PipelineStage[]> = new Map();

  constructor(
    protected readonly _metadata: MetadataService,
    protected readonly _model: TModel,
    protected readonly _returnAs: ClassConstructor<TReturnDto>,
  ) {}

  /**
   * Return true if soft delete is enabled for this module
   */
  isSoftDeleteEnabled() {
    return this._model.isSoftDeleteEnabled();
  }

  /*   async validateListParams<T = TDocument>(params: ListParams<T>, doc: ClassConstructor<T>) {
    try {
      return;
    } catch (err) {}
  } */

  /*
  async listDocuments<V = TReturnDto>(options?: ListDocumentsOptions<V>): Promise<V[]> {
    const returnAs = <ClassConstructor<V>>(<unknown>options?.returnAs ?? this._returnAs);
    const listOptions = this._createListOptions(returnAs, options);
    const result = await this._model.list(listOptions);
    return <V[]>(<unknown>plainToInstance(returnAs, result, {
      ...this.defaultTransformOptions,
      ...options?.transformOptions,
    }));
  }
  */

  /**
   * Find many documents
   */
  async findAllDocuments<V = TReturnDto>(options?: FindAllDocumentsOpts<V>): Promise<V[]> {
    const returnAs = <ClassConstructor<V>>(<unknown>options?.returnAs ?? this._returnAs);

    // use find or aggregate?
    let result;
    if (!this._hasSubSchemas(returnAs)) {
      result = await this._model.findAll(options?.filter, {
        ...options,
        ...this._getDefaultOptions<V>(returnAs),
      });
    } else {
      result = await this._model.aggregate({
        softDelete: options?.softDelete,
        pipeline: this._getDefaultPipeline(returnAs, options),
      });
    }

    return <V[]>(<unknown>plainToInstance(returnAs, result, {
      ...this.defaultTransformOptions,
      ...options?.transformOptions,
    }));
  }

  /**
   * Find a single document
   */
  async findOneDocument<V = TReturnDto>(options?: FindOneDocumentOpts<V>): Promise<V | null> {
    const result = await this.findAllDocuments({ ...options, limit: 1 });
    return result && Array.isArray(result) && result.length >= 1 ? result.shift() ?? null : null;
  }

  /**
   * Find a single document by id
   */
  async findDocumentById<V = TReturnDto>(
    id: ObjectId,
    options?: FindDocumentByIdOpts<V>,
  ): Promise<V | null> {
    return await this.findOneDocument({ ...options, filter: { _id: id } });
  }

  /**
   * Create a single document by id
   */
  async createDocument<V = TReturnDto>(
    data: Partial<TDocument>,
    options?: InsertOptions & {
      returnAs?: ClassConstructor<V>;
      transformOptions?: ClassTransformOptions;
    },
  ): Promise<V> {
    data = await this.beforeSave<Partial<TDocument>>(data);
    const returnAs = <ClassConstructor<V>>(<unknown>options?.returnAs ?? this._returnAs);
    const result = await this._model.insert(data, {
      ...options,
      ...this._getDefaultOptions<V>(returnAs),
    });

    const doc = !this._hasSubSchemas(returnAs) ? result : await this.findDocumentById(result._id);
    return plainToInstance(returnAs, doc, {
      ...this.defaultTransformOptions,
      ...options?.transformOptions,
    });
  }

  /**
   * Create many new documents
   */
  async createManyDocuments<V = TReturnDto>(data: Partial<TDocument>[]) {
    data = await this.beforeSave(data);
    const result = await this._model.insertMany(data);
    return result;
  }

  /**
   * Create many new documents
   */
  async createManyDocumentsAndReturnIt<V = TReturnDto>(
    data: Partial<TDocument>[],
    options?: InsertManyOptions & {
      returnAs?: ClassConstructor<V>;
      transformOptions?: ClassTransformOptions;
    },
  ): Promise<V[]> {
    const result = await this.createManyDocuments(data);
    const returnAs = <ClassConstructor<V>>(<unknown>options?.returnAs ?? this._returnAs);

    // make list
    const list: ObjectId[] = [];
    for (const k in result.insertedIds) {
      list.push(<ObjectId>(<unknown>result.insertedIds[k]));
    }

    const docs = await this.findAllDocuments({ filter: { _id: { $in: list } } });

    return <V[]>(<unknown>plainToInstance(returnAs, docs, {
      ...this.defaultTransformOptions,
      ...options?.transformOptions,
    }));
  }

  /**
   * Update a single document by id
   */
  async updateDocument<V = TReturnDto>(
    id: ObjectId,
    data: Partial<TDocument>,
    options?: UpdateOptions & {
      returnAs?: ClassConstructor<V>;
      transformOptions?: ClassTransformOptions;
    },
  ): Promise<V | null> {
    data = await this.beforeSave(data);
    const returnAs = <ClassConstructor<V>>(<unknown>options?.returnAs ?? this._returnAs);
    const result = await this._model.update(id, data, {
      ...options,
      ...this._getDefaultOptions<V>(returnAs),
    });
    const doc =
      !result || !this._hasSubSchemas(returnAs) ? result : await this.findDocumentById(result._id);
    return plainToInstance(returnAs, doc, {
      ...this.defaultTransformOptions,
      ...options?.transformOptions,
    });
  }

  /**
   * Update many document and return update result stats
   */
  async updateMany<V = TReturnDto>(
    filter: FilterQuery<TDocument>,
    data: Partial<TDocument>,
    options?: UpdateManyOptions & {
      returnAs?: ClassConstructor<V>;
      transformOptions?: ClassTransformOptions;
    },
  ) {
    return await this._model.updateMany(filter, data, options);
  }

  /**
   * Update a single document and return update result stat
   */
  async updateOne<V = TReturnDto>(
    filter: FilterQuery<TDocument>,
    data: Partial<TDocument>,
    options?: UpdateOneOptions & { returnAs?: ClassConstructor<V> } & {
      transformOptions?: ClassTransformOptions;
    },
  ) {
    return await this._model.updateOne(filter, data, options);
  }

  /**
   * Delete many document and return delete result stats
   */
  async deleteManyDocuments(filter: FilterQuery<TDocument>, options?: DeleteManyOptions) {
    return await this._model.deleteMany(filter, options);
  }

  /**
   * Delete a single document and return delete result stat
   */
  async deleteOneDocument(filter: FilterQuery<TDocument>, options?: DeleteOneOptions) {
    return await this._model.deleteOne(filter, options);
  }

  /**
   * Delete and return affected
   */
  async deleteDocument(id: ObjectId, options?: DeleteOptions) {
    const result = <any>(<unknown>await this._model.delete(id, options));
    return this.calcAffectedDocuments(result);
  }

  /**
   * Verify than at least one document exists
   */
  async exists(filter: FilterQuery<TDocument>, options?: ExistsOption) {
    return await this._model.exists(filter, options);
  }

  /**
   * Verify than id document exist
   */
  async existsId(id: ObjectId, options?: ExistsOption) {
    return await this._model.existsId(id, options);
  }

  /**
   * Count documents
   */
  async countDocuments(filter: FilterQuery<TDocument> = {}, options?: CountOptions) {
    return await this._model.count(filter, options);
  }

  protected calcAffectedDocuments(result: any) {
    let affected = 0;
    if (result.insertedCount) affected += result.insertedCount;
    if (result.modifiedCount) affected += result.modifiedCount;
    if (result.deletedCount) affected += result.deletedCount;
    return affected;
  }

  // Hooks
  async beforeSave<T = any>(data: T) {
    return data;
  }

  async afterSave<T = any>(data: T) {
    return data;
  }

  protected _getDefaultPipeline<T = TReturnDto>(
    schema: string | Function,
    options: Partial<Omit<FindAllDocumentsOpts<T>, 'returnAs' | 'transformOptions'>> = {},
  ): Exclude<PipelineStage, PipelineStage.Merge | PipelineStage.Out>[] {
    //const schemaName = typeof schema === 'string' ? schema : schema.name;
    //if (!this._cachePipelines.has(schemaName)) {
    const pipeline: Exclude<PipelineStage, PipelineStage.Merge | PipelineStage.Out>[] = [];
    const schemaMetadata = this._metadata.getSchema(schema);
    if (schemaMetadata !== undefined) {
      // Lookup
      this._getLookupsAndUnwind(schemaMetadata).forEach((stage) => pipeline.push(stage));
      // Match
      if (options?.filter !== undefined) pipeline.push({ $match: options.filter });
      // Sort
      if (options?.sort !== undefined) pipeline.push({ $sort: options.sort });
      // Projection
      pipeline.push({ $project: this._getProjection(schema) });
      // Skip
      if (options?.skip !== undefined) pipeline.push({ $skip: options.skip });
      // Limit
      if (options?.limit !== undefined) pipeline.push({ $limit: options.limit });
    }
    //this._cachePipelines.set(schemaName, pipelines);
    //}
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //return this._cachePipelines.get(schemaName)!;
    return pipeline;
  }

  protected _getProjection(schema: Function | string) {
    const schemaName = typeof schema === 'string' ? schema : schema.name;
    if (!this._cacheProjections.has(schemaName)) {
      const projection: { [field: string]: number } = {};
      const schemaMetadata = this._metadata.getSchema(schema);
      if (schemaMetadata !== undefined) {
        for (const [property, propDef] of schemaMetadata.props.entries()) {
          if (propDef.options.transformer?.expose || !propDef.options.transformer?.exclude) {
            projection[property] = 1;
          }
          /* not recursive
        const key = [...parents, property].join('.');
        const join = propDef.metadata.get(METADATA.MONGOOSE_JOIN) as JoinSchema | undefined;
        if (join === undefined) {
          if (propDef.options.transformer?.expose || !propDef.options.transformer?.exclude) {
            projection[key] = 1;
          }
        } else {
          this._getProjection(propDef.type.type, projection, [...parents, property]);
        }
        */
        }
        this._cacheProjections.set(schemaName, projection);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._cacheProjections.get(schemaName)!;
  }

  protected _getLookupsAndUnwind(
    schemaMetadata: SchemaDef,
  ): Exclude<PipelineStage, PipelineStage.Merge | PipelineStage.Out>[] {
    const pipeline: Exclude<PipelineStage, PipelineStage.Merge | PipelineStage.Out>[] = [];
    for (const [property, propDef] of schemaMetadata.props.entries()) {
      const lookup = propDef.metadata.get(METADATA.MONGOOSE_LOOKUP) as LookupOpts;
      if (lookup !== undefined) {
        if (propDef.options.transformer?.expose || !propDef.options.transformer?.exclude) {
          pipeline.push({
            $lookup: {
              from: lookup.from,
              as: property,
              localField: lookup.localField,
              foreignField: lookup.foreignField,
              pipeline: this._getDefaultPipeline(propDef.type?.type, {
                limit: lookup.justOne ? 1 : undefined,
              }),
            },
          });
          if ((lookup.justOne ?? false) === true) {
            pipeline.push({
              $unwind: {
                path: '$' + property,
                preserveNullAndEmptyArrays: lookup.preserveNullAndEmptyArrays ?? false,
              },
            });
          }
          // Has nested childs?
          /*
          const nestedPipelines = this._getPipelines(propDef.type?.type, [...parents, property]);
          nestedPipelines.forEach((stage) => {
            pipeline.push(stage);
          });
          */
        }
      }
    }
    return pipeline;
  }

  /**
   * Detect if schema has props with subschemas
   */
  public _hasSubSchemas(schema: Function | string): boolean {
    const schemaMetadata = this._metadata.getSchema(schema);
    if (schemaMetadata !== undefined) {
      for (const [property, propDef] of schemaMetadata.props.entries()) {
        const lookup = propDef.metadata.get(METADATA.MONGOOSE_LOOKUP) as LookupOpts;
        if (lookup !== undefined) return true;
      }
    }
    return false;
  }

  protected _getDefaultOptions<V>(returnAs: ClassConstructor<V>) {
    return {
      toObject: true,
      projection: this._getProjection(returnAs),
    };
  }

  get model() {
    return this._model;
  }
}
