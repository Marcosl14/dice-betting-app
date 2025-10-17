import { ObjectType, Field, ID, Float } from "type-graphql";
import { IUser } from "../../domain/entities/IUser";

@ObjectType({ description: "Represents a betting user." })
export class User implements IUser {
  @Field(() => ID)
  id!: number;

  @Field({ description: "Name of the user" })
  name!: string;

  @Field(() => Float, { description: "Balance of the user" })
  balance!: number;
}
