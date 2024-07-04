import { Module, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CheckRefreshTokenFor } from './useCase.ts/bearer.authForComments';
import { LogoutUseCase } from '../security-devices/useCase/logout-use-case';
import { RegistrationEmailResendingUseCase } from '../users/useCase/registrationEmailResending-use-case';
import { RecoveryPasswordUseCase } from './useCase.ts/recoveryPassowrdUseCase';
import { NewPasswordUseCase } from './useCase.ts/createNewPassword-use-case';
import { CreateLoginUseCase } from './useCase.ts/createLogin-use-case';
import { CreateDeviceUseCase } from './useCase.ts/createDevice-use-case';
import { CheckRefreshToken } from './guards/checkRefreshToken';
import { RefreshTokenUseCase } from './useCase.ts/refreshToken-use-case';
import { UpdateDeviceUseCase } from '../security-devices/useCase/updateDevice-use-case';
import { RegistrationConfirmationUseCase } from '../users/useCase/registratinConfirmation-use-case';
import { RegistrationUseCase } from '../users/useCase/registration-use-case';
import { IsExistEmailUser } from './guards/isExixtEmailUser';
import { GetUserIdByTokenUseCase } from './useCase.ts/getUserIdByToken-use-case';
import { PayloadAdapter } from './adapter/payload.adapter';
import { DeviceRepository } from '../security-devices/security-device.repository';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { UsersRepository } from '../users/users.repository';
import { GenerateHashAdapter } from './adapter/generateHashAdapter';
import { JwtService } from '@nestjs/jwt';
import { DeviceQueryRepository } from '../security-devices/security-deviceQuery.repository';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { AuthRepository } from './auth.repository';
import { CheckLoginOrEmail } from './guards/checkEmailOrLogin';
import { Device } from '../security-devices/entities/security-device.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CustomLoginvalidation } from './adapter/customLoginValidator';
import { CustomEmailvalidation } from './adapter/customEmailValidatro';
import { EmailAdapter } from './adapter/email.adapter';
import { EmailManager } from './adapter/email.manager';
import { ApiJwtService } from './adapter/jwt/jwt.service';
import { ApiConfigService } from '../config/configService';
import { Blogs } from '../blogs/entity/blogs.entity';
import { UserBlogger } from '../blogger/domain/entity.userBlogger';

const guards = [
  CheckRefreshTokenFor,
  CheckRefreshToken,
  IsExistEmailUser,
  CheckLoginOrEmail
];

const useCase = [
  LogoutUseCase,
  RegistrationEmailResendingUseCase,
  RecoveryPasswordUseCase,
  NewPasswordUseCase,
  CreateLoginUseCase,
  CreateDeviceUseCase,
  RefreshTokenUseCase,
  UpdateDeviceUseCase,
  RegistrationConfirmationUseCase,
  RegistrationUseCase,
  GetUserIdByTokenUseCase,
];

const adapter = [PayloadAdapter, GenerateHashAdapter, EmailAdapter];

const repo = [
  DeviceRepository,
  UsersQueryRepository,
  DeviceQueryRepository,
  AuthRepository,
  UsersRepository,
];

const manager = [EmailManager];

const service = [JwtService, ApiJwtService, ApiConfigService];
const validator = [CustomLoginvalidation, CustomEmailvalidation]

@Module({
  imports: [TypeOrmModule.forFeature([Device, User, Blogs, UserBlogger]), CqrsModule],
  controllers: [AuthController],
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
export class AuthModule {}
