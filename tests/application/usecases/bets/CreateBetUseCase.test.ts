import { mock } from "jest-mock-extended";
import { CreateBetUseCase } from "../../../../src/application/usecases/bets/CreateBetUseCase";
import {
  IBetsRepository,
  CreateBetI,
} from "../../../../src/domain/repositories/IBetsRepository";
import {
  ILockService,
  ILock,
} from "../../../../src/domain/database/ILockService";
import { CreateBetDTO } from "../../../../src/application/dtos/CreateBetDTO";
import { IBet } from "../../../../src/domain/entities/IBet";
import { BadRequestError } from "../../../../src/application/erros/BadRequestError";

describe("CreateBetUseCase", () => {
  const mockBetsRepository = mock<IBetsRepository>();
  const mockLockingService = mock<ILockService>();

  const createBetUseCase = new CreateBetUseCase(
    mockBetsRepository,
    mockLockingService
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should create a bet successfully when inputs are valid", async () => {
    const input: CreateBetDTO = {
      userId: 1,
      betAmount: 100,
      chance: 0.5,
    };

    const fakeLock: ILock = { release: async () => {} };
    mockLockingService.lock.mockResolvedValue(fakeLock);
    mockLockingService.unlock.mockResolvedValue(undefined);

    const mathRandomSpy = jest
      // @ts-expect-error -> because generateRandomNumber is private
      .spyOn(createBetUseCase, "generateRandomNumber")
      // @ts-expect-error -> because generateRandomNumber is private
      .mockReturnValue(0.4);

    const createdBet: IBet = {
      id: 10,
      userId: input.userId,
      betAmount: input.betAmount,
      chance: input.chance,
      payout: input.betAmount / input.chance,
      win: true,
      createdAt: new Date(),
    } as IBet;

    mockBetsRepository.create.mockResolvedValue(createdBet);

    const result = await createBetUseCase.execute(input);

    expect(result).toEqual(createdBet);
    expect(mockLockingService.lock).toHaveBeenCalledTimes(1);
    expect(mockLockingService.unlock).toHaveBeenCalledWith(fakeLock);
    expect(mockBetsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining<Partial<CreateBetI>>({
        userId: input.userId,
        betAmount: input.betAmount,
        chance: input.chance,
      })
    );

    mathRandomSpy.mockRestore();
  });

  it("should throw BadRequestError when chance is invalid", async () => {
    const input: CreateBetDTO = {
      userId: 1,
      betAmount: 50,
      chance: 2,
    };

    const fakeLock: ILock = { release: async () => {} };
    mockLockingService.lock.mockResolvedValue(fakeLock);
    mockLockingService.unlock.mockResolvedValue(undefined);

    let err: Error | undefined = undefined;
    try {
      await createBetUseCase.execute(input);
    } catch (error) {
      err = error as Error;
    } finally {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(BadRequestError);
      expect(mockBetsRepository.create).not.toHaveBeenCalled();
      expect(mockLockingService.unlock).toHaveBeenCalledWith(fakeLock);
    }
  });
});
