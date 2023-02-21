import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class AdditionMultiplicationDto {
  @ApiProperty({type: String, description: 'Input to calculate in the form of "<num1>,<num2>,..."'})
  @IsNotEmpty()
  @IsString()
  @Matches(/[0-9,]*/)
  input: string;
}
