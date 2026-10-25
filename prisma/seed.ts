import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { Pool } from 'pg';

const profileName = 'Ivan Konovalov';

export async function seedDatabase(prisma: PrismaClient) {
    const flowByte = await prisma.company.upsert({
        where: { name: 'FlowByte Dev' },
        update: {
            description:
                'End-to-end development of a corporate CRM/ERP system for a ventilation systems manufacturing enterprise.',
        },
        create: {
            name: 'FlowByte Dev',
            description:
                'End-to-end development of a corporate CRM/ERP system for a ventilation systems manufacturing enterprise.',
        },
    });

    const degtiarov = await prisma.company.upsert({
        where: { name: 'Degtiarov Entertainment' },
        update: {
            description:
                'MVP of a web platform for meetings and dating developed for an external stakeholder.',
        },
        create: {
            name: 'Degtiarov Entertainment',
            description:
                'MVP of a web platform for meetings and dating developed for an external stakeholder.',
        },
    });

    await prisma.profile.upsert({
        where: { name: profileName },
        update: {
            description: profileDescription,
            links: profileLinks,
            skills,
            experiences: {
                deleteMany: {},
                create: experiences(flowByte.id, degtiarov.id),
            },
            projects: {
                deleteMany: {},
                create: projects(flowByte.id, degtiarov.id),
            },
        },
        create: {
            name: profileName,
            description: profileDescription,
            links: profileLinks,
            skills,
            experiences: {
                create: experiences(flowByte.id, degtiarov.id),
            },
            projects: {
                create: projects(flowByte.id, degtiarov.id),
            },
        },
    });
}

const profileDescription =
    'Backend-focused Fullstack Developer (Node.js/TypeScript/NestJS) with 3+ years of experience building scalable enterprise applications and robust APIs.';

const profileLinks = [
    'konovalovivan2005@gmail.com',
    'https://linkedin.com/in/ivan-konovalov-backend',
    'https://github.com/Navi-Friend',
];

const skills = [
    'TypeScript',
    'Node.js',
    'NestJS',
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
];

function experiences(flowByteCompanyId: number, degtiarovCompanyId: number) {
    return [
        {
            position: 'FullStack Developer / Team Lead',
            start: new Date('2024-05-01T00:00:00.000Z'),
            end: new Date('2026-06-30T00:00:00.000Z'),
            achievements: [
                'Architected and scaled backend infrastructure into a distributed microservices architecture.',
                'Designed data processing pipelines across PostgreSQL and MongoDB, reducing API response times by 40%.',
                'Engineered a Zero-Trust IAM system with granular RBAC.',
                'Containerized infrastructure with Docker and Docker Compose.',
                'Led a cross-functional engineering team and mentored developers.',
            ],
            company: { connect: { id: flowByteCompanyId } },
        },
        {
            position: 'Independent Node.js / FullStack Developer',
            start: new Date('2023-03-01T00:00:00.000Z'),
            end: new Date('2024-05-31T00:00:00.000Z'),
            achievements: [
                'Led a backend rewrite from Django/FastAPI to Node.js and TypeScript.',
                'Architected and implemented 15+ RESTful endpoints across six core modules.',
                'Implemented JWT authentication with secure password hashing and refresh token rotation.',
                'Designed database schemas and reusable CRUD modules.',
                'Established Git workflows and code review processes for a three-person team.',
            ],
            company: { connect: { id: degtiarovCompanyId } },
        },
    ];
}

function projects(flowByteCompanyId: number, degtiarovCompanyId: number) {
    return [
        {
            name: 'Corporate CRM/ERP System',
            description:
                'Enterprise-grade solution with a real-time WebSocket messenger, granular RBAC, and optimized data processing.',
            link: 'https://erp.fercstroy.com/',
            company: { connect: { id: flowByteCompanyId } },
        },
        {
            name: 'Web site for the transfer company',
            description:
                'Node.js/TypeScript backend, React frontend, JWT authentication, and modular REST API design.',
            link: 'https://transfer24.by/',
            company: { connect: { id: flowByteCompanyId } },
        },
        {
            name: 'Meetings / Dating Web Platform MVP',
            description:
                'MVP of the meeting / dating platofrm. The idea was around a real "Bench of love" that will connect application experience and real meeting.',
            link: 'https://github.com/yatskeech/bench-of-love',
            company: { connect: { id: degtiarovCompanyId } },
        },
    ];
}

async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

    try {
        await seedDatabase(prisma);
        console.log('Database seed completed successfully.');
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main().catch((error: unknown) => {
    console.error('Database seed failed', error);
    process.exitCode = 1;
});
