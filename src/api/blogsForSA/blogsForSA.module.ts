import { Module, UseGuards } from '@nestjs/common';
import { LogoutUseCase } from '../security-devices/useCase/logout-use-case';
import { RegistrationEmailResendingUseCase } from '../users/useCase/registrationEmailResending-use-case';
import { UpdateDeviceUseCase } from '../security-devices/useCase/updateDevice-use-case';
import { RegistrationConfirmationUseCase } from '../users/useCase/registratinConfirmation-use-case';
import { RegistrationUseCase } from '../users/useCase/registration-use-case';
import { DeviceRepository } from '../security-devices/security-device.repository';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { DeviceQueryRepository } from '../security-devices/security-deviceQuery.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { Device } from '../security-devices/entities/security-device.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { EmailAdapter } from '../../infrastructura/email/email.adapter';
import { EmailManager } from '../../infrastructura/email/email.manager';
import { ApiJwtService } from '../../infrastructura/jwt/jwt.service';
import { ApiConfigService } from '../../infrastructura/config/configService';
import { CheckRefreshTokenFor } from '../auth/useCase.ts/bearer.authForComments';
import { CheckRefreshToken } from '../auth/guards/checkRefreshToken';
import { IsExistEmailUser } from '../auth/guards/isExixtEmailUser';
import { CheckLoginOrEmail } from '../auth/guards/checkEmailOrLogin';
import { RecoveryPasswordUseCase } from '../auth/useCase.ts/recoveryPassowrdUseCase';
import { NewPasswordUseCase } from '../auth/useCase.ts/createNewPassword-use-case';
import { CreateLoginUseCase } from '../auth/useCase.ts/createLogin-use-case';
import { CreateDeviceUseCase } from '../auth/useCase.ts/createDevice-use-case';
import { RefreshTokenUseCase } from '../auth/useCase.ts/refreshToken-use-case';
import { GetUserIdByTokenUseCase } from '../auth/useCase.ts/getUserIdByToken-use-case';
import { PayloadAdapter } from '../auth/adapter/payload.adapter';
import { GenerateHashAdapter } from '../auth/adapter/generateHashAdapter';
import { AuthRepository } from '../auth/auth.repository';
import { CustomLoginvalidation } from '../auth/adapter/customLoginValidator';
import { CustomEmailvalidation } from '../auth/adapter/customEmailValidatro';
import { BlogsControllerForSA } from './blogsForSA.controller';
import { BlogsQueryRepositoryForSA } from './blogsForSA.queryReposity';
import { PostsQueryRepository } from '../posts/postQuery.repository';
import { BlogsRepositoryForSA } from './blogsForSA.repository';
import { PostsRepository } from '../posts/posts.repository';
import { CheckRefreshTokenForSA } from './guards/bearer.authGetComment';
import { UpdateBlogForSAUseCase } from './use-case/updateBlog-use-case';
import { DeleteBlogByIdForSAUseCase } from './use-case/deleteBlogById-use-case';
import { CreateNewBlogForSAUseCase } from './use-case/createNewBlog-use-case';
import { CreateNewPostForBlogUseCase } from './use-case/createNewPostForBlog-use-case';
import { LikesRepository } from '../likes/likes.repository';
import { UpdateExistingPostByIdWithBlogIdUseCase } from './use-case/updatePostByIdWithBlogId-use-case';
import { DeletePostByIdCommandUseCase } from './use-case/deletPostById-use-case';
import { Posts } from '../posts/entity/entity.posts';
import { LikeForComment } from '../likes/entity/likesForComment.entity';
import { LikeForPost } from '../likes/entity/likesForPost.entity';
import { BlogsRepository } from '../blogs/blogs.repository';
import { Blogs } from '../blogs/entity/blogs.entity';
import { Comments } from '../comment/entity/comment.entity';

const guards = [
	CheckRefreshTokenForSA
];

const useCase = [
	UpdateBlogForSAUseCase,
	DeleteBlogByIdForSAUseCase,
	CreateNewBlogForSAUseCase,
	CreateNewPostForBlogUseCase,
	UpdateExistingPostByIdWithBlogIdUseCase,
	DeletePostByIdCommandUseCase
];

const adapter = [];

const repo = [
	LikesRepository,
	BlogsRepositoryForSA,
	BlogsQueryRepositoryForSA,
	PostsRepository,
	UsersQueryRepository,
	BlogsRepository,
	PostsQueryRepository,
];

const manager = [];

const service = [JwtService];
const validator = [CustomLoginvalidation, CustomEmailvalidation]

@Module({
  imports: [TypeOrmModule.forFeature([Device, User, Posts, LikeForComment, LikeForPost, Blogs, Comments]), CqrsModule],
  controllers: [BlogsControllerForSA],
  providers: [
    ...useCase,
    ...guards,
    ...adapter,
    ...repo,
    ...manager,
    ...service,
	...validator
  ],
})
export class BlogsForSAModule {}
