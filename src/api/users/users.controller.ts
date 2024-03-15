import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Query, UseFilters, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthBasic } from './gards/basic.auth';
import { DeleteUserByIdCommand } from './useCase/deleteUserById-use-case';
import { InputDataReqClass } from '../auth/dto/auth.class.pipe';
import { RegistrationCommand } from './useCase/registration-use-case';
import { CreateNewUserCommand } from './useCase/createNewUser-use-case';
import { DtoType } from './user.class';
import { SkipThrottle } from '@nestjs/throttler';
import { UsersQueryRepository } from './users.queryRepository';
import { HttpExceptionFilter } from '../../infrastructura/exceptionFilters.ts/exceptionFilter';
import { UserViewType } from './user.type';

// @SkipThrottle()
@UseGuards(AuthBasic)
@Controller('sa/users')
export class UsersController {
  constructor(
	protected usersQueryRepository: UsersQueryRepository,
	protected commandBus: CommandBus
	) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Query()
    query: {
      sortBy: string;
      sortDirection: string;
      pageNumber: string;
      pageSize: string;
      searchLoginTerm: string;
      searchEmailTerm: string;
    },
  ) {
		query.sortBy = query.sortBy || 'createdAt'
		query.sortDirection = query.sortDirection || "desc"
		query.pageNumber = query.pageNumber || '1'
		query.pageSize = query.pageSize || "10"
		query.searchLoginTerm = query.searchLoginTerm || ''
		query.searchEmailTerm = query.searchEmailTerm || ''
		
    const users = await this.usersQueryRepository.getAllUsers(
		query.sortBy,
		query.sortDirection,
		query.pageNumber,
		query.pageSize,
		query.searchLoginTerm,
		query.searchEmailTerm
    );

	return users
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseFilters(new HttpExceptionFilter())
  async createUser(@Body() inputDataReq: InputDataReqClass) {
	const command = new CreateNewUserCommand(inputDataReq)
	const createdUser = await this.commandBus.execute<CreateNewUserCommand, UserViewType | null>(command)
	if(!createdUser) throw new BadRequestException("400")
	return createdUser
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserById(@Param() dto: DtoType) {
	if(!dto.id) throw new NotFoundException("Blogs by id not found 404")
	const command = new DeleteUserByIdCommand(dto.id)
	const isDeletedUser = await this.commandBus.execute<DeleteUserByIdCommand, boolean>(command)
	if (!isDeletedUser) throw new NotFoundException("Blogs by id not found 404")
	return isDeletedUser
  }
}
