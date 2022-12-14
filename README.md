# Custom metadata storage for NestJS projects

- New storage for custom metadata for schemas and props types, with access available for dev by service.
- Organize decorator annotations in your schemas for better handling and readability.
- Reduce boilerplate.

## Usage

### Schema definition

```ts
import { ApiProperty } from '@nestjs/swagger';
import { $Schema, $Prop } from 'nestjs-metadata-storage';

export enum StatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

@$Schema({
  mongoose: {
    timestamps: true,
    collection: 'dummy',
  },
  metadata: {
    customInfo: 'Custom string',
  },
})
export class Dummy {
  @$Prop()
  _id: string;

  @$Prop({
    mongoose: { type: Schema.Types.String, default: null }
    swagger: { type: String, required: false },
  })
  category: string | null;

  @$Prop()
  question: string;

  @$Prop()
  answer: string;

  @$Prop({
    type: 'StatusEnum',
    enum: StatusEnum,
  })
  status: StatusEnum;

  @$Prop()
  position: number;
}
```

### Access to metadata

- Import `MetadataModule` in `AppModule`

```ts
import { Module } from '@nestjs/common';
import { MetadataModule } from 'nestjs-metadata-storage';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [MetadataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- Inject service and use

```ts
import { Controller, Get } from '@nestjs/common';
import { Dummy } from './schemas/faq.dto';
import { MetadataService } from 'nestjs-metadata-storage';
import { ApiExtraModels } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly _metadata: MetadataService) {}

  @Get()
  @ApiExtraModels(Dummy)
  test() {
    console.log(this._metadata.getSchemas());
  }
}
```

### Type helpers for annotations on inheritance

```ts
import { IntersectionType, PartialType, $Prop, $Schema } from 'nestjs-metadata-storage';
import { Faq } from './faq.dto';
import { Plan } from './plan.dto';
import { Payment } from './payment.dto';

@$Schema({
  metadata: {
    customInfo: 'Custom string',
  },
})
export class FaqExtended extends IntersectionType(Faq, Plan, PartialType(Payment)) {
  @$Prop({
    swagger: { type: String, required: false },
  })
  extra: string | null;
}
```

## Notes

- `$Schema` decorator is optional.
- `@nestjs/swagger` is required.
- `MetadataModule` is global module.
- Please, override decorators for improve your code.
- This project is for provide functionality to other projects.
- Decorators and type helpers automatically are chained with Swagger decorators for docs annotation.
