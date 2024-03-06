import { LikeForComment } from './entity/likesForComment-entity';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Device } from "../security-devices/entities/security-device.entity";
import { CqrsModule } from "@nestjs/cqrs";

const userCase = [
  
];

const repo = [
  
];

const adapter = [];
const manager = [];
const service = [];

@Module({
  imports: [TypeOrmModule.forFeature([User, Device, LikeForComment]), CqrsModule],
  controllers: [],
  providers: [...userCase, ...repo, ...adapter, ...manager, ...service],
})
export class 	LikeForCommentModue{}
