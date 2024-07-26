import databaseConf, { DatabaseConfig } from './config/db.config';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DeletedModule } from './deleted/deleteAll.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityDevicesModule } from './security-devices/security-devices.module';
import { UsersModule } from './users/users.module';
import { ApiConfigService } from './config/configService';
import { ThrottlerModule } from '@nestjs/throttler';
import { PostsModule } from './posts/posts.module';
import { BlogsModule } from './blogs/blogs.module';
import { LikeForPostModule } from './likes/likesForPost.module';
import { LikeForCommentModue } from './likes/likesForComment.module';
import { BlogsForSAModule } from './blogsForSA/blogsForSA.module';
import { CommentsModule } from './comment/comments.module';
import { QuestionModule } from './question/question.module';
import { PairQuizGameProgressModule } from './pairQuizGameProgress/pairQuizGameProgress.module';
import { PairQuizGameModule } from './pairQuizGame/pairQuizGame.module';
import { BloggerModule } from './blogger/blogger.module';
import { TelegrammModule } from './telegramm/telegramm.module';

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
			return {...config.get('database', {infer: true}), synchronize: true}
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
	CommentsModule,
	QuestionModule,
	PairQuizGameModule,
	PairQuizGameProgressModule,
	BloggerModule,
	TelegrammModule
  ]
})
export class AppModule {}
