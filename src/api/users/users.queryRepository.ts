import "reflect-metadata"
import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserViewType } from './user.type';
import { PaginationType } from "../../types/pagination.types";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersQueryRepository {
  constructor(
	@InjectRepository(User) protected readonly userRepository: Repository<User>,
	) {}
  async getAllUsers(
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string,
    searchEmailTerm: string
  )
  : Promise<PaginationType<UserViewType>> 
  {
    if (sortBy === "login") {
		sortBy = "userName";
	  }

	const users = await this.userRepository
		.createQueryBuilder()
		.select("user")
		.from(User, "user")
		.where("user.login ILIKE :loginTerm OR user.email ILIKE :emailTerm", {loginTerm: `%${searchLoginTerm}%`, emailTerm: `%${searchEmailTerm}%`})
		.orderBy(`"user"."${sortBy}"`,`${sortDirection.toUpperCase() === "ASC" ? "ASC" : "DESC"}`)
		.limit(pageSize)
		.offset((+pageNumber - 1) * +pageSize)
		.getMany()
		// .getSql()

		// console.log("users: ", users)
    
	const totalCount = await this.userRepository
		.createQueryBuilder()
		.select("user")
		.from(User, "user")
		.where("user.login ILIKE :loginTerm OR user.email ILIKE :emailTerm", {loginTerm: `%${searchLoginTerm}%`, emailTerm: `%${searchEmailTerm}%`})
		.getCount()
		// .getSql()

		// const totalCount = users1.length
		// console.log("totalCount2: ", totalCount)

    const pagesCount = Math.ceil(totalCount / +pageSize);
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: users.map(
        (user: User): UserViewType => ({
          id: user.id,
          login: user.login,
          email: user.email,
          createdAt: user.createdAt,
        })
      ),
    };
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    const user: User | null = await this.userRepository
		.createQueryBuilder()
		.select("user")
		.from(User, "user")
		.where("user.login = :login OR user.email = :email", {login: loginOrEmail, email: loginOrEmail})
		.getOne()
    
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.userRepository
		.createQueryBuilder()
		.select("user")
		.from(User, "user")
		.where("user.email = :email", {email})
		.getOne()
    return user;
  }

  async findUserByLogin(login: string): Promise<User | null> {
    const user: User | null = await this.userRepository
		.createQueryBuilder()
		.select("user")
		.from(User, "user")
		.where("user.login = :log", {log: login})
		.getOne()
    return user;
  }

  async findUserByCode(
    recoveryCode: string
  ): Promise<User | null> {
	const result = await this.userRepository
		.createQueryBuilder()
		.select("user")
		.from(User, "user")
		.where("user.confirmationCode = :code", {code: recoveryCode})
		.getOne()
    return result
  }

  async findUserByConfirmation(code: string): Promise<User | null> {
    const user: User | null = await this.userRepository
		.createQueryBuilder()
		.select("user")
		.from(User, "user")
		.where("user.confirmationCode = :code", {code})
		.getOne()
    
    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    let user: User | null = await this.userRepository
		.createQueryBuilder()
		.select("user")
		.from(User, "user")
		.where("user.id = :id", {id})
		.getOne()

		// const sqlRequest = user.getSql()
		// await writeSql(sqlRequest)
      
    return user;
  }
}
