import { Module, Post } from '@nestjs/common';
import { BloggerService } from './blogger.service';
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
import { Like } from 'typeorm';
import { LikeForComment } from '../likes/entity/likesForComment.entity';
import { LikeForPost } from '../likes/entity/likesForPost.entity';
import { Posts } from '../posts/entity/entity.posts';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { JwtService } from '@nestjs/jwt';
import { PostsQueryRepository } from '../posts/postQuery.repository';
import { Comments } from '../comment/entity/comment.entity';
import { UpdateExistingPostByIdWithBlogIdBloggerUseCase } from './use-case/updatePostByBlogIdBlogger-use-case';

const useCase = [UpdateBlogBloggerForSAUseCase, DeleteBlogByIdBloggerForSAUseCase, CreateNewPostForBlogBloggerUseCase, BlogsRepositoryForSA, BlogsQueryRepositoryForSA, PostsRepository, LikesRepository, UsersRepository, UsersQueryRepository, PostsQueryRepository, UpdateExistingPostByIdWithBlogIdBloggerUseCase
]

const service = [JwtService];

@Module({
	imports: [TypeOrmModule.forFeature([Blogs, User, LikeForComment, LikeForPost, Posts, Comments]), CqrsModule],
	controllers: [BloggerController],
	providers: [...useCase, ...service],
})
export class BloggerModule { }
