import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service';

@Injectable()
export class ProfileService {
    constructor(private readonly prismaService: PrismaService) {}

    async findOne() {
        const profile = await this.prismaService.profile.findFirst({
            include: {
                experiences: {
                    include: {
                        company: true,
                    },
                },
                projects: true,
            },
        });

        if (!profile) {
            throw new NotFoundException('Profile is not found');
        }

        return profile;
    }
}
