import { Model, Document, UpdateWriteOpResult, ClientSession } from 'mongoose';
import { compact, first, forEach, includes, isEmpty, keys, map, omit, size, snakeCase } from 'lodash';
import { BulkWriteResult, ChangeStream, ChangeStreamDocument, DeleteResult } from 'mongodb';

import { ObjectId } from 'bson';
import {
  IBulkWriteRepositoryParams,
  ICreateRepositoryParams,
  IDeleteRepositoryParams,
  IDeleteSoftManyRepositoryParams,
  IDeleteSoftRepositoryParams,
  IGetAllRepositoryParams,
  IGetByIdRepositoryParams,
  IGetByPropsRepositoryParams,
  IGetTotalItemsRepositoryParams,
  IUpdateRepositoryParams,
} from '@shared/application/types/repository.types';
import { IRepositoryPort } from '@shared/application/ports/repositories';
import {
  IMongooseFindExecItem,
  IMongooseFindExecItems,
  IUpdateManyRepositoryResult,
} from '@shared/application/types/mongoose.types';
import { AggregateConfig, IODataParamsDB } from '@shared/application/types/odata-params.types';
import { clearNilValuesAndEmptyObject } from '@shared/utils/object.utils';
import { RecordAny } from '@shared/typings/any.types';
import { isDateString } from '@shared/utils/datetime.utils';

export class Repository implements IRepositoryPort {
  private model: Model<Document>;

  public async create<Entity>(params: ICreateRepositoryParams<Entity>): Promise<Entity> {
    const { input, inputValidated, dbSession } = params;
    const [data] = await this.getModel().create([inputValidated || input], {
      session: dbSession,
    });
    return data.toJSON() as Entity;
  }

  public async startSession(): Promise<ClientSession> {
    return this.getModel().startSession();
  }

  public async delete(params: IDeleteRepositoryParams): Promise<DeleteResult> {
    const { query, dbSession } = params;
    return this.getModel().deleteOne(query, { session: dbSession });
  }

  public async bulkWrite(params: IBulkWriteRepositoryParams): Promise<BulkWriteResult> {
    const { operations, dbSession } = params;
    return this.getModel().bulkWrite(operations, { session: dbSession }) as unknown as BulkWriteResult;
  }

  public async update<Entity>(params: IUpdateRepositoryParams<Entity>): Promise<UpdateWriteOpResult> {
    const { input, inputValidated, id, dbSession } = params;
    return this.getModel()
      .updateOne({ _id: id }, { $set: inputValidated || input }, { session: dbSession })
      .exec();
  }

  public async deleteSoft(params: IDeleteSoftRepositoryParams): Promise<UpdateWriteOpResult> {
    const { id, dbSession } = params;
    return this.getModel()
      .updateOne({ _id: id }, { $set: { is_deleted: true } }, { session: dbSession })
      .exec();
  }

  private getModel<Entity = Document>(): Model<Entity> {
    return this.model as unknown as Model<Entity>;
  }

  public setModel(model: Model<Document>): void {
    this.model = model;
  }

  public getWatcher(...params: any[]): ChangeStream<Document, ChangeStreamDocument<Document>> {
    const model = this.getModel();
    let watcher = model.watch();
    if (params) {
      watcher = model.watch(...params);
    }

    return watcher as unknown as ChangeStream<Document, ChangeStreamDocument<Document>>;
  }

  public async getTotalItems(params: IGetTotalItemsRepositoryParams): Promise<number> {
    const { odataDBParams, dbSession } = params;
    const query = this.getModel().find(odataDBParams['query']!);

    // Only set session if dbSession is defined, to avoid passing undefined
    if (dbSession) {
      query.session(dbSession);
    }

    const totalItems = await query.countDocuments().exec();
    return totalItems;
  }

