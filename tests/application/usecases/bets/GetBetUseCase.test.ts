import { mock } from "jest-mock-extended";
import { GetBetUseCase } from "../../../../src/application/usecases/bets/GetBetUseCase";
import { IBetsRepository } from "../../../../src/domain/repositories/IBetsRepository";
import { IBet } from "../../../../src/domain/entities/IBet";
import { NotFoundError } from "../../../../src/application/erros/NotFoundError";

describe("GetBetUseCase", () => {
  const mockBetsRepository = mock<IBetsRepository>();
  const getBetUseCase = new GetBetUseCase(mockBetsRepository);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a bet when found", async () => {
    const id = 1;
    const bet: IBet = {
      id,
      userId: 1,
      betAmount: 20,
      chance: 0.5,
      payout: 40,
      win: true,
      createdAt: new Date(),
    } as IBet;
    mockBetsRepository.find.mockResolvedValue(bet);

    const result = await getBetUseCase.execute(id);

    expect(result).toEqual(bet);
    expect(mockBetsRepository.find).toHaveBeenCalledWith(id);
  });

  it("should throw NotFoundError when bet not found (try/catch/finally)", async () => {
    const id = 2;
    mockBetsRepository.find.mockResolvedValue(undefined);

    let err: Error | undefined = undefined;
    try {
      await getBetUseCase.execute(id);
    } catch (error) {
      err = error as Error;
    } finally {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(NotFoundError);
      expect(mockBetsRepository.find).toHaveBeenCalledWith(id);
    }
  });
});
