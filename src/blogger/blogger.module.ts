import { Module } from '@nestjs/common';
import { BloggerController } from './api/blogger.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateBlogBloggerForSAUseCase } from './use-case/updataBlogByIdBlogger-use-case';
import { DeleteBlogByIdBloggerForSAUseCase } from './use-case/deleteBlogBlogger-use-case';
import { CreateNewPostForBlogBloggerUseCase } from './use-case/createNewPostByBlogIdBlogger-use-case';
import { BlogsRepositoryForSA } from '../blogsForSA/blogsForSA.repository';
import { Blogs } from '../blogs/entity/blogs.entity';
import { BlogsQueryRepositoryForSA } from '../blogsForSA/blogsForSA.queryReposity';
import { PostsRepository } from '../posts/posts.repository';
import { LikesRepository } from '../likes/likes.repository';
import { UsersRepository } from '../users/users.repository';
import { User } from '../users/entities/user.entity';
import { LikeForComment } from '../likes/entity/likesForComment.entity';
import { LikeForPost } from '../likes/entity/likesForPost.entity';
import { Posts } from '../posts/entity/entity.posts';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { JwtService } from '@nestjs/jwt';
import { PostsQueryRepository } from '../posts/postQuery.repository';
import { Comments } from '../comment/entity/comment.entity';
import { UpdateExistingPostByIdWithBlogIdBloggerUseCase } from './use-case/updatePostByBlogIdBlogger-use-case';
import { UpdateUserDataUseCase } from './use-case/updateUserDate-use-case';
import { FindBannedUserSpecifyBloggerUserCase } from './use-case/getBannedUserSpecifyBlogger-use-case';
import { BlogsRepository } from '../blogs/blogs.repository';
import { UserBlogger } from './domain/entity.userBlogger';
import { DeleteUserBloggerUseCase } from './use-case/deleteUserBlogger-use-case';
import { BlogsQueryRepository } from '../blogs/blogs.queryReposity';
import { FileStorageAdapterUseCase } from './use-case/fileStorageAdapter-use-case';
import { CreateFileUseCase } from './use-case/createFile-use-case';

const useCase = [UpdateBlogBloggerForSAUseCase, DeleteBlogByIdBloggerForSAUseCase, CreateNewPostForBlogBloggerUseCase, BlogsRepositoryForSA, BlogsQueryRepositoryForSA, PostsRepository, LikesRepository, UsersRepository, UsersQueryRepository, PostsQueryRepository, UpdateExistingPostByIdWithBlogIdBloggerUseCase, UpdateUserDataUseCase, FindBannedUserSpecifyBloggerUserCase, DeleteUserBloggerUseCase, FileStorageAdapterUseCase, CreateFileUseCase
]

const service = [JwtService];
const repo = [BlogsRepository, BlogsQueryRepository]

@Module({
	imports: [TypeOrmModule.forFeature([Blogs, User, LikeForComment, LikeForPost, Posts, Comments, UserBlogger]), CqrsModule],
	controllers: [BloggerController],
	providers: [...useCase, ...service, ...repo],
})
export class BloggerModule { }
