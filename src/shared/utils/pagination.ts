import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Max, Min } from 'class-validator';

export class Pagination {
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ type: Number, required: false })
  @Min(0)
  offset?: number = 0;

  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ type: Number, required: false })
  @Min(5)
  @Max(50)
  limit?: number = 10;

  @ApiProperty({ type: Number })
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  current_page: number = 1;
}
