import { Injectable } from '@nestjs/common';
import { SubtractDto } from './dto/subtract.dto';

@Injectable()
export class AppService {
  /**
   * Method for handling post request to /add
   */
  add(inputArray: string[]) {
    let sum: number = 0;
    for (const i of Object.values(inputArray)) {
      sum += parseFloat(i);
    }
    return sum;
  }

  /**
   * Method for handling post request to /subtract
   */
  subtract(subtractDto: SubtractDto): number {
    const { x, y } = subtractDto;
    return x - y;
  }

  /**
   * Method for handling post request to /multiply
   */
  multiply(inputArray: string[]) {
    let multiplyRes: number = 1;
    for (const i of Object.values(inputArray)) {
      multiplyRes = multiplyRes * parseFloat(i);
    }
    return multiplyRes;
  }
}
