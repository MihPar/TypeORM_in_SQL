import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Device } from "../security-devices/entities/security-device.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { LikeForPost } from "./entity/likesInfo-entity";

const userCase = [
  
];

const repo = [
  
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
