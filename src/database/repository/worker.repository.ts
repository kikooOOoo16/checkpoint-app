import {BaseRepository} from './base.repository';
import {Worker} from '../model/entity/worker';

export class WorkerRepository extends BaseRepository<Worker> {
  constructor() {
    super('workers');
  }

  async findByEmail(email: string): Promise<Worker | null> {
    return this.findOne({email});
  }
}

export const workerRepository = new WorkerRepository();
