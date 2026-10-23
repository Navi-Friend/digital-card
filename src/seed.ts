import { PrismaClient } from './generated/prisma/client';

export async function seedDatabase(prisma: PrismaClient) {
    console.log('🧹 Очистка базы данных...');

    await prisma.experience.deleteMany();
    await prisma.project.deleteMany();
    await prisma.company.deleteMany();
    await prisma.profile.deleteMany();

    console.log('🌱 Начато заполнение базы данных...');

    const profile = await prisma.profile.create({
        data: {
            name: 'Ivan Konovalov',
            description:
                'Backend-focused Fullstack Developer (Node.js/TypeScript/NestJS) with 3+ years of experience building scalable enterprise applications and robust APIs. Backed by a strong academic foundation in Mathematics and C++, bringing a deep understanding of memory management, data structures, and algorithmic optimization. Proven track record in backend architecture, database design (PostgreSQL/MongoDB), and DevOps (Docker, CI/CD).',
            links: [
                'konovalovivan2005@gmail.com',
                'https://linkedin.com/in/ivan-konovalov-backend',
                'https://github.com/Navi-Friend',
            ],
            skills: [
                'TypeScript',
                'Node.js',
                'NestJS',
                'Express.js',
                'PostgreSQL',
                'MongoDB',
                'Redis',
                'Docker',
                'React',
                'Git',
                'Linux',
                'RabbitMQ',
                'gRPC',
                'GraphQL',
                'WebSocket',
                'SQL',
                'Prisma',
                'Jest',
                'Prometheus',
                'Grafana',
            ],
            experiences: {
                create: [
                    {
                        position: 'FullStack Developer / Team Lead',
                        start: new Date('2024-05-01T00:00:00.000Z'),
                        end: new Date('2026-06-30T00:00:00.000Z'),
                        achievements: [
                            'Architected and scaled backend infrastructure, transitioning core modules into a distributed microservices architecture.',
                            'Designed complex data processing pipelines across PostgreSQL and MongoDB, reducing critical API response times by 40% under heavy load.',
                            'Engineered a Zero-Trust Identity and Access Management (IAM) system with granular RBAC.',
                            'Containerized infrastructure using Docker/Docker Compose, reducing environment setup and deployment time by 45%.',
                            'Pioneered GenAI tools integration (Cursor, GitHub Copilot), increasing development velocity by ~30%.',
                            'Led a cross-functional engineering team, drove architectural decisions, and mentored developers.',
                        ],
                        company: {
                            create: {
                                name: 'FlowByte Dev',
                                description:
                                    'End-to-end development of a corporate CRM/ERP system for a ventilation systems manufacturing enterprise.',
                            },
                        },
                    },
                    {
                        position: 'Independent Node.js / FullStack Developer',
                        start: new Date('2023-03-01T00:00:00.000Z'),
                        end: new Date('2024-05-31T00:00:00.000Z'),
                        achievements: [
                            'Led backend rewrite from synchronous Python (Django/FastAPI) to an asynchronous Node.js/TypeScript architecture.',
                            'Architected and implemented 15+ RESTful endpoints across 6 core modules (auth, profiles, discovery, meetings, notifications, content).',
                            'Implemented JWT-based authentication flows with secure password hashing and refresh token rotation.',
                            'Designed database schemas and implemented reusable CRUD modules for 6 core entities.',
                            'Established Git workflows, branching strategy, and basic code review processes for a 3-person team.',
                        ],
                        company: {
                            create: {
                                name: 'Degtiarov Entertainment',
                                description:
                                    'MVP of a web platform for meetings / dating. A 3-person team-based prototype project initiated for an external stakeholder.',
                            },
                        },
                    },
                ],
            },
        },
    });

    const flowByteCompany = await prisma.company.findUnique({
        where: { name: 'FlowByte Dev' },
    });

    const degtiarovCompany = await prisma.company.findUnique({
        where: { name: 'Degtiarov Entertainment' },
    });

    if (flowByteCompany) {
        await prisma.project.create({
            data: {
                name: 'Corporate CRM/ERP System',
                description:
                    'Enterprise-grade solution for a ventilation systems manufacturing enterprise. Includes real-time WebSocket messenger, granular RBAC, and optimized data processing pipelines.',
                links: ['Internal Enterprise System'],
                companyId: flowByteCompany.id,
                profileId: profile.id,
            },
        });
    }

    if (degtiarovCompany) {
        await prisma.project.create({
            data: {
                name: 'Meetings / Dating Web Platform MVP',
                description:
                    'A 3-person team-based prototype project. Node.js/TypeScript backend, React frontend, JWT auth, and modular REST API design.',
                links: ['Prototype for external stakeholder'],
                companyId: degtiarovCompany.id,
                profileId: profile.id,
            },
        });
    }

    console.log('✅ База данных успешно заполнена данными из резюме!');
}
