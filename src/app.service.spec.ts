import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';

describe('AppService', () => {
  let app: INestApplication;
  let appService: AppService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      // controllers: [AppController],
      providers: [AppService],
    })
      .overrideProvider(AppModule)
      .useValue(AppModule)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      // controllers: [AppController],
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
  });
  it('Should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('add method', () => {
    it('Should be defined', () => {
      expect(appService.add).toBeDefined();
    });

    it('Should return the result of addition', () => {
      expect(appService.add(['1', '2', '3'])).toEqual(6);
    });
  });
  describe('subtract method', () => {
    it('Should be defined', () => {
      expect(appService.subtract).toBeDefined();
    });
    it('Should return the result of subtraction', () => {
      expect(appService.subtract({ x: 5, y: 1 })).toEqual(4);
    });
  });
  describe('multiply method', () => {
    it('Should be defined', () => {
      expect(appService.multiply).toBeDefined();
    });
    it('Should return the result of multiplication', () => {
      expect(appService.multiply(['1', '2', '3'])).toEqual(6);
    });
  });
});
