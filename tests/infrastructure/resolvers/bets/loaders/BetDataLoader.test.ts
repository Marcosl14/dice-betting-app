import { mock } from "jest-mock-extended";
import { BetDataLoader } from "../../../../../src/infrastructure/resolvers/bets/loaders/BetDataLoader";
import { GetBetListUseCase } from "../../../../../src/application/usecases/bets/GetBetListUseCase";
import { IBet } from "../../../../../src/domain/entities/IBet";

describe("BetDataLoader", () => {
  const mockGetBetListUseCase = mock<GetBetListUseCase>();
  const loader = new BetDataLoader(mockGetBetListUseCase);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return bets for the given userId", async () => {
    const userId = 1;
    const bets: IBet[] = [
      { id: 1, userId, betAmount: 10, chance: 50, payout: 20, win: false },
      { id: 2, userId, betAmount: 20, chance: 30, payout: 60, win: true },
    ];

    mockGetBetListUseCase.execute.mockResolvedValue(bets);

    const result = await loader.load(userId);

    expect(result).toEqual(bets);
    expect(mockGetBetListUseCase.execute).toHaveBeenCalledWith({
      userIds: [userId],
    });
    expect(mockGetBetListUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it("should return empty array when no bets for the user", async () => {
    const userId = 2;
    const bets: IBet[] = [
      { id: 1, userId: 1, betAmount: 10, chance: 50, payout: 20, win: false },
    ];

    mockGetBetListUseCase.execute.mockResolvedValue(bets);

    const result = await loader.load(userId);

    expect(result).toEqual([]);
    expect(mockGetBetListUseCase.execute).toHaveBeenCalledWith({
      userIds: [userId],
    });
    expect(mockGetBetListUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it("should batch load when multiple loads are performed (DataLoader behaviour)", async () => {
    const userIdA = 1;
    const userIdB = 2;

    const bets: IBet[] = [
      {
        id: 1,
        userId: userIdA,
        betAmount: 10,
        chance: 50,
        payout: 20,
        win: true,
      },
      {
        id: 2,
        userId: userIdB,
        betAmount: 20,
        chance: 60,
        payout: 40,
        win: false,
      },
    ];

    mockGetBetListUseCase.execute.mockResolvedValue(bets);

    const resultA = await loader.load(userIdA);
    const resultB = await loader.load(userIdB);

    expect(resultA).toEqual(bets.filter((b) => b.userId === userIdA));
    expect(resultB).toEqual(bets.filter((b) => b.userId === userIdB));
    expect(mockGetBetListUseCase.execute).toHaveBeenCalledWith({
      userIds: [userIdA],
    });
    expect(mockGetBetListUseCase.execute).toHaveBeenCalledWith({
      userIds: [userIdB],
    });
    expect(mockGetBetListUseCase.execute).toHaveBeenCalledTimes(2);
  });
});
