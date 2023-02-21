import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { History } from 'src/history.entity';
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  database: 'simpleCalc',
  entities: [History],
  autoLoadEntities: true,
  synchronize: true,
};
