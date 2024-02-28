import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { TestingModule } from './api/testing/testing.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SecurityDevicesModule } from './api/security-devices/security-devices.module';
import { UsersModule } from './api/users/users.module';

// export const options: TypeOrmModuleOptions = {
// 	type: "postgres",
// 	host: "localhost",
// 	port: 5432,
// 	username: process.env.USERNAME,
// 	password: process.env.PASSWORD,
// 	database: "homeWordTypeORM_SQL",
// 	autoLoadEntities: true,
// 	synchronize: true,
// } 

@Module({
  imports: [
	CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
	// ThrottlerModule.forRoot([{
	// 	ttl: 10000,
	// 	limit: 5,
	//   }]),
	TypeOrmModule.forRoot({
		type: "postgres",
		host: "localhost",
		port: 5432,
		username: process.env.USERNAME,
		password: process.env.PASSWORD,
		database: "homeWordTypeORM_SQL",
		autoLoadEntities: true,
		synchronize: true,
	} 
	),
	SecurityDevicesModule,
	AuthModule,
	TestingModule,
	UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
