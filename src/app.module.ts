import { Module, CacheModule } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { redisStore } from 'cache-manager-redis-yet';
const redisStore = require('cache-manager-redis-yet').redisStore;

@Module({
  imports: [
    // CacheModule.registerAsync({
    //   useFactory: async () => await redisStore({ ttl: 5000 }),
    // }),
    // CacheModule.register({
    //   isGlobal: true,
    //   store: redisStore,
    //   url: 'redis://localhost:6379',
    // }),

    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
        // password: 'authpassword',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
