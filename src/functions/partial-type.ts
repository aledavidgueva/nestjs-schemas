import { Type } from '@nestjs/common';
import { PartialType as SwaggerPartialType } from '@nestjs/swagger';
import { copyAllMetadataForPartial } from './type-helper';

export function PartialType<T>(target: string, classRef: Type<T>): Type<Partial<T>> {
  copyAllMetadataForPartial(classRef.name, target);
  return SwaggerPartialType(classRef);
}
