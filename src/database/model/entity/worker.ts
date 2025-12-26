import {AccountRole} from '../../../model/enums/account-roles.enum';

export interface WorkerSession {
  loginTime: Date;
  logoutTime?: Date;
}

export interface Worker {
  email: string;
  password?: string; // Should be hashed
  role: AccountRole;
  lastLogin?: Date;
  sessions?: WorkerSession[];
}
