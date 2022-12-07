import { Type } from '@nestjs/common';
import { OmitType as SwaggerOmitType } from '@nestjs/swagger';
import { copyNotOmittedMetadata } from './type-helper';

export function OmitType<T, K extends keyof T>(
  target: string,
  classRef: Type<T>,
  keys: readonly K[],
): Type<Omit<T, typeof keys[number]>> {
  const items: string[] = [];
  for (const item of keys) {
    items.push(item.toString());
  }
  copyNotOmittedMetadata(classRef.name, items, target);
  return SwaggerOmitType(classRef, keys);
}
