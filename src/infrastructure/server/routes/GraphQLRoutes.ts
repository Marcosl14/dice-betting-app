import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { Application } from "express";
import { buildSchema } from "type-graphql";
import Container from "typedi";

import { CreateBetResolver } from "../../resolvers/bets/CreateBetResolver";
import { GetBestBetPerUserResolver } from "../../resolvers/bets/GetBestBetPerUserResolver";
import { GetBetListResolver } from "../../resolvers/bets/GetBetListResolver";
import { GetBetResolver } from "../../resolvers/bets/GetBetResolver";
import { GetUserListResolver } from "../../resolvers/users/GetUserListResolver";
import { GetUserResolver } from "../../resolvers/users/GetUserResolver";
import { GetBetUserResolver } from "../../resolvers/bets/GetBetUserResolver";
import { GetUserBetsResolver } from "../../resolvers/users/GetUserBetsResolver";

export class GraphQLRoutes {
  private mainpath = "/graphql";

  public async execute(app: Application): Promise<void> {
    const schema = await buildSchema({
      container: Container,
      resolvers: [
        GetUserResolver,
        GetUserListResolver,
        GetUserBetsResolver,

        GetBetResolver,
        GetBetUserResolver,
        GetBetListResolver,
        GetBestBetPerUserResolver,
        CreateBetResolver,
      ],
      validate: false,
    });

    const apolloServer = new ApolloServer({ schema });
    await apolloServer.start();

    app.use(this.mainpath, expressMiddleware(apolloServer));
  }
}
