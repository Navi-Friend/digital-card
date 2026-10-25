import DataLoader from 'dataloader';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { CompanyModel } from '../generated/prisma/models/Company';
import { ExperienceModel } from '../generated/prisma/models/Experience';
import { ProjectModel } from '../generated/prisma/models/Project';

export interface ProfileLoaders {
    experiencesByProfileId: DataLoader<number, ExperienceModel[]>;
    projectsByProfileId: DataLoader<number, ProjectModel[]>;
    companyById: DataLoader<number, CompanyModel>;
}

export function createProfileLoaders(
    prismaService: PrismaService,
): ProfileLoaders {
    return {
        experiencesByProfileId: new DataLoader(async (profileIds) => {
            const experiences = await prismaService.experience.findMany({
                where: {
                    profileId: {
                        in: [...profileIds],
                    },
                },
            });

            return profileIds.map((profileId) =>
                experiences.filter(
                    (experience) => experience.profileId === profileId,
                ),
            );
        }),

        projectsByProfileId: new DataLoader(async (profileIds) => {
            const projects = await prismaService.project.findMany({
                where: {
                    profileId: {
                        in: [...profileIds],
                    },
                },
            });

            return profileIds.map((profileId) =>
                projects.filter((project) => project.profileId === profileId),
            );
        }),

        companyById: new DataLoader(async (companyIds) => {
            const companies = await prismaService.company.findMany({
                where: {
                    id: {
                        in: [...companyIds],
                    },
                },
            });

            const companiesById = new Map(
                companies.map((company) => [company.id, company]),
            );

            return companyIds.map((companyId) => {
                const company = companiesById.get(companyId);

                if (!company) {
                    throw new Error(`Company with id ${companyId} not found`);
                }

                return company;
            });
        }),
    };
}
