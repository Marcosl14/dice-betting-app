import { mock } from "jest-mock-extended";
import { CreateBetResolver } from "../../../../src/infrastructure/resolvers/bets/CreateBetResolver";
import { CreateBetUseCase } from "../../../../src/application/usecases/bets/CreateBetUseCase";
import { IBet } from "../../../../src/domain/entities/IBet";
import { CreateBetDTO } from "../../../../src/application/dtos/CreateBetDTO";
import { GraphQLError } from "graphql";

describe("CreateBetResolver", () => {
  const createBetUseCase = mock<CreateBetUseCase>();
  const createBetResolver = new CreateBetResolver(createBetUseCase);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a list of bets for a given user", async () => {
    const userId = 1;
    const betAmount = 100;
    const chance = 0.5;

    const mockBet: IBet = {
      id: 1,
      userId: userId,
      betAmount: betAmount,
      chance: chance,
      payout: betAmount / chance,
      win: true,
    };

    createBetUseCase.execute.mockResolvedValue(mockBet);

    const result = await createBetResolver.createBet(userId, betAmount, chance);

    expect(result).toEqual(mockBet);
    expect(createBetUseCase.execute).toHaveBeenCalledWith(
      new CreateBetDTO(userId, betAmount, chance)
    );
    expect(createBetUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it("should throw a GraphQLError if the use case fails", async () => {
    const userId = 1;
    const betAmount = 100;
    const chance = 0.5;

    const unknownError = new Error("Unknown error");

    createBetUseCase.execute.mockRejectedValue(unknownError);

    let err: Error | undefined = undefined;
    try {
      await createBetResolver.createBet(userId, betAmount, chance);
    } catch (error) {
      err = error as Error;
    } finally {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(GraphQLError);
      expect(err?.message).toEqual(unknownError.message);
      expect(createBetUseCase.execute).toHaveBeenCalledWith(
        new CreateBetDTO(userId, betAmount, chance)
      );
      expect(createBetUseCase.execute).toHaveBeenCalledTimes(1);
    }
  });
});
