import { mock } from "jest-mock-extended";
import { GetBetListResolver } from "../../../../src/infrastructure/resolvers/bets/GetBetListResolver";
import { IBet } from "../../../../src/domain/entities/IBet";
import { GetBetListUseCase } from "../../../../src/application/usecases/bets/GetBetListUseCase";
import { GraphQLError } from "graphql";

describe("GetBetListResolver", () => {
  const mockGetBetListUseCase = mock<GetBetListUseCase>();
  const getBetListResolver = new GetBetListResolver(mockGetBetListUseCase);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a list of bets", async () => {
    const mockBets: IBet[] = [
      {
        id: 1,
        userId: 1,
        betAmount: 100,
        chance: 0.5,
        payout: 50,
        win: true,
      },
      {
        id: 2,
        userId: 2,
        betAmount: 200,
        chance: 0.3,
        payout: 60,
        win: false,
      },
    ];

    mockGetBetListUseCase.execute.mockResolvedValue(mockBets);

    const result = await getBetListResolver.getBetList();

    expect(result).toEqual(mockBets);
    expect(mockGetBetListUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if the use case fails", async () => {
    const errorMessage = "Failed to fetch bets";
    const useCaseError = new Error(errorMessage);
    mockGetBetListUseCase.execute.mockRejectedValue(useCaseError);

    let err: Error | undefined = undefined;
    try {
      await getBetListResolver.getBetList();
    } catch (error) {
      err = error as Error;
    } finally {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(GraphQLError);
      expect(err?.message).toEqual(errorMessage);
      expect(mockGetBetListUseCase.execute).toHaveBeenCalledTimes(1);
    }
  });
});
