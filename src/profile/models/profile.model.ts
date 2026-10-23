import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Experience } from './experience.model';
import { Project } from './project.model';

@ObjectType()
export class Profile {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field(() => [String])
    links: string[];

    @Field(() => [String])
    skills: string[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field(() => [Experience])
    experiences: Experience[];

    @Field(() => [Project])
    projects: Project[];
}
