import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Query, UseFilters, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthBasic } from './gards/basic.auth';
import { DeleteUserByIdCommand } from './useCase/deleteUserById-use-case';
import { InputDataReqClass } from '../auth/dto/auth.class.pipe';
import { RegistrationCommand } from './useCase/registration-use-case';
import { CreateNewUserCommand } from './useCase/createNewUser-use-case';
import { BanInputModel, DtoType, EmailDto, LoginDto, PasswordDto } from './user.class';
import { SkipThrottle } from '@nestjs/throttler';
import { UsersQueryRepository } from './users.queryRepository';
import { HttpExceptionFilter } from '../exeption/exceptionFilter';
import { UserBanViewType, UserViewType } from './user.type';
import { BanUnbanUserCommand } from './useCase/banUnbanUser-use-case';
import { UserIdDecorator } from './infrastructure/decorators/decorator.user';
import { BanStatus } from './enum';
import { PaginationType } from '../types/pagination.types';
import { GetAllUsersCommand } from './useCase/getAllUsers-use-case';
import { GetBannedUsersCommand } from './useCase/getBannedUsers-use-case';

// @SkipThrottle()
@UseGuards(AuthBasic)
@Controller('sa/users')
export class UsersController {
  constructor(
	protected usersQueryRepository: UsersQueryRepository,
	protected commandBus: CommandBus
	) {}

@Put(':id/ban')
@HttpCode(HttpStatus.NO_CONTENT)
async banUnbanUser(
	@Param('id') id: string,
	@Body() banInputInfo: BanInputModel,
) {
	const command = new BanUnbanUserCommand(id, banInputInfo)
	await this.commandBus.execute<BanUnbanUserCommand, void >(command)
	return
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
    // @Query()
    // query: {
	//   banStatus: BanStatus;
    //   sortBy: string;
    //   sortDirection: string;
    //   pageNumber: string;
    //   pageSize: string;
    //   searchLoginTerm: string;
    //   searchEmailTerm: string;
    // },
  ):  Promise<PaginationType<UserBanViewType>> {
	console.log('try')
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
		// console.log(banStatus, 'status controller all ');
		return await this.commandBus.execute(
		  new GetAllUsersCommand(
			searchLoginTerm,
			searchEmailTerm,
			sortBy,
			sortDirection,
			pageSize,
			pageNumber,
		  ),
		)
	  } else  if(banStatus === ('banned' || 'notBanned')) {
		// console.log(banStatus, 'status controller not all');
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
		)
	}
	// 	query.banStatus = query.banStatus || BanStatus.all
	// 	query.sortBy = query.sortBy || 'createdAt'
	// 	query.sortDirection = query.sortDirection || "desc"
	// 	query.pageNumber = query.pageNumber || '1'
	// 	query.pageSize = query.pageSize || "10"
	// 	query.searchLoginTerm = query.searchLoginTerm || ''
	// 	query.searchEmailTerm = query.searchEmailTerm || ''
		
    // const users = await this.usersQueryRepository.getAllUsers(
	// 	query.banStatus,
	// 	query.sortBy,
	// 	query.sortDirection,
	// 	query.pageNumber,
	// 	query.pageSize,
	// 	query.searchLoginTerm,
	// 	query.searchEmailTerm
    // );

	// // console.log("users 70: ", users.items.map(item => item.banInfo))

	// return users
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseFilters(new HttpExceptionFilter())
  async createUser( // возможна ошибка с тестами икубатора когда у нас неправильные несколько полей
	@Body() inputDataReq: InputDataReqClass
) {
	const {login, password, email} = inputDataReq
	const command = new CreateNewUserCommand(login, password, email)
	const createdUser = await this.commandBus.execute<CreateNewUserCommand, UserBanViewType | null>(command)
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
