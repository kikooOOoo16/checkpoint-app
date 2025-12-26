import {apiAdapter} from './api/api.adapter';
import {visitorRepository, workerRepository} from '../database';
import {Visitor, Worker} from '../database/model';
import {authService} from './auth.service';
import {getTraceId, logger, LogNamespace} from '../logger';

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
   * @param auth
   */
  constructor(
    private readonly adapter = apiAdapter,
    private readonly visitorRepo = visitorRepository,
    private readonly workerRepo = workerRepository,
    private readonly auth = authService
  ) {}

  async registerVisitor(visitorData: Visitor): Promise<void> {
    logger(LogNamespace.DETAILS_SERVICE_NAMESPACE).info('Registering new visitor in database', {
      context: {
        traceId: getTraceId(),
        attributes: {email: visitorData.email}
      }
    });
    await this.visitorRepo.create(visitorData);
  }

  async registerWorker(workerData: Worker): Promise<void> {
    logger(LogNamespace.DETAILS_SERVICE_NAMESPACE).info('Registering new worker in database', {
      context: {
        traceId: getTraceId(),
        attributes: {email: workerData.email, role: workerData.role}
      }
    });
    await this.workerRepo.create(workerData);
  }

  async loginWorker(email: string, password?: string): Promise<Worker | null> {
    logger(LogNamespace.DETAILS_SERVICE_NAMESPACE).info('Attempting to login worker', {
      context: {
        traceId: getTraceId(),
        attributes: {email}
      }
    });

    const worker = await this.workerRepo.findByEmail(email);
    if (worker) {
      const isMatch = password && worker.password ? await this.auth.comparePassword(password, worker.password) : false;

      if (isMatch || !worker.password) {
        logger(LogNamespace.DETAILS_SERVICE_NAMESPACE).info('Worker login successful', {
          context: {
            traceId: getTraceId(),
            attributes: {email}
          }
        });
        const now = new Date();
        await this.workerRepo.update(
          {email},
          {
            $set: {lastLogin: now},
            $push: {sessions: {loginTime: now}}
          }
        );
        return worker;
      }

      logger(LogNamespace.DETAILS_SERVICE_NAMESPACE).warn('Worker login failed: Invalid password', {
        context: {
          traceId: getTraceId(),
          attributes: {email}
        }
      });
    } else {
      logger(LogNamespace.DETAILS_SERVICE_NAMESPACE).warn('Worker login failed: Worker not found', {
        context: {
          traceId: getTraceId(),
          attributes: {email}
        }
      });
    }
    return null;
  }

  async logoutWorker(email: string): Promise<void> {
    logger(LogNamespace.DETAILS_SERVICE_NAMESPACE).info('Attempting to logout worker', {
      context: {
        traceId: getTraceId(),
        attributes: {email}
      }
    });

    await this.workerRepo.update(
      {email, sessions: {$elemMatch: {logoutTime: {$exists: false}}}},
      {$set: {'sessions.$.logoutTime': new Date()}}
    );
  }
}

/**
 * An instance of the DetailService class with the default apiAdapter.
 */
export const detailService = new DetailsService();
