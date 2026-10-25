import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Digital Card API (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('returns a health status', async () => {
        await request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect(({ body }: { body: Record<string, string> }) => {
                expect(body.status).toBe('ok');
                expect(new Date(body.dateTime).toISOString()).toBe(
                    body.dateTime,
                );
            });
    });

    it('returns the profile and requested nested data through GraphQL', async () => {
        const query = `
            query {
                profile {
                    name
                    skills
                    experiences {
                        position
                        company {
                            name
                        }
                    }
                    projects {
                        name
                        link
                    }
                }
            }
        `;

        await request(app.getHttpServer())
            .post('/graphql')
            .send({ query })
            .expect(200)
            .expect(
                ({
                    body,
                }: {
                    body: {
                        data?: {
                            profile?: {
                                name: string;
                                skills: string[];
                                experiences: Array<{
                                    position: string;
                                    company: { name: string };
                                }>;
                                projects: Array<{
                                    name: string;
                                    link: string;
                                }>;
                            };
                        };
                        errors?: unknown[];
                    };
                }) => {
                    expect(body.errors).toBeUndefined();
                    expect(body.data?.profile?.name).toBeTruthy();
                    expect(body.data?.profile?.skills.length).toBeGreaterThan(
                        0,
                    );
                    expect(
                        body.data?.profile?.experiences.length,
                    ).toBeGreaterThan(0);
                    expect(
                        body.data?.profile?.experiences[0]?.company.name,
                    ).toBeTruthy();
                },
            );
    });
});
