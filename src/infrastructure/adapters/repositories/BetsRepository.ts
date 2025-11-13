import { Inject, Service } from "typedi";
import { IBet } from "../../../domain/entities/IBet";
import {
  CreateBetI,
  IBetsRepository,
  IGetBetList,
} from "../../../domain/repositories/IBetsRepository";
import { BetModel } from "../../database/sequelize-postgres/models/BetModel";
import { FindOptions, QueryTypes, Transaction } from "sequelize";

@Service()
export class BetsRepository implements IBetsRepository {
  constructor(@Inject("betModel") private betModel: typeof BetModel) {}

  async find(id: number, transaction?: Transaction): Promise<IBet | undefined> {
    const bet = await this.betModel.findByPk(id, { transaction });
    return bet?.dataValues;
  }

  async findAll(
    params?: IGetBetList,
    transaction?: Transaction
  ): Promise<IBet[]> {
    const bets: BetModel[] = await this.betModel.findAll(
      params
        ? { ...this.getFindAllParams(params), transaction }
        : { transaction }
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

  async findBestBetPerUser(
    limit: number,
    transaction?: Transaction
  ): Promise<IBet[]> {
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
      transaction,
    });

    return bestBets;
  }

  async create(data: CreateBetI, transaction?: Transaction): Promise<IBet> {
    return this.betModel.create(data, { transaction });
  }
}
