import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AdditionMultiplicationDto } from '../dto/addition-multiplication.dto';
import { SubtractDto } from '../dto/subtract.dto';

/**
 * Contains needed responses used in Swagger
 */
const ApiResponses = {
  addition: {
    badReq: 'The input string should not be empty',
  },
  subtraction: {
    badReq: 'Input parameters Should only contain numbers',
  },
};

/**
 * Swagger decorators for subtraction
 */
export function SwaggerCompDecSubtract() {
  return applyDecorators(
    ApiConsumes('application/x-www-form-urlencoded'),
    ApiOperation({
      summary:
        'Gets two parameters "x" and "y" and gives the result of "x - y"',
    }),
    ApiBody({
      type: SubtractDto,
      required: true,
    }),
    ApiBadRequestResponse({
      description: ApiResponses.subtraction.badReq,
    }),
    ApiOkResponse({
      description: 'Returns the result of the subtraction',
    }),
  );
}

/**
 * Swagger decorators for addition
 */
export function SwaggerCompDecAdd() {
  return applyDecorators(
    ApiConsumes('application/x-www-form-urlencoded'),
    ApiBody({
      type: AdditionMultiplicationDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'Addition of the numbers in the input string',
    }),
    ApiBadRequestResponse({
      description: ApiResponses.addition.badReq,
    }),
    ApiOperation({
      summary: 'Adds numbers given in the form "num1,num2,..."',
    }),
  );
}

/**
 * Swagger decorators for multiplication
 */
export function SwaggerCompDecMult() {
  return applyDecorators(
    ApiConsumes('application/x-www-form-urlencoded'),
    ApiBody({
      type: AdditionMultiplicationDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'Multiplication of the numbers in the input string',
    }),
    ApiBadRequestResponse({
      description: ApiResponses.addition.badReq,
    }),
    ApiOperation({
      summary: 'Multiplies numbers given in the form "num1,num2,..."',
    }),
  );
}
