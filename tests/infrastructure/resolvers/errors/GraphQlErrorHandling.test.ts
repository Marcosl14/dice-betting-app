import { GraphQlErrorHandling } from "./../../../../src/infrastructure/resolvers/errors/GraphQlErrorHandling";
import { BadRequestError } from "./../../../../src/application/erros/BadRequestError";
import { GraphQLError } from "graphql";
import { NotFoundError } from "../../../../src/application/erros/NotFoundError";
describe("GraphQlErrorHandling", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a GraphQLError with BAD_REQUEST code for BadRequestError", () => {
    const message = "Invalid input";
    const err = new BadRequestError(message);

    const result = GraphQlErrorHandling.handle(err);

    expect(result).toBeInstanceOf(GraphQLError);
    expect(result.message).toEqual(message);
    expect(result.extensions).toBeDefined();
    expect(result.extensions?.code).toEqual("BAD_REQUEST");
  });

  it("should return a GraphQLError with NOT_FOUND code for NotFoundError", () => {
    const message = "Resource not found";
    const err = new NotFoundError(message);

    const result = GraphQlErrorHandling.handle(err);

    expect(result).toBeInstanceOf(GraphQLError);
    expect(result.message).toEqual(message);
    expect(result.extensions).toBeDefined();
    expect(result.extensions?.code).toEqual("NOT_FOUND");
  });

  it("should return a GraphQLError with INTERNAL_SERVER_ERROR code for generic Error", () => {
    const message = "Something went wrong";
    const err = new Error(message);

    const result = GraphQlErrorHandling.handle(err);

    expect(result).toBeInstanceOf(GraphQLError);
    expect(result.message).toEqual(message);
    expect(result.extensions).toBeDefined();
    expect(result.extensions?.code).toEqual("INTERNAL_SERVER_ERROR");
  });
});
