import { mock } from "jest-mock-extended";
import { GetBetListUseCase } from "../../../../src/application/usecases/bets/GetBetListUseCase";
import { IBetsRepository } from "../../../../src/domain/repositories/IBetsRepository";
import { IBet } from "../../../../src/domain/entities/IBet";

describe("GetBetListUseCase", () => {
  const mockBetsRepository = mock<IBetsRepository>();
  const getBetListUseCase = new GetBetListUseCase(mockBetsRepository);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return bets array when repository resolves", async () => {
    const userIds = [1, 2];
    const bets: IBet[] = [
      {
        id: 1,
        userId: 1,
        betAmount: 50,
        chance: 0.5,
        payout: 100,
        win: true,
        createdAt: new Date(),
      } as IBet,
    ];

    mockBetsRepository.findAll.mockResolvedValue(bets);

    const result = await getBetListUseCase.execute({ userIds });

    expect(result).toEqual(bets);
    expect(mockBetsRepository.findAll).toHaveBeenCalledWith({ userIds });
  });

  it("should handle repository errors using try/catch/finally", async () => {
    const userIds = [3];
    const error = new Error("repo fail");
    mockBetsRepository.findAll.mockRejectedValue(error);

    let err: Error | undefined = undefined;
    try {
      await getBetListUseCase.execute({ userIds });
    } catch (error) {
      err = error as Error;
    } finally {
      expect(err).toBeDefined();
      expect(err).toBe(error);
      expect(mockBetsRepository.findAll).toHaveBeenCalledWith({ userIds });
    }
  });
});
