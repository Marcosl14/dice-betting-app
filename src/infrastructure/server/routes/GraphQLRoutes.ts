import { Application } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import { GetUserResolver } from "../../resolvers/users/GetUserResolver";

export class GraphQLRoutes {
  private mainpath = "/graphql";

  public async execute(app: Application): Promise<void> {
    const schema = await buildSchema({
      container: Container,
      resolvers: [GetUserResolver],
      validate: false,
    });

    const apolloServer = new ApolloServer({ schema });
    await apolloServer.start();

    app.use(this.mainpath, expressMiddleware(apolloServer));
  }
}
