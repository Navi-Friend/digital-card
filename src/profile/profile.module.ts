import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [ProfileResolver, ProfileService],
})
export class ProfileModule {}
