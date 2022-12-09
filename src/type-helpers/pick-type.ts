import { Type } from '@nestjs/common';
import { PickType as NestJSSwaggerPickType } from '@nestjs/swagger';
import { metadataStorage } from '../lib/storage';

export function PickType<T, K extends keyof T>(
  classRef: Type<T>,
  keys: readonly K[],
): Type<Pick<T, typeof keys[number]>> {
  const resultClass = NestJSSwaggerPickType(classRef, keys);
  metadataStorage.copyProps(classRef, resultClass, {
    includeProps: keys.map((item) => item.toString()),
  });
  return resultClass;
}
