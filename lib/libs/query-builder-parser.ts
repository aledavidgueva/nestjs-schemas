import { ObjectId, Rule, RuleSet } from '../types';
import { FilterQuery } from 'mongoose';
import { BadRequestException, Logger } from '@nestjs/common';
import moment from 'moment';

export class QueryBuilderParser {
  private readonly conditions = {
    and: '$and',
    or: '$or',
  };

  private readonly constraints: {
    [operation: string]: {
      field: ('String' | 'ObjectId' | 'Date' | 'Number' | 'Boolean' | string)[];
      validation: (value: any) => boolean;
    }[];
  } = {
    equal: [
      { field: ['String'], validation: (value: any) => this.isString(value) },
      { field: ['ObjectId'], validation: (value: any) => this.isObjectId(value) },
      { field: ['Date'], validation: (value: any) => this.isDate(value) },
      { field: ['Number'], validation: (value: any) => this.isNumber(value) },
      { field: ['Boolean'], validation: (value: any) => this.isBoolean(value) },
    ],
    notEqual: [
      { field: ['String'], validation: (value: any) => this.isString(value) },
      { field: ['ObjectId'], validation: (value: any) => this.isObjectId(value) },
      { field: ['Date'], validation: (value: any) => this.isDate(value) },
      { field: ['Number'], validation: (value: any) => this.isNumber(value) },
      { field: ['Boolean'], validation: (value: any) => this.isBoolean(value) },
    ],
    startsWith: [{ field: ['String'], validation: (value: any) => this.isString(value) }],
    endsWith: [{ field: ['String'], validation: (value: any) => this.isString(value) }],
    contains: [{ field: ['String'], validation: (value: any) => this.isString(value) }],
    less: [
      { field: ['Date'], validation: (value: any) => this.isDate(value) },
      { field: ['Number'], validation: (value: any) => this.isNumber(value) },
    ],
    lessOrEqual: [
      { field: ['Date'], validation: (value: any) => this.isDate(value) },
      { field: ['Number'], validation: (value: any) => this.isNumber(value) },
    ],
    greater: [
      { field: ['Date'], validation: (value: any) => this.isDate(value) },
      { field: ['Number'], validation: (value: any) => this.isNumber(value) },
    ],
    greaterOrEqual: [
      { field: ['Date'], validation: (value: any) => this.isDate(value) },
      { field: ['Number'], validation: (value: any) => this.isNumber(value) },
    ],
    in: [
      { field: ['String'], validation: (value: any) => this.isArrayOf(value, this.isString) },
      { field: ['ObjectId'], validation: (value: any) => this.isArrayOf(value, this.isObjectId) },
      { field: ['Date'], validation: (value: any) => this.isArrayOf(value, this.isDate) },
      { field: ['Number'], validation: (value: any) => this.isArrayOf(value, this.isNumber) },
      { field: ['Boolean'], validation: (value: any) => this.isArrayOf(value, this.isBoolean) },
    ],
    notIn: [
      { field: ['String'], validation: (value: any) => this.isArrayOf(value, this.isString) },
      { field: ['ObjectId'], validation: (value: any) => this.isArrayOf(value, this.isObjectId) },
      { field: ['Date'], validation: (value: any) => this.isArrayOf(value, this.isDate) },
      { field: ['Number'], validation: (value: any) => this.isArrayOf(value, this.isNumber) },
      { field: ['Boolean'], validation: (value: any) => this.isArrayOf(value, this.isBoolean) },
    ],
    isNull: [
      {
        field: ['String', 'ObjectId', 'Date', 'Number', 'Boolean'],
        validation: (value: any) => this.isNull(value),
      },
    ],
    isNotNull: [
      {
        field: ['String', 'ObjectId', 'Date', 'Number', 'Boolean'],
        validation: (value: any) => this.isNull(value),
      },
    ],
  };

  private filter: FilterQuery<any>;

  constructor(
    private readonly ruleSet: RuleSet,
    private readonly mapTypes: { [key: string]: string },
  ) {
    try {
      this.filter = this.parseRuleSet(this.ruleSet);
    } catch (err) {
      Logger.debug(err);
      throw new BadRequestException('RULE_SET_PARSER_ERR');
    }
  }

  getRuleSet() {
    return this.ruleSet;
  }

  getMapTypes() {
    return this.mapTypes;
  }

  getFilter() {
    return this.filter;
  }

  private parseRuleSet(ruleSet: RuleSet): FilterQuery<any> {
    if (!this.isValidRuleSet(ruleSet)) throw new Error('Rule set is invalid.');

    if (!ruleSet.rules.length) throw new Error('Rules of rule set is empty.');

    return {
      [this.conditions[ruleSet.condition]]: ruleSet.rules.map((rule) => {
        if (this.isValidRuleSet(rule)) {
          return this.parseRuleSet(rule as RuleSet);
        } else if (this.isValidRule(rule)) {
          return this.parseRule(rule as Rule);
        } else {
          throw new Error('Rule in rule set is invalid.');
        }
      }),
    };
  }

