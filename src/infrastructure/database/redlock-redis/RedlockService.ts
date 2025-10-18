import { Service } from "typedi";
import { ILock, ILockService } from "../../../domain/database/ILockService";
import { RedisClient } from "./redisclient";
import RedlockClient from "redlock";
import { ConflictError } from "../../../application/erros/ConflictError";

@Service()
export class RedlockService implements ILockService {
  private redlock: RedlockClient;

  constructor() {
    this.redlock = new RedlockClient([new RedisClient().getInstance() as any]);
  }

  public async lock(key: string, ttl: number): Promise<ILock> {
    try {
      return (await this.redlock.acquire([key], ttl)) as unknown as ILock;
    } catch (error) {
      if (error?.constructor?.name === "ResourceLockedError") {
        throw new ConflictError(`Resource ${key} is locked.`);
      }
      throw error;
    }
  }

  public async unlock(lock: ILock): Promise<void> {
    return await lock.release();
  }
}
