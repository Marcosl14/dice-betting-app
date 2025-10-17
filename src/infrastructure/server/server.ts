import express, { Application } from "express";
import { GraphQLRoutes } from "./routes/GraphQLRoutes";
import { DbClient } from "../database/sequelize-postgres/dbclient";

export class Server {
  private app: Application;
  private port: number = 3000;

  constructor(private dbclient: DbClient) {
    this.app = express();
  }

  public async bootstrap(): Promise<void> {
    await this.dbclient.connect();

    this.app.use(express.json());

    await this.setupRoutes();

    this.app.listen(this.port, () => {
      console.log("Server listening on port 3000");
    });
  }

  private async setupRoutes(): Promise<void> {
    await new GraphQLRoutes().execute(this.app);
  }
}
