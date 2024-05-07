import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// import { PluralNamingStrategy } from 'src/@core/strategies/naming.strategy';

export interface DatabaseConfig {
  database: Partial<TypeOrmModuleOptions>;
}

export default (): DatabaseConfig => ({
  database: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    // url: 'postgresql://MihPar:2TDbEoVawR3Z@ep-weathered-mouse-a5h47925.us-east-2.aws.neon.tech/neondb?sslmode=require',
    autoLoadEntities: true,
    // namingStrategy: new PluralNamingStrategy(),
    // logging: ['query'],
    synchronize: true,
  },
});