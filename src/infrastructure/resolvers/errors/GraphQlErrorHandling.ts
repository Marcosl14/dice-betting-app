import { GraphQLError } from "graphql";
import { NotFoundError } from "../../../application/erros/NotFoundError";
import { BadRequestError } from "../../../application/erros/BadRequestError";

export class GraphQlErrorHandling {
  public static handle(error: Error): GraphQLError {
    if (error instanceof BadRequestError) {
      return new GraphQLError(error.message, {
        extensions: {
          code: "BAD_REQUEST",
        },
      });
    }

    if (error instanceof NotFoundError) {
      return new GraphQLError(error.message, {
        extensions: {
          code: "NOT_FOUND",
        },
      });
    }

    return new GraphQLError(error.message, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
}
