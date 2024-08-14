import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { TelegramAdapter } from './adapter/telegram.adapter';
import { TelegramController } from './api/telegramm.controler';
import { HandleTelegramUseCase } from './use-case/commandBus/handleTelegram.use-case';
import { HowManyTimeUseCase } from './use-case/commandBus/howManyTime.use-case';
import { GetAuthBotLinkUseCase } from './use-case/queryBus/getAuthBotLink-use-case';
import { CreateCodeUseCase } from './use-case/commandBus/createCode.use-case';
import { Telegramm } from './entity/telegram.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { User } from '../users/entities/user.entity';
import { BlogsRepository } from '../blogs/blogs.repository';
import { Blogs } from '../blogs/entity/blogs.entity';
import { UserBlogger } from '../blogger/entity/entity.userBlogger';
import { Wallpaper } from '../blogs/entity/wallpaper.entity';
import { Main } from '../blogs/entity/main.entity';
import { UsersRepository } from '../users/users.repository';
import { BearerTokenPairQuizGame } from '../pairQuizGame/guards/bearerTokenPairQuizGame';


const commandUserCase = [HandleTelegramUseCase, HowManyTimeUseCase, CreateCodeUseCase];
const queryUseCase = [GetAuthBotLinkUseCase]

const repo = [UsersQueryRepository, BlogsRepository, UsersRepository];

const useGuard = [BearerTokenPairQuizGame];

const adapter = [TelegramAdapter];
const manager = [];
const service = [JwtService];

@Module({
  imports: [TypeOrmModule.forFeature([Telegramm, User, Blogs, UserBlogger, Wallpaper, Main]), CqrsModule],
  controllers: [TelegramController],
  providers: [...adapter, ...commandUserCase, ...queryUseCase, ...service, ...repo],
})
export class TelegrammModule {}
