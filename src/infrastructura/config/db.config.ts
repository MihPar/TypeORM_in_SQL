import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// import { PluralNamingStrategy } from 'src/@core/strategies/naming.strategy';

export interface DatabaseConfig {
  database: Partial<TypeOrmModuleOptions>;
}

export default (): DatabaseConfig => ({
  database: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    autoLoadEntities: true,
    // namingStrategy: new PluralNamingStrategy(),
    // logging: ['query'],
    synchronize: false,
  },
});