import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { AppRepository } from './app.repository';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

describe('AppController', () => {
  let app: INestApplication;
  let appController: AppController;
  let mockAppService: AppService;
  let mockAppRepository: AppRepository;
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        RedisModule.forRoot({
          config: {
            host: 'localhost',
            port: 6379,
          },
        }),
      ],
      controllers: [AppController],
      providers: [AppService, AppRepository],
    })
      // .useMocker((token) => {
      //   if (typeof token === 'function') {
      //     const mockMetadata = moduleMocker.getMetadata(
      //       token,
      //     ) as MockFunctionMetadata<any, any>;
      //     const Mock = moduleMocker.generateFromMetadata(mockMetadata);
      //     return new Mock();
      //   }
      // })
      .overrideProvider(AppService)
      .useValue(mockAppService)
      .overrideProvider(AppRepository)
      .useValue(mockAppRepository)
      .compile();
    app = moduleRef.createNestApplication();
    appController = app.get<AppController>(AppController);
    await app.init();
  });

  it('Should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('addition', () => {
    it(`POST add and receive an exception`, () => {
      return request(app.getHttpServer()).post('/add').expect(400);
    });

    it('Should be defined', () => {
      expect(appController.add).toBeDefined();
    });

    it('Should throw an error on empty input', () => {
      expect(() => appController.add({ input: '' })).toThrowError();
    });

    describe('InvalidAddition', () => {
      it('Should trow an error in case of an empty input', () => {
        expect(() => appController.add({ input: undefined })).toThrowError();
        expect(() => appController.add({ input: '' })).toThrowError();
      });
    });
    const additionInputs: { [key: string]: number } = {
      '1,2,3': 6,
      '1': 1,
    };
    describe('ValidAddition', () => {
      for (const testCase in additionInputs) {
        it(`should return the result of adding ${testCase}`, () => {
          console.log(testCase[0]);
          expect(appController.add({ input: testCase })).toBe(
            additionInputs[testCase],
          );
        });
      }
    });
  });
  describe('subtraction', () => {
    it(`POST subtract`, () => {
      return request(app.getHttpServer()).post('/subtract').expect(400);
    });
    it('Should be defined', () => {
      expect(appController.subtract).toBeDefined();
    });
    it('Should trow an error in case of an ivalid input', () => {
      expect(() =>
        //@ts-ignore
        appController.subtract({ x: 2, y: 'a' }),
      ).rejects.toThrowError();
    });
  });

  describe('multiplication', () => {
    it('POST /multiply', () => {
      return request(app.getHttpServer()).post('/multiply').expect(400);
    });

    it('Should be defined', () => {
      expect(appController.multiply).toBeDefined();
    });
    it('Should throw an error in case of empty input', () => {
      expect(() => appController.multiply({ input: '' })).toThrowError();
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
