import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "./entity/entity-posts";
import { User } from "../users/entities/user.entity";
import { Device } from "../security-devices/entities/security-device.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { DeleteAllPostsUseCase } from "./use-case/deleteAllPosts-use-case";
import { PostsRepository } from "./posts.repository";

const userCase = [
	DeleteAllPostsUseCase
];

const repo = [
	PostsRepository
];

const adapter = [];
const manager = [];
const service = [];

@Module({
  imports: [TypeOrmModule.forFeature([Posts, User, Device]), CqrsModule],
  controllers: [],
  providers: [...userCase, ...repo, ...adapter, ...manager, ...service],
})
export class PostsModule {}
