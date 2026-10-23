import { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { join } from 'node:path';

export function configureGraphql(
    config: ConfigService,
): Omit<ApolloDriverConfig, 'driver'> {
    return {
        graphiql: {
            url: '/graphql',
            inputValueDeprecation: false,
            isHeadersEditorEnabled: true,
            shouldPersistHeaders: true,
        },
        autoSchemaFile: join(
            process.cwd(),
            config.getOrThrow<string>('SCHEMA_PATH'),
        ),
        autoTransformHttpErrors: true,
        sortSchema: true,
        formatError(formattedError) {
            const isProd =
                (config.get<string>('NODE_ENV') ?? 'production') ===
                'production';

            const newFormattedError = { ...formattedError };

            if (newFormattedError.extensions) {
                newFormattedError.extensions.timestamp = Date.now();
                if (isProd) {
                    delete newFormattedError.extensions.stacktrace;
                }
            }

            return newFormattedError;
        },
    };
}
