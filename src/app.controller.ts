import {
  BadRequestException,
  Body,
  CacheTTL,
  Controller,
  Get,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import {
  SwaggerCompDecAdd,
  SwaggerCompDecMult,
  SwaggerCompDecSubtract,
} from './decorators/swaggerComp.decorator';
import { AdditionMultiplicationDto } from './dto/addition-multiplication.dto';
import Redis from 'ioredis';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
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
  ) {} // or // @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis)

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

    const numberArray = numberString.split(',');

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
    if (!parseFloat(numberString)) throw new BadRequestException();
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
  async subtract(@Body() subtractDto: SubtractDto): Promise<number> {
    /**
     * throw exception if the request body is empty/invalidten","msg":"Acquiring the global lock for shutdown"}
{"t":{"$date":"2023
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

  @Get('history')
  async getHistory() {
    const unsaved = await this.redis.lrange('history', 0, -1);
    const query = await this.appRepository.find({
      select: {
        item: true,
      },
    });
    let returnObject: { saved: string[][]; unsaved: string[][] } = {
      saved: [],
      unsaved: [],
    };
    for (const i of query.values()) {
      returnObject.saved.push(i.item);
    }
    returnObject.unsaved.push(unsaved);
    return returnObject;
  }

  @Get('save')
  async saveHistory() {
    const currentHistory = await this.redis.lrange('history', 0, -1);
    await this.appRepository.createItem(currentHistory);
    await this.redis.del('history');
    return currentHistory;
  }
}
