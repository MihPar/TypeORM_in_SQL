import databaseConf, { DatabaseConfig } from './infrastructura/config/db.config';
import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { TestingModule } from './api/testing/testing.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityDevicesModule } from './api/security-devices/security-devices.module';
import { UsersModule } from './api/users/users.module';
import { ApiConfigService } from './infrastructura/config/configService';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
	  load: [databaseConf]
    }),
	ThrottlerModule.forRoot([{
		ttl: 10000,
		limit: 5,
	  }]),
	TypeOrmModule.forRootAsync({
		useFactory(
			config: ConfigService<DatabaseConfig>,
			) {
			return config.get('database', {
				infer: true
			})
		},
		inject: [
			ConfigService,
		]
	}),
	SecurityDevicesModule,
	AuthModule,
	TestingModule,
	UsersModule,
  ]
})
export class AppModule {}
