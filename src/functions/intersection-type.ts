import { Type } from '@nestjs/common';
import { IntersectionType as SwaggerIntersectionType } from '@nestjs/swagger';
import { copyAllMetadata } from './type-helper';

export function IntersectionType<A, B>(
  target: string,
  classARef: Type<A>,
  classBRef: Type<B>,
): Type<A & B> {
  copyAllMetadata(classARef.name, target);
  copyAllMetadata(classBRef.name, target);
  return SwaggerIntersectionType(classARef, classBRef);
}
