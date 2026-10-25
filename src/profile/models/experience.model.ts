import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Company } from './company.model';

@ObjectType()
export class Experience {
    @Field(() => Int)
    id: number;

    @Field()
    position: string;

    @Field(() => Company)
    company: Company;

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
