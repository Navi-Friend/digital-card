import { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { GraphQLFormattedError } from 'graphql';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { createProfileLoaders } from '../profile/profile.loaders';

export function configureGraphql(
    config: ConfigService,
    prismaService: PrismaService,
): Omit<ApolloDriverConfig, 'driver'> {
    return {
        graphiql: false,
        plugins: [
            ApolloServerPluginLandingPageLocalDefault() as NonNullable<
                ApolloDriverConfig['plugins']
            >[number],
        ],
        autoSchemaFile: join(
            process.cwd(),
            config.getOrThrow<string>('SCHEMA_PATH'),
        ),
        autoTransformHttpErrors: true,
        sortSchema: true,
        introspection: true,
        context: () => ({
            loaders: createProfileLoaders(prismaService),
        }),
        formatError: (formattedError) => formatGQLError(formattedError, config),
    };
}

function formatGQLError(
    formattedError: GraphQLFormattedError,
    config: ConfigService,
) {
    const isProd =
        (config.get<string>('NODE_ENV') ?? 'production') === 'production';

    const newFormattedError = { ...formattedError };

    if (newFormattedError.extensions) {
        newFormattedError.extensions.timestamp = Date.now();
        if (isProd) {
            delete newFormattedError.extensions.stacktrace;
        }
    }

    return newFormattedError;
}
