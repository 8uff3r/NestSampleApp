import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class SubtractDto {
  @ApiProperty({
    type: Number,
    description: 'Number to subtract from',
  })
  @IsNotEmpty()
  x: number;

  @ApiProperty({
    type: Number,
    description: 'Number to subtract with',
  })
  @IsNotEmpty()
  y: number;
}
