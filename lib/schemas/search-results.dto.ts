import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  filtered: number;

  @ApiProperty()
  showing: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  data: T[];
}
