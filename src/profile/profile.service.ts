import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service';

@Injectable()
export class ProfileService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAll() {
        return this.prismaService.profile.findMany({
            include: {
                experiences: true,
                projects: true,
            },
        });
    }

    async findOne(id: number) {
        const profile = await this.prismaService.profile.findUnique({
            where: { id },
            include: {
                experiences: true,
                projects: true,
            },
        });

        if (!profile) {
            throw new NotFoundException(`Profile with id ${id} is not found`);
        }

        return profile;
    }
}
