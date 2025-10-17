import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  PrimaryKey,
  Table,
  Model,
  HasMany,
} from "sequelize-typescript";
import { IUser } from "../../../../domain/entities/IUser";
import { Optional } from "sequelize";
import { BetModel } from "./BetModel";

interface UserModelAttributes extends IUser {
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<IUser, "id">;

@Table({ tableName: "users" })
export class UserModel
  extends Model<UserModelAttributes, UserCreationAttributes>
  implements IUser
{
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL,
  })
  declare balance: number;

  @HasMany(() => BetModel)
  declare bets: BetModel[];
}
