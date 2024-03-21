import databaseConf, { DatabaseConfig } from './infrastructura/config/db.config';
import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { DeletedModule } from './api/deleted/deleteAll.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityDevicesModule } from './api/security-devices/security-devices.module';
import { UsersModule } from './api/users/users.module';
import { ApiConfigService } from './infrastructura/config/configService';
import { ThrottlerModule } from '@nestjs/throttler';
import { PostsModule } from './api/posts/posts.module';
import { BlogsModule } from './api/blogs/blogs.module';
import { LikeForPostModule } from './api/likes/likesForPost.module';
import { LikeForCommentModue } from './api/likes/likesForComment.module';
import { BlogsForSAModule } from './api/blogsForSA/blogsForSA.module';
import { CommentsModule } from './api/comment/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
	  load: [databaseConf]
    }),
	// ThrottlerModule.forRoot([{
	// 	ttl: 10000,
	// 	limit: 5,
	//   }]),
	TypeOrmModule.forRootAsync({
		useFactory(config: ConfigService<DatabaseConfig>) {
			return config.get('database', {infer: true})
		},
		inject: [
			ConfigService,
		]
	}),
	SecurityDevicesModule,
	AuthModule,
	DeletedModule,
	UsersModule,
	PostsModule,
	BlogsModule,
	LikeForPostModule,
	LikeForCommentModue,
	BlogsForSAModule,
	CommentsModule
  ]
})
export class AppModule {}
