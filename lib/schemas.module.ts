import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DocumentExistsValidator } from './decorators';
import { MetadataService } from './metadata.service';

@Global()
@Module({
  providers: [MetadataService, DatabaseService, DocumentExistsValidator],
  exports: [MetadataService, DatabaseService, DocumentExistsValidator],
})
export class SchemasModule {}