  public async getAll<Entity>(params: IGetAllRepositoryParams): Promise<IMongooseFindExecItems<Entity>> {
    const { odataDBParams, dbSession } = params;
    const model = this.getModel<Document<Entity>>();

    const hasPopulatedPathsInFilterQuery = this.hasPopulatedFieldFilters(odataDBParams.query, odataDBParams.populate);
    const shouldUseAggregate = !isEmpty(odataDBParams.aggregate) || hasPopulatedPathsInFilterQuery;

    if (shouldUseAggregate) {
      return this.getAllWithAggregate<Entity>(odataDBParams, model, dbSession ?? undefined) as unknown as IMongooseFindExecItems<Entity>;
    }

    const filter = odataDBParams['query'] ?? {};
    const query = model.find(filter);

    if (dbSession) {
      query.session(dbSession);
    }

    forEach(odataDBParams.populate, (populate) => {
      query.populate(populate);
    });

    if (odataDBParams['projection']) {
      query.select(odataDBParams['projection']);
    }
    if (odataDBParams['sort']) {
      query.sort(odataDBParams['sort']);
    }
    if (typeof odataDBParams['skip'] === 'number') {
      query.skip(odataDBParams['skip']);
    }
    if (typeof odataDBParams['limit'] === 'number') {
      query.limit(odataDBParams['limit']);
    }
    const result = await query.exec();

    return result as IMongooseFindExecItems<Entity>;
  }

