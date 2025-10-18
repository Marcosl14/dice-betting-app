import { GraphQLError } from "graphql";
import { NotFoundError } from "../../../application/erros/NotFoundError";
import { BadRequestError } from "../../../application/erros/BadRequestError";

export class GraphQlErrorHandling {
  public static handle(error: Error) {
    if (error instanceof BadRequestError) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: "BAD_REQUEST",
        },
      });
    }

    if (error instanceof NotFoundError) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: "NOT_FOUND",
        },
      });
    }

    throw new GraphQLError(error.message, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
}
