# Custom metadata storage for NestJS projects

- New storage for custom metadata for schemas and props types.

## Usage

### Schema definition

```ts
import { ApiProperty } from '@nestjs/swagger';
import { _Schema, _Prop } from 'nestjs-metadata-storage';

export enum FaqStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

@_Schema()
export class Faq {
  @_Prop()
  _id: string;

  @_Prop({ type: 'String', required: false })
  category: string | null;

  @_Prop()
  question: string;

  @_Prop()
  answer: string;

  @_Prop({
    type: 'FaqStatusEnum',
    enum: FaqStatusEnum,
  })
  status: FaqStatusEnum;

  @_Prop()
  position: number;
}
```

## Access to metadata

```ts

```
