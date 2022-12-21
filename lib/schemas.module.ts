import { Global, Module } from '@nestjs/common';
import { DocumentExistsValidator } from './decorators';
import { MetadataService } from './metadata.service';

@Global()
@Module({
  providers: [MetadataService, DocumentExistsValidator],
  exports: [MetadataService, DocumentExistsValidator],
})
export class SchemasModule {}
