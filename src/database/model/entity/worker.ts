export interface Worker {
  username: string;
  password?: string; // Should be hashed
  role: 'worker' | 'admin';
  lastLogin?: Date;
}
