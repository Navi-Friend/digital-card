import { NotFoundException } from '@nestjs/common';
import { jest } from '@jest/globals';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
    const findFirst =
        jest.fn<() => Promise<{ id: number; name: string } | null>>();
    const prismaService = {
        profile: { findFirst },
    } as unknown as PrismaService;
    const service = new ProfileService(prismaService);

    beforeEach(() => {
        findFirst.mockReset();
    });

    it('returns the profile without loading relations', async () => {
        const profile = { id: 1, name: 'Test profile' };
        findFirst.mockResolvedValue(profile);

        await expect(service.findOne()).resolves.toBe(profile);
        expect(findFirst).toHaveBeenCalledWith({});
    });

    it('throws when the profile does not exist', async () => {
        findFirst.mockResolvedValue(null);

        await expect(service.findOne()).rejects.toEqual(
            new NotFoundException('Profile is not found'),
        );
    });
});
