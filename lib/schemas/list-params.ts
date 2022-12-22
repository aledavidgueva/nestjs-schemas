import { $Prop, $PropNumberOptional, $PropStringOptional, $Schema } from '../decorators';
import { IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { QueryOptions } from 'mongoose';
import { TransformToPojo } from '../helpers';

@$Schema()
export class ListParams<T = any> {
  @$PropNumberOptional({ min: 1, isInt: true })
  limit?: number;

  @$PropNumberOptional({ min: 0, isInt: true })
  skip?: number;

  @$Prop({
    swagger: { type: 'object', required: false },
    transformer: { expose: true, transform: [[TransformToPojo(), { toClassOnly: true }]] },
    validators: [IsOptional(), IsObject()],
  })
  sort?: Pick<QueryOptions<T>, 'sort'>;

  @$Prop({
    swagger: { type: 'object', required: false },
    transformer: { expose: true, transform: [[TransformToPojo(), { toClassOnly: true }]] },
    validators: [IsOptional(), IsObject()],
  })
  filter?: any;

  @$PropStringOptional()
  query?: string;
}
