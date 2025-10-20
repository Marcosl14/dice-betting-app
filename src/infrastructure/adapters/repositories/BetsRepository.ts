import { Inject, Service } from "typedi";
import { IBet } from "../../../domain/entities/IBet";
import {
  CreateBetI,
  IBetsRepository,
  IGetBetList,
} from "../../../domain/repositories/IBetsRepository";
import { BetModel } from "../../database/sequelize-postgres/models/BetModel";
import { UserModel } from "../../database/sequelize-postgres/models/UserModel";
import { FindOptions, QueryTypes } from "sequelize";
import { BadRequestError } from "../../../application/erros/BadRequestError";

@Service()
export class BetsRepository implements IBetsRepository {
  constructor(
    @Inject("betModel") private betModel: typeof BetModel,
    @Inject("userModel") private userModel: typeof UserModel
  ) {}

  async find(id: number): Promise<IBet | undefined> {
    const bet = await this.betModel.findByPk(id);
    return bet?.dataValues;
  }

  async findAll(params?: IGetBetList): Promise<IBet[]> {
    const bets: BetModel[] = await this.betModel.findAll(
      params ? this.getFindAllParams(params) : {}
    );

    return bets.map((bet) => bet.dataValues);
  }

  private getFindAllParams({ userIds, limit, page }: IGetBetList) {
    const params: FindOptions = {};

    if (userIds) {
      params.where = {
        userId: userIds,
      };
    }

    if (limit) {
      params.limit = limit;
    }

    if (page && limit) {
      params.offset = (page - 1) * limit;
    }

    return params;
  }

  async findBestBetPerUser(limit: number): Promise<IBet[]> {
    const query = `
      SELECT DISTINCT ON ("userId") *
      FROM bets
      WHERE win = true
      ORDER BY "userId", (payout / "betAmount") DESC, id DESC
      LIMIT :limit
    `;

    const bestBets = await this.betModel.sequelize!.query<IBet>(query, {
      replacements: { limit },
      type: QueryTypes.SELECT,
    });

    return bestBets;
  }

  async create(data: CreateBetI): Promise<IBet> {
    const result = await this.betModel.sequelize!.transaction(async (t) => {
      const user = await this.userModel.findByPk(data.userId, {
        transaction: t,
        lock: true,
      });

      if (!user) {
        throw new BadRequestError(
          `User with id ${data.userId} does not exist.`
        );
      }

      if (user.balance < data.betAmount) {
        throw new BadRequestError("Insufficient balance.");
      }

      const bet = await this.betModel.create(
        {
          ...data,
        },
        { transaction: t }
      );

      user.balance -= data.betAmount;

      if (data.win) {
        user.balance += data.payout;
      }

      await user.save({ transaction: t });

      return bet;
    });

    return result.dataValues;
  }
}
