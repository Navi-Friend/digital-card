import { Injectable } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Args, Int, Query } from '@nestjs/graphql';
import { Profile } from './models/profile.model';

@Injectable()
export class ProfileResolver {
    constructor(private readonly profileService: ProfileService) {}

    @Query(() => Profile, {
        name: 'profile',
        description: "Return user's profile",
    })
    async profile(@Args('id', { type: () => Int }) id: number) {
        return this.profileService.findOne(id);
    }

    @Query(() => [Profile], {
        name: 'profiles',
        description: 'Return all profiles',
    })
    async profiles() {
        return this.profileService.findAll();
    }
}
