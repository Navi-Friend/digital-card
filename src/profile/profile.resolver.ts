import {
    Context,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { Company } from './models/company.model';
import { Experience } from './models/experience.model';
import { Profile } from './models/profile.model';
import { Project } from './models/project.model';
import { ProfileLoaders } from './profile.loaders';
import { ProfileService } from './profile.service';

@Resolver(() => Profile)
export class ProfileResolver {
    constructor(private readonly profileService: ProfileService) {}

    @Query(() => Profile, {
        name: 'profile',
        description: "Return user's profile",
    })
    profile() {
        return this.profileService.findOne();
    }

    @ResolveField(() => [Experience])
    experiences(
        @Parent() profile: Profile,
        @Context() context: { loaders: ProfileLoaders },
    ) {
        return context.loaders.experiencesByProfileId.load(profile.id);
    }

    @ResolveField(() => [Project])
    projects(
        @Parent() profile: Profile,
        @Context() context: { loaders: ProfileLoaders },
    ) {
        return context.loaders.projectsByProfileId.load(profile.id);
    }
}

@Resolver(() => Experience)
export class ExperienceResolver {
    @ResolveField(() => Company)
    company(
        @Parent() experience: Experience & { companyId: number },
        @Context() context: { loaders: ProfileLoaders },
    ) {
        return context.loaders.companyById.load(experience.companyId);
    }
}
