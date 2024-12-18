import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthBasic } from './gards/basic.auth';
import { DeleteUserByIdCommand } from './useCase/deleteUserById-use-case';
import { InputDataReqClass } from '../auth/dto/auth.class.pipe';
import { CreateNewUserCommand } from './useCase/createNewUser-use-case';
import { BanInputModel, DtoType } from './user.class';
import { UsersQueryRepository } from './users.queryRepository';
import { HttpExceptionFilter } from '../exeption/exceptionFilter';
import { UserBanViewType } from './user.type';
import { BanUnbanUserCommand } from './useCase/banUnbanUser-use-case';
import { PaginationType } from '../types/pagination.types';
import { GetAllUsersCommand } from './useCase/getAllUsers-use-case';
import { GetBannedUsersCommand } from './useCase/getBannedUsers-use-case';

// @SkipThrottle()
@UseGuards(AuthBasic)
@Controller('sa/users')
export class UsersController {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected commandBus: CommandBus,
  ) {}

  @Put(':id/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  async banUnbanUser(
    @Param('id') id: string,
    @Body() banInputInfo: BanInputModel,
  ) {
    const command = new BanUnbanUserCommand(id, banInputInfo);
    await this.commandBus.execute<BanUnbanUserCommand, void>(command);
    return;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Query('banStatus')
    banStatus: 'all' | 'banned' | 'notBanned',
    @Query('searchLoginTerm') searchLoginTerm: string | null,
    @Query('searchEmailTerm') searchEmailTerm: string | null,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageSize') pageSize: string,
    @Query('pageNumber') pageNumber: string,
  ): Promise<PaginationType<UserBanViewType>> {
    if (!banStatus) {
      banStatus = 'all';
    }
    if (banStatus === 'banned') {
      banStatus = 'banned';
    }
    if (banStatus === 'notBanned') {
      banStatus = 'notBanned';
    }

    if (!searchLoginTerm) {
      searchLoginTerm = null;
    }

    if (!searchEmailTerm) {
      searchEmailTerm = null;
    }

    if (!sortBy) {
      sortBy = 'createdAt';
    }
    if (sortBy === 'login') {
      sortBy = 'login';
    }
    if (sortBy === 'email') {
      sortBy = 'email';
    }

    if (!sortDirection || sortDirection.toLowerCase() !== 'asc') {
      sortDirection = 'desc';
    }

    const checkPageSize = +pageSize;
    if (!pageSize || !Number.isInteger(checkPageSize) || checkPageSize <= 0) {
      pageSize = '10';
    }

    const checkPageNumber = +pageNumber;
    if (
      !pageNumber ||
      !Number.isInteger(checkPageNumber) ||
      checkPageNumber <= 0
    ) {
      pageNumber = '1';
    }

    if (banStatus === 'all') {
      return await this.commandBus.execute(
        new GetAllUsersCommand(
          searchLoginTerm,
          searchEmailTerm,
          sortBy,
          sortDirection,
          pageSize,
          pageNumber,
        ),
      );
    } else if (banStatus === ('banned' || 'notBanned')) {
      return await this.commandBus.execute(
        new GetBannedUsersCommand(
          banStatus,
          searchLoginTerm,
          searchEmailTerm,
          sortBy,
          sortDirection,
          pageSize,
          pageNumber,
        ),
      );
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseFilters(new HttpExceptionFilter())
  async createUser(
    // возможна ошибка с тестами икубатора когда у нас неправильные несколько полей
    @Body() inputDataReq: InputDataReqClass,
  ) {
    const { login, password, email } = inputDataReq;
    const command = new CreateNewUserCommand(login, password, email);
    const createdUser = await this.commandBus.execute<
      CreateNewUserCommand,
      UserBanViewType | null
    >(command);
    if (!createdUser) throw new BadRequestException('400');
    return createdUser;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserById(@Param() dto: DtoType) {
    if (!dto.id) throw new NotFoundException('Blogs by id not found 404');
    const command = new DeleteUserByIdCommand(dto.id);
    const isDeletedUser = await this.commandBus.execute<
      DeleteUserByIdCommand,
      boolean
    >(command);
    if (!isDeletedUser)
      throw new NotFoundException('Blogs by id not found 404');
    return isDeletedUser;
  }
}
