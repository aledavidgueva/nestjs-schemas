import { ClassTransformOptions } from 'class-transformer';

export const defaultTransformOptions: ClassTransformOptions = {
  excludeExtraneousValues: true,
  enableImplicitConversion: true,
  exposeUnsetFields: true, // mantener en falso hasta ver para que podría servir
};
