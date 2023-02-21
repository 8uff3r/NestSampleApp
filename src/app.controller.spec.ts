import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

describe('AppController', () => {
  let app: INestApplication;
  let appController: AppController;
  const mockAppService = {};
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AppController],
      providers: [AppService],
    })
      .overrideProvider(AppModule)
      .useValue(AppModule)
      .overrideProvider(AppService)
      .useValue(mockAppService)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('addition', () => {
    it(`POST add and receive an exception`, () => {
      return request(app.getHttpServer()).post('/add').expect(400);
    });

    it('Should be defined', () => {
      expect(appController).toBeDefined();
    });

    it('Should throw an error on empty input', () => {
      expect(() => appController.add({ input: '' })).toThrowError();
    });
  });
  //   const additionInputs: { [key: string]: number } = {
  //     '1,2,3': 6,
  //     '1': 1,
  //   };
  //
  //   describe('addition', () => {
  //     it(`POST add`, () => {
  //       return request(app.getHttpServer()).post('/add').expect(400);
  //     });
  //     describe('ValidAddition', () => {
  //       for (const testCase in additionInputs) {
  //         it(`should return the result of adding ${testCase}`, () => {
  //           console.log(testCase[0]);
  //           expect(appController.add({ input: testCase })).toBe(
  //             additionInputs[testCase],
  //           );
  //         });
  //       }
  //     });
  //     describe('InvalidAddition', () => {
  //       it('Should trow an error in case of an empty input', () => {
  //         expect(() => appController.add({ input: undefined })).toThrowError();
  //         expect(() => appController.add({ input: '' })).toThrowError();
  //       });
  //     });
  //   });
  //
  describe('subtraction', () => {
    it(`POST subtract`, () => {
      return request(app.getHttpServer()).post('/subtract').expect(400);
    });
    it('Should trow an error in case of an ivalid input', () => {
      //@ts-ignore
      expect(() => appController.subtract({ x: 2, y: 'a' })).toThrowError();
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
