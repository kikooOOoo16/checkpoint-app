import {BaseRepository} from './base.repository';
import {Visitor} from '../model/entity/visitor';

export class VisitorRepository extends BaseRepository<Visitor> {
  constructor() {
    super('visitors');
  }
}

export const visitorRepository = new VisitorRepository();
