import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Device } from "../security-devices/entities/security-device.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { LikeForPost } from "./entity/likesForPost-entity";
import { UpdateLikeStatusForPostUseCase } from "../posts/use-case/updateLikeStatus-use-case";
import { LikesRepository } from "./likes.repository";
import { PostsRepository } from "../posts/posts.repository";
import { PostsQueryRepository } from "../posts/postQuery.repository";

const userCase = [
	UpdateLikeStatusForPostUseCase
];

const repo = [
	LikesRepository,
	PostsRepository,
	PostsQueryRepository
];

const adapter = [];
const manager = [];
const service = [];

@Module({
  imports: [TypeOrmModule.forFeature([LikeForPost, User, Device]), CqrsModule],
  controllers: [],
  providers: [...userCase, ...repo, ...adapter, ...manager, ...service],
})
export class LikeForPostModule {}
