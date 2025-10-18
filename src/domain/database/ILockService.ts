export interface ILockService {
  lock(key: string, ttl: number): Promise<ILock>;
  unlock(lock: ILock): Promise<void>;
}

export interface ILock {
  release(): Promise<void>;
}

export const ILockService = "ILockService";
