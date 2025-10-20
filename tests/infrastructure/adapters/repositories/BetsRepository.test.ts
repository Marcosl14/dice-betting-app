import { BetsRepository } from "../../../../src/infrastructure/adapters/repositories/BetsRepository";
import { BadRequestError } from "../../../../src/application/erros/BadRequestError";

describe("BetsRepository", () => {
  const mockBetModel = {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    sequelize: { query: jest.fn(), transaction: jest.fn() },
  } as any;

  const mockUserSave = jest.fn();
  const mockUserModel = {
    findByPk: jest.fn(),
  } as any;

  const repo = new BetsRepository(mockBetModel, mockUserModel);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("find should return bet dataValues when found", async () => {
    const bet = {
      id: 1,
      userId: 1,
      betAmount: 10,
      chance: 50,
      payout: 20,
      win: false,
    } as any;
    mockBetModel.findByPk.mockResolvedValue({ dataValues: bet });

    const result = await repo.find(1);

    expect(result).toEqual(bet);
    expect(mockBetModel.findByPk).toHaveBeenCalledWith(1);
  });

  it("find should return undefined when not found", async () => {
    mockBetModel.findByPk.mockResolvedValue(null);

    const result = await repo.find(999);

    expect(result).toBeUndefined();
    expect(mockBetModel.findByPk).toHaveBeenCalledWith(999);
  });

  it("findAll with userIds should filter by userId", async () => {
    const bets = [
      { id: 1, userId: 1, betAmount: 10, chance: 50, payout: 20, win: false },
    ];
    mockBetModel.findAll.mockResolvedValue(
      bets.map((b) => ({ dataValues: b }))
    );

    const result = await repo.findAll([1]);

    expect(result).toEqual(bets);
    expect(mockBetModel.findAll).toHaveBeenCalled();
  });

  it("findAll without userIds should return all bets", async () => {
    const bets = [
      { id: 1, userId: 1, betAmount: 10, chance: 50, payout: 20, win: false },
      { id: 2, userId: 2, betAmount: 20, chance: 60, payout: 40, win: true },
    ];
    mockBetModel.findAll.mockResolvedValue(
      bets.map((b) => ({ dataValues: b }))
    );

    const result = await repo.findAll();

    expect(result).toEqual(bets);
    expect(mockBetModel.findAll).toHaveBeenCalled();
  });

  it("findBestBetPerUser should return rows from raw query", async () => {
    const best = [
      { id: 1, userId: 1, betAmount: 10, chance: 50, payout: 20, win: true },
    ];

    (mockBetModel.sequelize!.query as jest.Mock).mockResolvedValue(best);

    const result = await repo.findBestBetPerUser(10);

    expect(result).toEqual(best);
    expect(mockBetModel.sequelize!.query).toHaveBeenCalled();
  });

  it("create should create bet and update user balance on success", async () => {
    const data = {
      userId: 1,
      betAmount: 10,
      chance: 50,
      payout: 20,
      win: true,
    };

    const fakeTransaction = async (fn: any) => {
      return fn({});
    };

    mockBetModel.sequelize!.transaction = jest.fn(fakeTransaction);

    const user = { id: 1, balance: 100, save: mockUserSave };
    mockUserModel.findByPk.mockResolvedValue(user as any);

    const createdBet = { dataValues: { id: 10, ...data } };
    mockBetModel.create.mockResolvedValue(createdBet as any);

    const result = await repo.create(data as any);

    expect(result).toEqual(createdBet.dataValues);
    expect(mockUserModel.findByPk).toHaveBeenCalledWith(
      data.userId,
      expect.any(Object)
    );
    expect(mockBetModel.create).toHaveBeenCalledWith(
      { ...data },
      expect.any(Object)
    );
    expect(mockUserSave).toHaveBeenCalled();
  });

  it("create should throw BadRequestError when user not found", async () => {
    mockBetModel.sequelize!.transaction = jest.fn(async (fn: any) => fn({}));
    mockUserModel.findByPk.mockResolvedValue(null);

    await expect(
      repo.create({
        userId: 999,
        betAmount: 10,
        chance: 50,
        payout: 20,
        win: false,
      } as any)
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it("create should throw BadRequestError when insufficient balance", async () => {
    mockBetModel.sequelize!.transaction = jest.fn(async (fn: any) => fn({}));
    const user = { id: 2, balance: 5, save: mockUserSave };
    mockUserModel.findByPk.mockResolvedValue(user as any);

    await expect(
      repo.create({
        userId: 2,
        betAmount: 10,
        chance: 50,
        payout: 20,
        win: false,
      } as any)
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
