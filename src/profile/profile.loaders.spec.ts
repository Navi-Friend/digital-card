import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { jest } from '@jest/globals';
import { createProfileLoaders } from './profile.loaders';

describe('createProfileLoaders', () => {
    it('batches experiences and projects by profile id', async () => {
        const experienceFindMany = jest
            .fn<() => Promise<Array<{ id: number; profileId: number }>>>()
            .mockResolvedValue([
                { id: 10, profileId: 1 },
                { id: 11, profileId: 2 },
            ]);
        const projectFindMany = jest
            .fn<() => Promise<Array<{ id: number; profileId: number }>>>()
            .mockResolvedValue([
                { id: 20, profileId: 1 },
                { id: 21, profileId: 2 },
            ]);
        const prismaService = {
            experience: { findMany: experienceFindMany },
            project: { findMany: projectFindMany },
            company: { findMany: jest.fn() },
        } as unknown as PrismaService;
        const loaders = createProfileLoaders(prismaService);

        await expect(
            Promise.all([
                loaders.experiencesByProfileId.load(1),
                loaders.experiencesByProfileId.load(2),
            ]),
        ).resolves.toEqual([
            [{ id: 10, profileId: 1 }],
            [{ id: 11, profileId: 2 }],
        ]);

        await expect(
            Promise.all([
                loaders.projectsByProfileId.load(1),
                loaders.projectsByProfileId.load(2),
            ]),
        ).resolves.toEqual([
            [{ id: 20, profileId: 1 }],
            [{ id: 21, profileId: 2 }],
        ]);

        expect(experienceFindMany).toHaveBeenCalledTimes(1);
        expect(projectFindMany).toHaveBeenCalledTimes(1);
    });

    it('returns companies in key order and caches duplicate keys', async () => {
        const companyFindMany = jest
            .fn<() => Promise<Array<{ id: number; name: string }>>>()
            .mockResolvedValue([
                { id: 2, name: 'Second' },
                { id: 1, name: 'First' },
            ]);
        const prismaService = {
            experience: { findMany: jest.fn() },
            project: { findMany: jest.fn() },
            company: { findMany: companyFindMany },
        } as unknown as PrismaService;
        const loaders = createProfileLoaders(prismaService);

        await expect(
            Promise.all([
                loaders.companyById.load(1),
                loaders.companyById.load(2),
                loaders.companyById.load(1),
            ]),
        ).resolves.toEqual([
            { id: 1, name: 'First' },
            { id: 2, name: 'Second' },
            { id: 1, name: 'First' },
        ]);

        expect(companyFindMany).toHaveBeenCalledTimes(1);
        expect(companyFindMany).toHaveBeenCalledWith({
            where: { id: { in: [1, 2] } },
        });
    });

    it('rejects when a requested company is missing', async () => {
        const prismaService = {
            experience: { findMany: jest.fn() },
            project: { findMany: jest.fn() },
            company: {
                findMany: jest
                    .fn<() => Promise<Array<never>>>()
                    .mockResolvedValue([]),
            },
        } as unknown as PrismaService;
        const loaders = createProfileLoaders(prismaService);

        await expect(loaders.companyById.load(999)).rejects.toThrow(
            'Company with id 999 not found',
        );
    });
});
