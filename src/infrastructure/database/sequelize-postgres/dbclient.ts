import { Sequelize } from "sequelize-typescript";
import { IDatabaseConnection } from "../../../domain/database/IDatabaseConnection";
import { UserModel } from "./models/UserModel";
import { BetModel } from "./models/BetModel";
import Container from "typedi";

export class DbClient implements IDatabaseConnection {
  private database = process.env.DB_NAME!;
  private username = process.env.DB_USER!;
  private password = process.env.DB_PASSWORD!;
  private host = process.env.DB_HOST!;

  private readonly instance: Sequelize;

  constructor() {
    this.instance = new Sequelize({
      database: this.database,
      username: this.username,
      password: this.password,
      host: this.host,
      dialect: "postgres",
      models: [UserModel, BetModel],
    });
  }

  public async connect() {
    try {
      await this.instance.authenticate();
      console.log("Connection has been established successfully.");

      Container.set("userModel", UserModel);
      Container.set("betModel", BetModel);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  public async disconnect() {
    await this.instance.close();
  }
}
