import Client from "ioredis";

export class RedisClient {
  private host = process.env.REDIS_HOST!;
  private port = process.env.REDIS_PORT!;

  private readonly instance: Client;

  constructor() {
    this.instance = new Client({
      host: this.host,
      port: parseInt(this.port),
    });
  }

  public getInstance(): Client {
    return this.instance;
  }
}