  /**
   * Verifica se há filtros em campos que serão populados
   */
  private hasPopulatedFieldFilters(query: any, populateConfigs: any[] = []): boolean {
    if (!query || !compact(populateConfigs)?.length) return false;

    const populatePaths = populateConfigs.map((p) => p.path);

    for (const key in query) {
      if (key.includes('.')) {
        const [path] = key.split('.');
        if (populatePaths.includes(path)) {
          return true;
        }
      }

      // Verifica operadores lógicos ($and, $or) recursivamente
      if (key === '$and' || key === '$or') {
        for (const condition of query[key]) {
          if (this.hasPopulatedFieldFilters(condition, populatePaths)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  public async getById<Entity>(params: IGetByIdRepositoryParams): Promise<IMongooseFindExecItem<Entity>> {
    const { odataDBParams, id, dbSession } = params;
    const model = this.getModel<Document<Entity>>();

    const queryWithId = { _id: id, ...(odataDBParams?.query ?? {}) };

    if (odataDBParams && !isEmpty(odataDBParams.aggregate)) {
      const aggregateParams = { ...odataDBParams, query: queryWithId };
      return first(await this.getAllWithAggregate<Entity>(aggregateParams, model, dbSession)) as IMongooseFindExecItem<Entity>;
    }

    const query = model.findOne(queryWithId).session(dbSession ?? null);

    forEach(odataDBParams?.populate ?? [], (populate) => {
      query.populate(populate);
    });

    const result = await query
      .select(odataDBParams?.projection ?? {})
      .sort(odataDBParams?.sort ?? {})
      .skip(odataDBParams?.skip ?? 0)
      .limit(odataDBParams?.limit ?? 0)
      .exec();

    return result as IMongooseFindExecItem<Entity>;
  }

  public async getByProps<Entity>(params: IGetByPropsRepositoryParams): Promise<IMongooseFindExecItem<Entity> | null> {
    const { odataDBParams, props, dbSession } = params;
    const model = this.getModel<Document<Entity>>();
    const query = model.findOne(props).session(dbSession ?? null);

    forEach(odataDBParams?.populate ?? [], (populate) => {
      query.populate(populate);
    });

    const result = await query
      .select(odataDBParams?.projection ?? {})
      .sort(odataDBParams?.sort ?? {})
      .skip(odataDBParams?.skip ?? 0)
      .limit(odataDBParams?.limit ?? 0)
      .exec();

    // If no document is found, return null (explicitly)
    return result ?? null;
  }

  private convertQueryForAggregation(query: any): any {
    if (typeof query !== 'object' || query === null) {
      return query;
    }

    if (Array.isArray(query)) {
      return query.map((item) => this.convertQueryForAggregation(item));
    }

    const convertedQuery: any = {};
    for (const key in query) {
      const isRegexWithFlags = query[key] instanceof RegExp && (query[key].global || query[key].ignoreCase);

      if (query.hasOwnProperty(key)) {
        const value = query[key];

        if (isRegexWithFlags) {
          convertedQuery[key] = value;
        } else if (ObjectId.isValid(value)) {
          convertedQuery[key] = new ObjectId(value);
        } else if (typeof value === 'string' && isDateString(value)) {
          convertedQuery[key] = new Date(value);
        } else if (typeof value === 'object' && value !== null) {
          convertedQuery[key] = this.convertQueryForAggregation(value);
        } else {
          convertedQuery[key] = value;
        }
      }
    }

    return convertedQuery;
  }

  /**
   * Separa os filtros em campos base e campos populados
   */
  private separatePopulatedFilters(query: any, populateConfigs: any[] = []): RecordAny {
    const baseQuery = { ...query };
    const populatedFilters = {};
    const populatePaths = populateConfigs?.map((p) => p.path) || [];

    for (const key in query) {
      if (key.includes('.')) {
        const [path, field] = key.split('.');

        if (populatePaths.includes(path)) {
          // Verifica se é um regex com flags globais/case insensitive
          const isRegexWithFlags = query[key] instanceof RegExp && (query[key].global || query[key].ignoreCase);

          if (isRegexWithFlags) {
            // Mantém como 'prop.prop' e converte para sintaxe MongoDB
            delete baseQuery[key];
            populatedFilters[key] = {
              $regex: query[key].source,
              $options: query[key].flags.replace('g', ''), // Remove flag global se existir
            };
          } else {
            // Comportamento original para não-regex ou regex sem flags
            delete baseQuery[key];
            populatedFilters[`${path}.${field}`] = query[key];
          }
        }
      }

      // Processa operadores lógicos ($and, $or)
      if (key === '$and' || key === '$or') {
        baseQuery[key] = query[key]
          .map((cond) => {
            const { baseQuery: nestedBase, populatedFilters: nestedPopulated } = this.separatePopulatedFilters(
              cond,
              populateConfigs,
            );

            Object.assign(populatedFilters, nestedPopulated);
            return nestedBase;
          })
          .filter((cond) => !isEmpty(cond));
      }
    }

    return { baseQuery, populatedFilters };
  }

  private async getAllWithAggregate<Entity>(
    odataDBParams: IODataParamsDB,
    model: Model<Document<Entity>>,
    dbSession?: ClientSession,
  ): Promise<Document<Entity, Entity, Entity>[]> {
    const aggregationPipeline: any[] = [];

    const { baseQuery, populatedFilters } = this.separatePopulatedFilters(odataDBParams.query, odataDBParams.populate);

    aggregationPipeline.push({
      $match: this.convertQueryForAggregation(baseQuery),
    });

    const populationGroups = (odataDBParams.populate ?? []).reduce((groups, populate) => {
      if (!groups[populate.path]) {
        groups[populate.path] = {
          mainLookup: {
            from: populate.model,
            localField: `${snakeCase(populate.path)}_id`,
            foreignField: '_id',
            as: populate.path,
          },
          nestedPopulates: [],
        };
      }

      if (populate.populate) {
        groups[populate.path].nestedPopulates.push(populate.populate);
      }

      return groups;
    }, {});

    Object.values(populationGroups).forEach((group: RecordAny) => {
      aggregationPipeline.push({
        $lookup: group['mainLookup'],
      });

      aggregationPipeline.push({
        $unwind: {
          path: `$${group['mainLookup'].as}`,
          preserveNullAndEmptyArrays: true,
        },
      });

      group['nestedPopulates'].forEach((nested) => {
        const fullPath = `${group['mainLookup'].as}.${nested.path}`;

        aggregationPipeline.push({
          $lookup: {
            from: nested.model,
            localField: `${group['mainLookup'].as}.${snakeCase(nested.path)}_id`,
            foreignField: '_id',
            as: fullPath,
          },
        });

        aggregationPipeline.push({
          $unwind: {
            path: `$${fullPath}`,
            preserveNullAndEmptyArrays: true,
          },
        });
      });

      if (group['nestedPopulates'].length > 0) {
        const mergeObject = {
          $mergeObjects: [
            `$${group['mainLookup'].as}`,
            ...group['nestedPopulates'].map((nested) => ({
              [nested.path]: `$${group['mainLookup'].as}.${nested.path}`,
            })),
          ],
        };

        aggregationPipeline.push({
          $addFields: {
            [group['mainLookup'].as]: mergeObject,
          },
        });
      }
    });

    if (populatedFilters && Object.keys(populatedFilters).length > 0) {
      const newMatch = aggregationPipeline[0]?.$match ?? {};
      const baseQueryKeys = keys(omit(baseQuery, ['$or']));
      const has$or = !!baseQuery?.$or;
      if (!has$or && !baseQuery?.$and && size(baseQueryKeys) > 0) {
        newMatch.$or = [];
        forEach(baseQueryKeys, (key) => {
          newMatch.$or.push({ [key]: baseQuery[key] });
          delete newMatch[key];
        });
      }
      aggregationPipeline.shift();
      const populatedFiltersKeys = keys(populatedFilters);
      if (has$or) newMatch.$and = [];
      forEach(populatedFiltersKeys, (key) => {
        if (has$or) {
          newMatch.$and.push({ [key]: populatedFilters[key] });
        } else {
          newMatch[key] = populatedFilters[key];
        }
      });
      if (has$or) {
        newMatch.$and.push({ $or: newMatch.$or });
        delete newMatch.$or;
      }
      aggregationPipeline.push({
        $match: newMatch,
      });
    }

    if (!isEmpty(odataDBParams.aggregate)) {
      const getIsDeletedFilterValue = (): boolean | undefined => {
        const directValue = odataDBParams.query?.is_deleted;
        if (typeof directValue === 'boolean') {
          return directValue;
        }

        const orConditions = odataDBParams.query?.$or;
        if (Array.isArray(orConditions)) {
          for (const cond of orConditions) {
            if (cond?.is_deleted !== undefined) {
              return cond.is_deleted;
            }
          }
        }

        return undefined;
      };

      const isDeletedFilterValue = getIsDeletedFilterValue();
      (odataDBParams.aggregate ?? []).forEach((config) => {
        const lookupField = config.as.split('.')[1] ?? config.as.split('.')[0];

        aggregationPipeline.push({
          $lookup: {
            from: config.collectionToAggregate,
            localField: config.localField,
            foreignField: config.foreignField,
            as: lookupField,
          },
        });

        if (isDeletedFilterValue !== undefined) {
          aggregationPipeline.push({
            $addFields: {
              [lookupField]: {
                $filter: {
                  input: `$${lookupField}`,
                  as: 'item',
                  cond: { $eq: [`$$item.is_deleted`, isDeletedFilterValue] },
                },
              },
            },
          });
        }

        aggregationPipeline.push({
          $addFields: {
            [config.as]: {
              $cond: {
                if: { $gt: [{ $size: `$${lookupField}` }, 0] },
                then: `$${lookupField}`,
                else: [],
              },
            },
          },
        });

        if (includes(config.as, '.')) {
          aggregationPipeline.push({
            $project: {
              [lookupField]: 0,
            },
          });
        }
      });
    }

    const aggregationFilters = this.getAggregationFilters(
      odataDBParams.query!,
      odataDBParams.aggregate ?? []
    );
    if (!isEmpty(aggregationFilters)) {
      if (aggregationPipeline[0]?.$match) aggregationPipeline.shift();
      const aggregationFiltersKeys = keys(aggregationFilters);

      if (size(aggregationFiltersKeys) > 1) {
        const orAggregation = {
          $or: map(aggregationFiltersKeys, (key) => {
            return aggregationFilters[key]?.size ? aggregationFilters[key].size : { [key]: aggregationFilters[key] };
          }),
        };
        aggregationPipeline.push({
          $match: orAggregation,
        });
      } else {
        aggregationPipeline.push({
          $match: aggregationFilters,
        });
      }
    }

    // 6. Projeção, ordenação e paginação
    if (!isEmpty(odataDBParams.projection)) {
      aggregationPipeline.push({
        $project: odataDBParams.projection,
      });
    }

    if (!isEmpty(odataDBParams.sort)) {
      aggregationPipeline.push({
        $sort: odataDBParams.sort,
      });
    }

    if (!isEmpty(odataDBParams.skip)) {
      aggregationPipeline.push({
        $skip: odataDBParams.skip,
      });
    }

    if (!isEmpty(odataDBParams.limit)) {
      aggregationPipeline.push({
        $limit: odataDBParams.limit,
      });
    }

    const session = dbSession ?? null;
    const result = await model.aggregate(aggregationPipeline).session(session);
    const mappedData = (result || []).map((doc) => ({ toJSON: () => clearNilValuesAndEmptyObject(doc) })) as any[];
    return mappedData;
  }

  private getAggregationFilters(query: Record<string, any>, aggregateConfig: AggregateConfig[]): Record<string, any> {
    const aggregationPaths = aggregateConfig.map((item) => item.as);

    const aggregationFilters: Record<string, any> = {};

    for (const [key, value] of Object.entries(query)) {
      const isAggregatedField = aggregationPaths.some((path) => key.startsWith(`${path}.`) || key === path);

      if (isAggregatedField) {
        aggregationFilters[key] = value;
      }
    }

    return aggregationFilters;
  }
}
