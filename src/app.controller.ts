import {
  BadRequestException,
  Body,
  CacheInterceptor,
  CacheTTL,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Cache } from 'cache-manager';
import {
  SwaggerCompDecAdd,
  SwaggerCompDecMult,
  SwaggerCompDecSubtract,
} from './decorators/swaggerComp.decorator';
import { AdditionMultiplicationDto } from './dto/addition-multiplication.dto';
import { SubtractDto } from './dto/subtract.dto';

/**
 * Contains needed responses used in Swagger and for throwing exceptions
 */
@ApiTags('math')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Addition handler
   */

  @Post('add')

  /**
   * Swagger decorators for addition
   */
  @SwaggerCompDecAdd()
  add(@Body(ValidationPipe) additionDto: AdditionMultiplicationDto): number {
    /**
     * Convert the input string to an array by splitting with "," and call the add method from the service
     */
    const numberArray = additionDto.input;
    if (!parseFloat(numberArray)) throw new BadRequestException();
    return this.appService.add(numberArray.split(','));
  }

  /**
   * subtraction handler
   */
  @Post('subtract')

  /**
   * Swagger decorators for subtraction
   */
  @SwaggerCompDecSubtract()

  /**
   * Use redis cache if requested within the 30s interval
   */
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30) // override TTL to 30 seconds
  subtract(@Body() subtractDto: SubtractDto): number {
    /**
     * throw exception if the request body is empty/invalid
     */
    const result = this.appService.subtract(subtractDto);
    if (Number.isNaN(result))
      throw new BadRequestException(
        'Input parameters Should only contain numbers',
      );
    return result;
  }

  /**
   * multiplication handler
   */
  @Post('multiply')

  /**
   * Swagger decorators for multiplication
   */
  @SwaggerCompDecMult()
  multiply(@Body(ValidationPipe) multiplicationDto: AdditionMultiplicationDto) {
    const numberArray = multiplicationDto.input;
    if (!parseFloat(numberArray)) throw new BadRequestException();
    return this.appService.multiply(numberArray.split(','));
  }

  // @UseInterceptors(CacheInterceptor)
  // @CacheTTL(20000)
  // @Get('history')
  // async getHistory() {
  //   const val = await this.cacheManager.get('history');
  //   if (!val) await this.cacheManager.set('history', ['1+2 = 3']);
  //   this.cacheManager.store.mset();
  //   return val;
  // }
}
