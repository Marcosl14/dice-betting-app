import { Sequelize, SequelizeOptions } from "sequelize-typescript";
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
    const options: SequelizeOptions = {
      database: this.database,
      username: this.username,
      password: this.password,
      host: this.host,
      dialect: "postgres",
      models: [UserModel, BetModel],
    };

    if (process.env.NODE_ENV === "development") {
      options.logging = true;
    } else {
      options.logging = false;
    }

    this.instance = new Sequelize(options);
  }

  public async connect() {
    try {
      await this.instance.authenticate();
      console.log("Connection has been established successfully.");

      // Only for development purpose
      if (process.env.NODE_ENV === "development") {
        await this.syncTablesAndCreateUser();
      }

      Container.set("userModel", UserModel);
      Container.set("betModel", BetModel);
      Container.set(Sequelize, this.instance);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  private async syncTablesAndCreateUser(): Promise<void> {
    await this.instance.sync({ force: true, alter: true });

    const username = "John Doe";

    await UserModel.findOrCreate({
      where: { name: username },
      defaults: {
        name: username,
        balance: 1000,
      },
    });
  }

  public async disconnect() {
    await this.instance.close();
  }
}
