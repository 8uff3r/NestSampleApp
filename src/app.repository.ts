import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { History } from './history.entity';

@Injectable()
export class AppRepository extends Repository<History> {
  constructor(private dataSource: DataSource) {
    super(History, dataSource.createEntityManager());
  }

  async createItem(newSave: string[]) {
    const history = new History();
    history.item = newSave;
    return await history.save();
  }
}
