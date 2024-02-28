import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateNewUserUseCase } from './useCase/createNewUser-use-case';
import { DeleteAllUsersUseCase } from './useCase/deleteAllUsers-use-case';
import { DeleteUserByIdUseCase } from './useCase/deleteUserById-use-case';
import { RegistrationConfirmationUseCase } from './useCase/registratinConfirmation-use-case';
import { RegistrationUseCase } from './useCase/registration-use-case';
import { RegistrationEmailResendingUseCase } from './useCase/registrationEmailResending-use-case';
import { Device } from '../security-devices/entities/security-device.entity';
import { UsersRepository } from './users.repository';
import { UsersQueryRepository } from './users.queryRepository';
import { CommandBus } from '@nestjs/cqrs';
import { PayloadAdapter } from '../auth/adapter/payload.adapter';
import { GenerateHashAdapter } from '../auth/adapter/generateHashAdapter';
import { EmailManager } from 'src/infrastructura/email/email.manager';
import { JwtService } from '@nestjs/jwt';
import { EmailAdapter } from 'src/infrastructura/email/email.adapter';

const userCase = [
  CreateNewUserUseCase,
  DeleteAllUsersUseCase,
  DeleteUserByIdUseCase,
  RegistrationConfirmationUseCase,
  RegistrationUseCase,
  RegistrationEmailResendingUseCase
];

const repo = [
  UsersRepository,
  UsersQueryRepository,
  CommandBus,
  PayloadAdapter,
];

const adapter = [GenerateHashAdapter, EmailAdapter];
const manager = [EmailManager];
const service = [JwtService];

@Module({
  imports: [TypeOrmModule.forFeature([User, Device])],
  controllers: [UsersController],
  providers: [...userCase, ...repo, ...adapter, ...manager, ...service],
})
export class UsersModule {}
