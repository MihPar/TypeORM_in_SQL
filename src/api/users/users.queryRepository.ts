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
	@InjectRepository(User) protected readonly repository: Repository<User>,
	) {}
  async getAllUsers(
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string,
    searchLoginTerm: string,
    searchEmailTerm: string
  ): Promise<PaginationType<UserViewType>> {
    if (sortBy === "login") {
		sortBy = "userName";
	  }

	const users = await this.repository
		.createQueryBuilder("u")
		.select("user u")
		.where("u.userName ILIKE :loginTerm", {loginTerm: `%${searchLoginTerm}%`})
		.orWhere("u.userName ILIKE :emailTerm", {emailTerm: `%${searchEmailTerm}%`})
		.orderBy(`${sortBy}`,`${sortDirection.toUpperCase() === "ASC" ? "ASC" : "DESC"}`)
		.limit(+pageSize)
		.offset((+pageNumber - 1) * +pageSize)
		.getMany()
    
	const totalCount = await this.repository
		.createQueryBuilder("u")
		.select("user u")
		.where("u.userName ILIKE :loginTerm", {loginTerm: `%${searchLoginTerm}%`})
		.orWhere("u.userName ILIKE :emailTerm", {emailTerm: `%${searchEmailTerm}%`})
		.getCount()

    const pagesCount: number = await Math.ceil(totalCount / +pageSize);
    return {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: users.map(
        (user: User): UserViewType => ({
          id: user.id.toString(),
          login: user.login,
          email: user.email,
          createdAt: user.createdAt,
        })
      ),
    };
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    const user: User | null = await this.repository
		.createQueryBuilder("u")
		.select("user")
		.where("u.userName = :login OR u.userName = :email", {login: loginOrEmail, email: loginOrEmail})
		.getOne()
    
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.repository
		.createQueryBuilder("u")
		.select("user u")
		.where("u.email = :email", {email})
		.getOne()
    return user;
  }

  async findUserByLogin(login: string): Promise<User | null> {
    const user: User | null = await this.repository
		.createQueryBuilder("u")
		.select("user")
		.where("u.login = login", {login})
		.getOne()
    return user;
  }

  async findUserByCode(
    recoveryCode: string
  ): Promise<User | null> {
	const result = await this.repository
		.createQueryBuilder("u")
		.select("user")
		.where("u.confirmationCode = :code", {code: recoveryCode})
		.getOne()
    return result
  }

  async findUserByConfirmation(code: string): Promise<User | null> {
    const user: User | null = await this.repository
		.createQueryBuilder("u")
		.select("user")
		.where("u.code = :code", {code})
		.execute()
    
    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    let user: User | null = await this.repository
		.createQueryBuilder("u")
		.select("user")
		.where("u.id = :id", {id})
		.getOne()

		// const sqlRequest = user.getSql()
		// await writeSql(sqlRequest)
      
    return user;
  }
}
