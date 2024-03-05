import databaseConf, { DatabaseConfig } from './infrastructura/config/db.config';
import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { TestingModule } from './api/deleted/deleteAll.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityDevicesModule } from './api/security-devices/security-devices.module';
import { UsersModule } from './api/users/users.module';
import { ApiConfigService } from './infrastructura/config/configService';
import { ThrottlerModule } from '@nestjs/throttler';
import { PostsModule } from './api/posts/posts.module';
import { BlogsModule } from './api/blogs/blogs.module';
import { LikeForPostModule } from './api/likes/likesInfo.module';

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
	PostsModule,
	BlogsModule,
	LikeForPostModule,
  ]
})
export class AppModule {}
