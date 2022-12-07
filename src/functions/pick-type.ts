import { Type } from '@nestjs/common';
import { PickType as SwaggerPickType } from '@nestjs/swagger';
import { copyOnlyPickedMetadata } from './type-helper';

export function PickType<T, K extends keyof T>(
  target: string,
  classRef: Type<T>,
  keys: readonly K[],
): Type<Pick<T, typeof keys[number]>> {
  const items: string[] = [];
  for (const item of keys) {
    items.push(item.toString());
  }
  copyOnlyPickedMetadata(classRef.name, items, target);
  return SwaggerPickType(classRef, keys);
}
