import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { seedDatabase } from './seed';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const prismaService = app.get(PrismaService);

    seedDatabase(prismaService)
        .catch((e) => {
            console.error('❌ Ошибка при сидировании базы данных:', e);
            process.exit(1);
        })
        .finally(async () => {
            await prismaService.$disconnect();
        });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
