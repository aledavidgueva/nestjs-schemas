import { metadataStorage } from '../decorators/property/storage';

export function copyAllMetadata(origin: any, target: string) {
  const schema = metadataStorage.getSchema(origin);
  if (schema) {
    schema.forEach((metadata: any) => {
      metadataStorage.addToSchema(target, metadata);
    });
  } /*  else {
    console.error(`No se encontró la definición de la dependencia ${origin.name} para ${target}`);
  } */
}

export function copyNotOmittedMetadata(origin: any, omitted: string[], target: string) {
  const schema = metadataStorage.getSchema(origin);
  if (schema) {
    schema.forEach((metadata: any) => {
      if (!omitted.includes(metadata.propertyName)) {
        metadataStorage.addToSchema(target, metadata);
      }
    });
  } /*  else {
    console.error(`No se encontró la definición de la dependencia ${origin.name} para ${target}`);
  } */
}

export function copyOnlyPickedMetadata(origin: any, picked: string[], target: string) {
  const schema = metadataStorage.getSchema(origin);
  if (schema) {
    schema.forEach((metadata: any) => {
      if (picked.includes(metadata.propertyName)) {
        metadataStorage.addToSchema(target, metadata);
      }
    });
  } /* else {
    console.error(`No se encontró la definición de la dependencia ${origin.name} para ${target}`);
  } */
}

export function copyAllMetadataForPartial(origin: any, target: string) {
  const schema = metadataStorage.getSchema(origin);
  if (schema) {
    schema.forEach((metadata: any) => {
      metadataStorage.addToSchema(target, { ...metadata });
    });
  } /*  else {
    console.error(`No se encontró la definición de la dependencia ${origin.name} para ${target}`);
  } */
}
