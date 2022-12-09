import { Type } from '@nestjs/common';
import { PartialType as NestJSSwaggerPartialType } from '@nestjs/swagger';
import { metadataStorage } from '../lib/storage';

export function PartialType<T>(target: string, classRef: Type<T>): Type<Partial<T>> {
  const resultClass = NestJSSwaggerPartialType(classRef);
  metadataStorage.copyProps(classRef, resultClass, {
    makePartial: true,
  });
  return resultClass;
}
