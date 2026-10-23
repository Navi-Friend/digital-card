import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Experience {
    @Field(() => Int)
    id: number;

    @Field()
    position: string;

    @Field()
    start: Date;

    @Field(() => Date, { nullable: true })
    end: Date | null;

    @Field(() => [String])
    achievements: string[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
