import { Injectable } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Query } from '@nestjs/graphql';
import { Profile } from './models/profile.model';

@Injectable()
export class ProfileResolver {
    constructor(private readonly profileService: ProfileService) {}

    @Query(() => Profile, {
        name: 'profile',
        description: "Return user's profile",
    })
    profile() {
        return this.profileService.findOne();
    }
}