  private parseRule(rule: Rule): FilterQuery<any> {
    const schemaType = this.getSchemaType(rule.field);
    if (schemaType === undefined) throw new Error('Field in rule not exists.');
    const type = schemaType.indexOf('Schema') === 0 ? schemaType.substring(6) : schemaType;
    // Set value by schema type
    let value: any;
    if (rule.value !== null) {
      switch (type) {
        case 'String':
          value = !Array.isArray(rule.value)
            ? (<string>(<unknown>rule.value)).trim()
            : rule.value.map((val: string) => val.trim());
          break;
        case 'ObjectId':
          value = !Array.isArray(rule.value)
            ? new ObjectId(<string>(<unknown>rule.value))
            : rule.value.map((val: string) => new ObjectId(val));
          break;
        case 'Date':
          value = !Array.isArray(rule.value)
            ? moment(<string>(<unknown>rule.value)).toDate()
            : rule.value.map((val: string) => moment(val).toDate());
          break;
        case 'Number':
        case 'Boolean':
        default:
          value = rule.value;
      }
    } else {
      value = null;
    }
    let filter: FilterQuery<any> = {};
    // Set value by operation
    switch (rule.operation) {
      case 'equal':
        filter[rule.field] = { $eq: value };
        break;
      case 'notEqual':
        filter[rule.field] = { $ne: value };
        break;
      case 'startsWith':
        filter[rule.field] = { $regex: new RegExp('^' + this._regexScape(value) + '.*', 'iu') };
        break;
      case 'endsWith':
        filter[rule.field] = { $regex: new RegExp('.*' + this._regexScape(value) + '$', 'iu') };
        break;
      case 'contains':
        filter[rule.field] = { $regex: new RegExp('.*' + this._regexScape(value) + '.*', 'iu') };
        break;
      case 'less':
        filter[rule.field] = { $lt: rule.value };
        break;
      case 'lessOrEqual':
        filter[rule.field] = { $lte: rule.value };
        break;
      case 'greater':
        filter[rule.field] = { $gt: rule.value };
        break;
      case 'greaterOrEqual':
        filter[rule.field] = { $gte: rule.value };
        break;
      case 'in':
        filter[rule.field] = { $in: rule.value };
        break;
      case 'notIn':
        filter[rule.field] = { $nin: rule.value };
        break;
      case 'isNull':
        filter[rule.field] = { $eq: rule.value };
        break;
      case 'isNotNull':
        filter[rule.field] = { $ne: rule.value };
        break;
    }

    return filter;
  }

  private isValidRuleSet(obj: any) {
    if (!obj || typeof obj !== 'object') return false;
    // shape validation
    const requiredKeys = ['condition', 'rules'];
    const keys = Object.getOwnPropertyNames(obj);
    if (keys.length !== requiredKeys.length) return false;
    for (const key of requiredKeys) {
      if (!keys.includes(key)) return false;
    }
    // type validation
    return (obj['condition'] === 'and' || obj['condition'] === 'or') && Array.isArray(obj['rules']);
  }

  private isValidRule(obj: any) {
    if (!obj || typeof obj !== 'object') return false;
    // shape validation
    const requiredKeys = ['field', 'operation', 'value'];
    const keys = Object.getOwnPropertyNames(obj);
    if (keys.length !== requiredKeys.length) return false;
    for (const key of requiredKeys) {
      if (!keys.includes(key)) return false;
    }
    const constraints = this.constraints[obj.operation];
    // types validation
    if (typeof obj.field !== 'string' || typeof obj.operation !== 'string' || !constraints)
      return false;
    // get field type for compat with operation
    const schemaType = this.getSchemaType(obj.field);
    if (schemaType === undefined) throw new Error('Field in rule not exists.');
    const type = schemaType.indexOf('Schema') === 0 ? schemaType.substring(6) : schemaType;
    // validate by operation
    let found = false;
    for (const constraint of constraints) {
      if (constraint.field.includes(type) || constraint.field.includes('Schema' + type)) {
        found = true;
        if (!constraint.validation(obj.value)) {
          throw new Error(`Constraint error on rule: ${obj}`);
        } else {
          break;
        }
      }
    }

    if (!found) return false;

    return true;
  }

  private getSchemaType(field: string): string | undefined {
    return this.mapTypes[field];
  }

  protected _regexScape(input: string = '') {
    return input.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  private isNull(value: any) {
    return value === null;
  }

  private isString(value: any) {
    return typeof value === 'string';
  }

  private isNumber(value: any) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  private isBoolean(value: any) {
    return typeof value === 'boolean';
  }

  private isDate(value: any) {
    return typeof value === 'string' && Number.isFinite(Date.parse(value));
  }

  private isObjectId(value: any) {
    return typeof value === 'string' && ObjectId.isValid(value);
  }

  private isArrayOf(arrayValue: any, validation: (value: any) => boolean) {
    if (!Array.isArray(arrayValue)) return false;
    if (arrayValue.length > 0) {
      for (const value of arrayValue) {
        if (!validation(value)) return false;
      }
    }
    return true;
  }
}
