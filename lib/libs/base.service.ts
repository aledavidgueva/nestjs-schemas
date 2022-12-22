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
  FindOneOptions,
  FindByIdOptions,
  UpdateManyOptions,
  UpdateOneOptions,
  UpdateOptions,
  DeleteOptions,
  DeleteOneOptions,
  DeleteManyOptions,
  ExistsOption,
  CountOptions,
  ListOptions,
  SoftDeleteOption,
} from './base.model';
import { MetadataService } from '../metadata.service';

type AutoParseOptions = {
  autoProjection?: boolean;
  autoPopulate?: boolean;
};

export type ListDocuments = {
  filter?: PipelineStage.Match['$match'];
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
    protected readonly _model: TModel,
    protected readonly _returnAs: ClassConstructor<TReturnDto>,
    protected readonly _metadata: MetadataService,
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

  async listDocuments<V = TReturnDto>(options?: ListDocumentsOptions<V>): Promise<V[]> {
    const returnAs = <ClassConstructor<V>>(<unknown>options?.returnAs ?? this._returnAs);
    const listOptions = this._createListOptions(returnAs, options);
    const result = await this._model.list(listOptions);
    return <V[]>(<unknown>plainToInstance(returnAs, result, {
      ...this.defaultTransformOptions,
      ...options?.transformOptions,
    }));
  }

  /**
   * Find many documents
   */
  async findAllDocuments<V = TReturnDto>(
    filter: FilterQuery<TDocument> = {},
    options?: FindAllOptions<TDocument> & {
      returnAs?: ClassConstructor<V>;
      transformOptions?: ClassTransformOptions;
    } & AutoParseOptions,
  ): Promise<V[]> {
    const returnAs = <ClassConstructor<V>>(<unknown>options?.returnAs ?? this._returnAs);
    const result = await this._model.findAll(filter, {
      ...options,
      ...this.getDefaultOptions<V>(returnAs, options),
    });
    return <V[]>(<unknown>plainToInstance(returnAs, result, {
      ...this.defaultTransformOptions,
      ...options?.transformOptions,
    }));
  }

  /**
   * Find a single document
   */
  async findOneDocument<V = TReturnDto>(
    filter: FilterQuery<TDocument> = {},
    options?: FindOneOptions<TDocument> & {
      returnAs?: ClassConstructor<V>;
      transformOptions?: ClassTransformOptions;
    } & AutoParseOptions,
  ): Promise<V | null> {
    const returnAs = <ClassConstructor<V>>(<unknown>options?.returnAs ?? this._returnAs);
    const result = await this._model.findOne(filter, {
      ...options,
      ...this.getDefaultOptions<V>(returnAs, options),
    });
    return <V>(<unknown>plainToInstance(returnAs, result, {
      ...this.defaultTransformOptions,
      ...options?.transformOptions,
    }));
  }

  /**
   * Find a single document by id
   */
  async findDocumentById<V = TReturnDto>(
    id: ObjectId,
    options?: FindByIdOptions<TDocument> & {
      returnAs?: ClassConstructor<V>;
      transformOptions?: ClassTransformOptions;
    } & AutoParseOptions,
  ): Promise<V | null> {
    const returnAs = <ClassConstructor<V>>(<unknown>options?.returnAs ?? this._returnAs);
    const result = await this._model.findById(id, {
      ...options,
      ...this.getDefaultOptions<V>(returnAs, options),
    });
    return <V>(<unknown>plainToInstance(returnAs, result, {
      ...this.defaultTransformOptions,
      ...options?.transformOptions,
    }));
  }

  /**
   * Create a single document by id
   */
  async createDocument<V = TReturnDto>(
    data: Partial<TDocument>,
    options?: InsertOptions & {
      returnAs?: ClassConstructor<V>;
      transformOptions?: ClassTransformOptions;
    } & AutoParseOptions,
  ): Promise<V> {
    data = await this.beforeSave<Partial<TDocument>>(data);
    const returnAs = <ClassConstructor<V>>(<unknown>options?.returnAs ?? this._returnAs);
    const result = await this._model.insert(data, {
      ...options,
      ...this.getDefaultOptions<V>(returnAs, options),
    });
    return plainToInstance(returnAs, result, {
      ...this.defaultTransformOptions,
      ...options?.transformOptions,
    });
  }

  /**
   * Create many new documents
   */
  async createManyDocuments<V = TReturnDto>(
    data: Partial<TDocument>[],
    options?: InsertManyOptions & {
      returnAs?: ClassConstructor<V>;
      transformOptions?: ClassTransformOptions;
    } & AutoParseOptions,
  ): Promise<V[]> {
    data = await this.beforeSave(data);
    const returnAs = <ClassConstructor<V>>(<unknown>options?.returnAs ?? this._returnAs);
    const result = await this._model.insertMany(data, {
      ...options,
      ...this.getDefaultOptions<V>(returnAs, options),
    });
    return <V[]>(<unknown>plainToInstance(returnAs, result, {
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
    } & AutoParseOptions,
  ): Promise<V | null> {
    data = await this.beforeSave(data);
    const returnAs = <ClassConstructor<V>>(<unknown>options?.returnAs ?? this._returnAs);
    const result = await this._model.update(id, data, {
      ...options,
      ...this.getDefaultOptions<V>(returnAs, options),
    });
    return plainToInstance(returnAs, result, {
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
    } & AutoParseOptions,
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
    } & AutoParseOptions,
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
   * Delete and return a single document by id
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

  protected _createListOptions<V>(
    returnAs: ClassConstructor<V>,
    options: ListDocumentsOptions<V> = {},
  ): ListOptions {
    return {
      softDelete: options.softDelete,
      limit: options.limit ?? 500,
      skip: options.skip ?? 0,
      match: options.filter,
      sort: options.sort,
      project: this._getProjection(returnAs),
      pipelines: this._getPipelines(returnAs),
    };
  }

  protected _getProjection(schema: Function | string) {
    const schemaName = typeof schema === 'string' ? schema : schema.name;
    if (!this._cacheProjections.has(schemaName)) {
      const projection: { [field: string]: number } = {};
      const schemaMetadata = this._metadata?.getSchema(schema);
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

  protected _getPipelines(schema: Function | string, parents: string[] = []) {
    //const schemaName = typeof schema === 'string' ? schema : schema.name;
    //if (!this._cachePipelines.has(schemaName)) {
    const pipelines: PipelineStage[] = [];
    const schemaMetadata = this._metadata?.getSchema(schema);
    if (schemaMetadata !== undefined) {
      this._getLookupsAndUnwind(schemaMetadata, pipelines, parents);
    }
    //this._cachePipelines.set(schemaName, pipelines);
    //}
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //return this._cachePipelines.get(schemaName)!;
    return pipelines;
  }

  protected _getLookupsAndUnwind(
    schemaMetadata: SchemaDef,
    pipelines: PipelineStage[],
    parents: string[] = [],
  ) {
    for (const [property, propDef] of schemaMetadata.props.entries()) {
      const join = propDef.metadata.get(METADATA.MONGOOSE_LOOKUP);
      if (join !== undefined) {
        if (propDef.options.transformer?.expose || !propDef.options.transformer?.exclude) {
          pipelines.push({
            $lookup: {
              as: [...parents, property].join('.'),
              from: join.from,
              localField: [...parents, join.localField].join('.'),
              foreignField: join.foreignField,
              pipeline: [{ $project: this._getProjection(propDef.type?.type) }],
            },
          });
          if (join.justOne === true) {
            pipelines.push({
              $unwind: {
                path: '$' + [...parents, property].join('.'),
                preserveNullAndEmptyArrays: join.preserveNullAndEmptyArrays,
              },
            });
          }
          // Has nested childs?
          const nestedPipelines = this._getPipelines(propDef.type?.type, [...parents, property]);
          nestedPipelines.forEach((stage) => {
            pipelines.push(stage);
          });
        }
      }
    }
  }

  getDefaultOptions<V>(
    returnAs: ClassConstructor<V>,
    options?: { projection?: any; populate?: any } & AutoParseOptions,
  ) {
    const defaultOptions: any = {
      toObject: true,
    };
    if (options?.autoProjection !== false && !options?.projection) {
      defaultOptions.projection = this._getProjection(returnAs);
    }
    return defaultOptions;
  }

  get model() {
    return this._model;
  }
}
