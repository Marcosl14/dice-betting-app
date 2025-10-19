import { mock } from "jest-mock-extended";
import { GetBestBetPerUserResolver } from "../../../../src/infrastructure/resolvers/bets/GetBestBetPerUserResolver";
import { IBet } from "../../../../src/domain/entities/IBet";
import { GetBestBetPerUserUseCase } from "../../../../src/application/usecases/bets/GetBestBetPerUserUseCase";
import { GraphQLError } from "graphql";

describe("GetBestBetPerUserResolver", () => {
  const mockGetBestBetPerUserUseCase = mock<GetBestBetPerUserUseCase>();
  const getBestBetPerUserResolver = new GetBestBetPerUserResolver(
    mockGetBestBetPerUserUseCase
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a list of best bets per user", async () => {
    const limit = 5;
    const mockBets: IBet[] = [
      {
        id: 1,
        userId: 1,
        betAmount: 100,
        chance: 0.5,
        payout: 200,
        win: true,
      },
      {
        id: 2,
        userId: 2,
        betAmount: 200,
        chance: 0.3,
        payout: 666.67,
        win: true,
      },
    ];

    mockGetBestBetPerUserUseCase.execute.mockResolvedValue(mockBets);

    const result = await getBestBetPerUserResolver.getBestBetPerUser(limit);

    expect(result).toEqual(mockBets);
    expect(mockGetBestBetPerUserUseCase.execute).toHaveBeenCalledWith(limit);
    expect(mockGetBestBetPerUserUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it("should throw a GraphQLError if the use case fails", async () => {
    const limit = 5;
    const errorMessage = "Failed to fetch best bets";
    const useCaseError = new Error(errorMessage);
    mockGetBestBetPerUserUseCase.execute.mockRejectedValue(useCaseError);

    await expect(
      getBestBetPerUserResolver.getBestBetPerUser(limit)
    ).rejects.toThrow(new GraphQLError(errorMessage));

    expect(mockGetBestBetPerUserUseCase.execute).toHaveBeenCalledWith(limit);
    expect(mockGetBestBetPerUserUseCase.execute).toHaveBeenCalledTimes(1);
  });
});
