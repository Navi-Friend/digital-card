import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ExperienceResolver, ProfileResolver } from './profile.resolver';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [ProfileResolver, ExperienceResolver, ProfileService],
})
export class ProfileModule {}
