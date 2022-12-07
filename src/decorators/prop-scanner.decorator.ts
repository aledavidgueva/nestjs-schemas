/* eslint-disable @typescript-eslint/ban-types */
import { Prop as MongooseProp, PropOptions } from '@nestjs/mongoose';
import {
  Exclude,
  ExcludeOptions,
  Expose,
  ExposeOptions,
  Transform,
  Type,
  TypeHelpOptions,
  TypeOptions,
} from 'class-transformer';
import { metadataStorage } from '../libs/storage';

type TransformOptions = {
  typeFunction?: (type?: TypeHelpOptions) => Function;
  expose?: boolean;
  typeOptions?: TypeOptions;
  exposeOptions?: ExposeOptions;
  exclude?: boolean;
  excludeOptions?: ExcludeOptions;
};

export function PropScanner({
  typeFunction?: (type?: TypeHelpOptions) => Function,

}
  propOptions?: PropOptions,
  transformOptions?: TransformOptions,
): PropertyDecorator {
  return (target: any, propertyName: any) => {
    let type = (<any>(<unknown>propOptions))?.type ?? null;
    let ref = (<any>(<unknown>propOptions))?.ref ?? null;
    const reflectedType = Reflect.getMetadata('design:type', target, propertyName);

    // @see https://docs.nestjs.com/techniques/mongodb#model-injection
    if (Array.isArray(type) && type[0]?.type) {
      type = type[0]?.type;
      ref = type?.ref;
    }

    metadataStorage.addMetadata({
      target,
      propertyName,
      ref, // Es el ref de primer nivel. Aunque tenga ref, no significa que deba popular
      reflectedType,
      type: type,
      nulleable: undefined,
      origin: target instanceof Function ? target.name : target.constructor.name,
      populate: (<any>(<unknown>propOptions))?.populate ?? false,
      typeFunction: transformOptions?.typeFunction,
    });
  };
}
