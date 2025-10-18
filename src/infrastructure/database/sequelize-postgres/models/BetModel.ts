import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  PrimaryKey,
  Table,
  Model,
  AllowNull,
} from "sequelize-typescript";
import { IBet } from "../../../../domain/entities/IBet";
import { Optional } from "sequelize";
import { UserModel } from "./UserModel";

interface BetModelAttributes extends IBet {
  createdAt?: Date;
  updatedAt?: Date;
}

type BetCreationAttributes = Optional<IBet, "id">;

@Table({ tableName: "bets" })
export class BetModel
  extends Model<BetModelAttributes, BetCreationAttributes>
  implements IBet
{
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare userId: number;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL,
  })
  declare betAmount: number;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  declare chance: number;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL,
  })
  declare payout: number;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare win: boolean;

  @BelongsTo(() => UserModel)
  declare user: UserModel;
}
