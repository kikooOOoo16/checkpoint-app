import {BaseRepository} from './base.repository';
import {Worker} from '../model/entity/worker';

export class WorkerRepository extends BaseRepository<Worker> {
  constructor() {
    super('workers');
  }

  async findByUsername(username: string): Promise<Worker | null> {
    return this.findOne({username});
  }
}

export const workerRepository = new WorkerRepository();
