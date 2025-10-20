import { UsersRepository } from "../../../../src/infrastructure/adapters/repositories/UsersRepository";

describe("UsersRepository", () => {
  const mockUserModel = {
    findByPk: jest.fn(),
    findAll: jest.fn(),
  } as any;

  const repo = new UsersRepository(mockUserModel);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("find should return user dataValues when found", async () => {
    const user = { id: 1, name: "Alice", balance: 100 };
    mockUserModel.findByPk.mockResolvedValue({ dataValues: user });

    const result = await repo.find(1);

    expect(result).toEqual(user);
    expect(mockUserModel.findByPk).toHaveBeenCalledWith(1);
  });

  it("find should return undefined when not found", async () => {
    mockUserModel.findByPk.mockResolvedValue(null);

    const result = await repo.find(999);

    expect(result).toBeUndefined();
    expect(mockUserModel.findByPk).toHaveBeenCalledWith(999);
  });

  it("findAll with userIds should filter by ids", async () => {
    const users = [{ id: 1, name: "A", balance: 10 }];
    mockUserModel.findAll.mockResolvedValue(
      users.map((u) => ({ dataValues: u }))
    );

    const result = await repo.findAll([1]);

    expect(result).toEqual(users);
    expect(mockUserModel.findAll).toHaveBeenCalledWith({ where: { id: [1] } });
  });

  it("findAll without userIds should return all users", async () => {
    const users = [
      { id: 1, name: "A", balance: 10 },
      { id: 2, name: "B", balance: 20 },
    ];
    mockUserModel.findAll.mockResolvedValue(
      users.map((u) => ({ dataValues: u }))
    );

    const result = await repo.findAll();

    expect(result).toEqual(users);
    expect(mockUserModel.findAll).toHaveBeenCalled();
  });
});
