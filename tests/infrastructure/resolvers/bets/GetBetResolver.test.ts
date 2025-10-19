import { mock } from "jest-mock-extended";
import { GetBetResolver } from "../../../../src/infrastructure/resolvers/bets/GetBetResolver";
import { IBet } from "../../../../src/domain/entities/IBet";
import { GetBetUseCase } from "../../../../src/application/usecases/bets/GetBetUseCase";
import { NotFoundError } from "../../../../src/application/erros/NotFoundError";
import { GraphQLError } from "graphql";

describe("GetBetResolver", () => {
  const mockGetBetUseCase = mock<GetBetUseCase>();
  const getBetResolver = new GetBetResolver(mockGetBetUseCase);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a bet when a valid id is provided", async () => {
    const betId = 1;
    const mockBet: IBet = {
      id: betId,
      userId: 1,
      betAmount: 100,
      chance: 0.5,
      payout: 50,
      win: true,
    };

    mockGetBetUseCase.execute.mockResolvedValue(mockBet);

    const result = await getBetResolver.getBet(betId);

    expect(result).toEqual(mockBet);
    expect(mockGetBetUseCase.execute).toHaveBeenCalledWith(betId);
    expect(mockGetBetUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it("should return not found error when an invalid id is provided", async () => {
    const betId = 1;
    const notFoundError = new NotFoundError("Bet not found");
    mockGetBetUseCase.execute.mockRejectedValue(notFoundError);

    let err: Error | undefined = undefined;
    try {
      await getBetResolver.getBet(betId);
    } catch (error) {
      err = error as Error;
    } finally {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(GraphQLError);
      expect(err?.message).toEqual(notFoundError.message);
      expect(mockGetBetUseCase.execute).toHaveBeenCalledWith(betId);
      expect(mockGetBetUseCase.execute).toHaveBeenCalledTimes(1);
    }
  });
});
