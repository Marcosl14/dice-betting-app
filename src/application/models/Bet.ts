import { ObjectType, Field, ID, Float } from "type-graphql";
import { IBet } from "../../domain/entities/IBet";

@ObjectType({ description: "Represents a betting user." })
export class Bet implements IBet {
  @Field(() => ID)
  id!: number;

  @Field(() => ID)
  userId!: number;

  @Field(() => Float)
  betAmount!: number;

  @Field(() => Float)
  chance!: number;

  @Field(() => Float)
  payout!: number;

  @Field()
  win!: boolean;
}
