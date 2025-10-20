import { mock } from "jest-mock-extended";
import { GetBestBetPerUserUseCase } from "../../../../src/application/usecases/bets/GetBestBetPerUserUseCase";
import { IBetsRepository } from "../../../../src/domain/repositories/IBetsRepository";
import { IBet } from "../../../../src/domain/entities/IBet";

describe("GetBestBetPerUserUseCase", () => {
  const mockBetsRepository = mock<IBetsRepository>();
  const getBestBetUseCase = new GetBestBetPerUserUseCase(mockBetsRepository);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return an array of best bets when repository resolves", async () => {
    const limit = 5;
    const bets: IBet[] = [
      {
        id: 1,
        userId: 1,
        betAmount: 100,
        chance: 0.5,
        payout: 200,
        win: true,
        createdAt: new Date(),
      } as IBet,
    ];

    mockBetsRepository.findBestBetPerUser.mockResolvedValue(bets);

    const result = await getBestBetUseCase.execute(limit);

    expect(result).toEqual(bets);
    expect(mockBetsRepository.findBestBetPerUser).toHaveBeenCalledWith(limit);
    expect(mockBetsRepository.findBestBetPerUser).toHaveBeenCalledTimes(1);
  });

  it("should propagate errors from repository", async () => {
    const limit = 3;
    const error = new Error("DB failure");
    mockBetsRepository.findBestBetPerUser.mockRejectedValue(error);

    let err: Error | undefined = undefined;
    try {
      await getBestBetUseCase.execute(limit);
    } catch (error) {
      err = error as Error;
    } finally {
      expect(err).toBeDefined();
      expect(err).toBe(error);
      expect(mockBetsRepository.findBestBetPerUser).toHaveBeenCalledWith(limit);
    }
  });
});
