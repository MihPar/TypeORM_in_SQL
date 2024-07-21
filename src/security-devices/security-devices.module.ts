import { Module } from '@nestjs/common';
import { SecurityDeviceController } from './security-device.controller';
import { DeleteAllDevicesUseCase } from './useCase/deleteAllDevices-use-case';
import { LogoutUseCase } from './useCase/logout-use-case';
import { TerminateAllCurrentSessionUseCase } from './useCase/terminateAllCurrentSeccion-use-case';
import { UpdateDeviceUseCase } from './useCase/updateDevice-use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/security-device.entity';
import { DeviceRepository } from './security-device.repository';
import { DeviceQueryRepository } from './security-deviceQuery.repository';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { CheckRefreshToken } from '../auth/guards/checkRefreshToken';
import { ForbiddenCalss } from './gards/forbidden';
import { PayloadAdapter } from '../auth/adapter/payload.adapter';
import { JwtService } from '@nestjs/jwt';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { UsersRepository } from '../users/users.repository';
import { User } from '../users/entities/user.entity';
import { BlogsRepository } from '../blogs/blogs.repository';
import { Blogs } from '../blogs/entity/blogs.entity';
import { UserBlogger } from '../blogger/domain/entity.userBlogger';
import { Images } from '../blogs/entity/images.entity';

const useCase = [
  DeleteAllDevicesUseCase,
  LogoutUseCase,
  TerminateAllCurrentSessionUseCase,
  UpdateDeviceUseCase,
];

const guard = [CheckRefreshToken, ForbiddenCalss]

const repo = [DeviceRepository, DeviceQueryRepository, UsersQueryRepository, UsersRepository, UsersRepository, BlogsRepository];

const adapter = [PayloadAdapter]
const service = [JwtService]

@Module({
  imports: [TypeOrmModule.forFeature([Device, User, Blogs, UserBlogger, Images]), CqrsModule],
  controllers: [SecurityDeviceController],
  providers: [...useCase, ...repo, ...guard, ...adapter, ...service],
})
export class SecurityDevicesModule {}
