import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import {
  SwaggerCompDecAdd,
  SwaggerCompDecHistory,
  SwaggerCompDecMult,
  SwaggerCompDecSave,
  SwaggerCompDecSubtract,
} from './decorators/swaggerComp.decorator';
import { AdditionMultiplicationDto } from './dto/addition-multiplication.dto';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { SubtractDto } from './dto/subtract.dto';
import { AppRepository } from './app.repository';

/**
 * Contains needed responses used in Swagger and for throwing exceptions
 */
@ApiTags('math')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRedis() private readonly redis: Redis,
    private appRepository: AppRepository,
  ) {}

  /**
   * Addition handler
   */

  @Post('add')

  /**
   * Swagger decorators for addition
   */
  @SwaggerCompDecAdd()
  add(@Body(ValidationPipe) additionDto: AdditionMultiplicationDto) {
    /**
     * Convert the input string to an array by splitting with "," and call the add method from the service
     */
    const numberString = additionDto.input;
    if (!parseFloat(numberString)) throw new BadRequestException();

    /**
     * turn the input string to an array of numbers
     */
    const numberArray = numberString.split(',');

    /**
     * initialize the history
     */
    let historyString = '';
    const result = this.appService.add(numberArray);

    for (const i in numberArray) {
      if (parseFloat(i) == 0) {
        historyString += `${numberArray[0]}`;
      } else {
        historyString += ` + ${numberArray[i]}`;
      }
    }
    historyString += ` = ${result}`;
    this.redis.lpush('history', historyString);
    return result;
  }

  /**
   * multiplication handler
   */
  @Post('multiply')

  /**
   * Swagger= decorators for multiplication
   */
  @SwaggerCompDecMult()
  multiply(@Body(ValidationPipe) multiplicationDto: AdditionMultiplicationDto) {
    const numberString = multiplicationDto.input;
    if (!parseFloat(numberString)) {
      throw new BadRequestException();
    }
    const numberArray = numberString.split(',');

    const result = this.appService.multiply(numberArray);

    let historyString = '';
    for (const i in numberArray) {
      if (parseFloat(i) == 0) {
        historyString += `${numberArray[0]}`;
      } else {
        historyString += ` * ${numberArray[i]}`;
      }
    }
    historyString += ` = ${result}`;
    this.redis.lpush('history', historyString);
    return result;
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
  async subtract(
    @Body(ValidationPipe) subtractDto: SubtractDto,
  ): Promise<number> {
    /**
     * throw exception if the request body is empty/invalid
     */
    const result = this.appService.subtract(subtractDto);
    if (Number.isNaN(result))
      throw new BadRequestException(
        'Input parameters Should only contain numbers',
      );
    const { x, y } = subtractDto;
    await this.redis.lpush('history', `${x} - ${y} = ${result}`);
    return result;
  }

  /**
   * handler for getting the saved and unsaved history
   */
  @Get('history')
  /**
   * Swagger decorators for history
   */
  @SwaggerCompDecHistory()
  async getHistory() {
    /**
     * get all the unsaved history from redis
     */
    const unsaved = await this.redis.lrange('history', 0, -1);

    /**
     *initialize the object to be returned
     */
    let returnObject: { saved: string[][]; unsaved: string[][] } = {
      saved: [],
      unsaved: [],
    };
    try {
      /**
       * find all saved history items from the database
       */
      const query = await this.appRepository.find({
        select: {
          item: true,
        },
      });
      /**
       * push each item in database to the "saved" key of the returned object
       */

      for (const i of query.values()) {
        returnObject.saved.push(i.item);
      }
      /**
       *in case of error push a notice to the object instead
       */
    } catch (error) {
      returnObject.saved.push(["There's no saved history"]);
    }
    /**
     * push redis unsaved history to the returnObject
     */
    returnObject.unsaved.push(unsaved);
    return returnObject;
  }

  /**
   * handler for saving the unsaved history to the database
   */
  @Get('save')
  /**
   * Swagger decorators for save route
   */
  @SwaggerCompDecSave()
  async saveHistory() {
    const currentHistory = await this.redis.lrange('history', 0, -1);
    await this.appRepository.createItem(currentHistory);
    await this.redis.del('history');
    return currentHistory;
  }
}
