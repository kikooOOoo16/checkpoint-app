import bcrypt from 'bcrypt';
import {getTraceId, logger, LogNamespace} from '../logger';

export class AuthService {
  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    logger(LogNamespace.AUTH_SERVICE_NAMESPACE).debug('Hashing password', {
      context: {traceId: getTraceId()}
    });
    return await bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    logger(LogNamespace.AUTH_SERVICE_NAMESPACE).debug('Comparing password hash', {
      context: {traceId: getTraceId()}
    });
    return await bcrypt.compare(password, hash);
  }
}

export const authService = new AuthService();
