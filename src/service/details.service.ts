import {apiAdapter} from './api/api.adapter';
import {visitorRepository, workerRepository} from '../database';
import {Visitor, Worker} from '../database/model';

/**
 * Service for interacting with SEED details
 */
export class DetailsService {
  /**
   * Creates a new DetailService instance.
   *
   * @constructor
   * @param adapter - The adapter used for communication with the platform.
   * @param visitorRepo
   * @param workerRepo
   */
  constructor(
    private readonly adapter = apiAdapter,
    private readonly visitorRepo = visitorRepository,
    private readonly workerRepo = workerRepository
  ) {}

  async registerVisitor(visitorData: Visitor): Promise<void> {
    await this.visitorRepo.create(visitorData);
  }

  async loginWorker(username: string): Promise<Worker | null> {
    const worker = await this.workerRepo.findByUsername(username);
    if (worker) {
      await this.workerRepo.update({username}, {lastLogin: new Date()});
    }
    return worker;
  }
}

/**
 * An instance of the DetailService class with the default apiAdapter.
 */
export const detailService = new DetailsService();
