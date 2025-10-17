import "reflect-metadata";
import { Server } from "./infrastructure/server/server";
import { DbClient } from "./infrastructure/database/sequelize-postgres/dbclient";

const dbclient = new DbClient();

new Server(dbclient).bootstrap();
