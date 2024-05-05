import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// import { PluralNamingStrategy } from 'src/@core/strategies/naming.strategy';

export interface DatabaseConfig {
  database: Partial<TypeOrmModuleOptions>;
}

export default (): DatabaseConfig => ({
  database: {
    type: 'postgres',
	host: "localhost",
    port: 5432,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: "BankSystem",
    autoLoadEntities: true,
    // url: process.env.DATABASE_URL,
    // autoLoadEntities: true,
    // namingStrategy: new PluralNamingStrategy(),
    // logging: ['query'],
    synchronize: true,
  },
});