import "reflect-metadata"
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from "typeorm";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { UserViewType } from './user.type';
import { PaginationType } from "../../types/pagination.types";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersQueryRepository {
  constructor(
	@InjectRepository(User) protected readonly userRepository: Repository<User>,
	@InjectEntityManager() private readonly entityManager: EntityManager
	) {}
  async getAllUsers(
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string,
    searchLoginTerm: string,
    searchEmailTerm: string
  )
  : Promise<PaginationType<UserViewType>> 
  {
    // if (sortBy === "login") {
	// 	sortBy = "userName";
	//   }

	const users = await this.userRepository
		.createQueryBuilder('user')
		.select(['user'])
		.where('user.login ILIKE :loginTerm OR user.email ILIKE :emailTerm', {loginTerm: `%${searchLoginTerm}%`, emailTerm: `%${searchEmailTerm}%`})
		.orderBy(`"user"."${sortBy}"`,`${sortDirection.toUpperCase() === "ASC" ? "ASC" : "DESC"}`)
		.limit(+pageSize)
		.offset((+pageNumber - 1) * +pageSize)
		.getMany();

		// console.log("user: ", users[1])
		// console.log("user: ", users)

		// const totalCount = users[1]
		// const totalCount = users.length
		// console.log("length: ", totalCount)

		// const [users, totalCount] = await this.entityManager
	  	// 	.findAndCount(User, {
		// 		where: {
		// 			login: `%${searchLoginTerm}%`,
		// 			email: `%${searchEmailTerm}%`
		// 		}
		// 	})


		// 	console.log("users: ", users)
		// 	console.log("totalCount: ", totalCount)

		// const count = await this.entityManager
	  	// .count(User, {
		// 	where: {
		// 		login: `%${searchLoginTerm}%`,
		// 		email: `%${searchEmailTerm}%`
		// 	}
		// })
		// console.log("count: ", count)
	// const totalCount = await this.userRepository
	// 	.createQueryBuilder()
	// 	.from(User, "user")
	// 	.where("user.login ILIKE :loginTerm OR user.email ILIKE :emailTerm", {loginTerm: `%${searchLoginTerm}%`, emailTerm: `%${searchEmailTerm}%`})
	// 	.getCount()

	// 	console.log("count: ", totalCount)

	const queryBuilderTotalCount =
      this.userRepository.createQueryBuilder('user');

    const totalCount = await queryBuilderTotalCount
      .where("user.login ILIKE :loginTerm OR user.email ILIKE :emailTerm", {loginTerm: `%${searchLoginTerm}%`, emailTerm: `%${searchEmailTerm}%`})
      .getCount();

    const pagesCount = Math.ceil(totalCount / +pageSize);
    return {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
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
		.createQueryBuilder("user")
		.select("user")
		.where("user.login = :login OR user.email = :email", {login: loginOrEmail, email: loginOrEmail})
		.getOne()
    
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.userRepository
		.createQueryBuilder("user")
		.select("user")
		.where("user.email = :email", {email})
		.getOne()
    return user;
  }

  async findUserByLogin(login: string): Promise<User | null> {
    const user: User | null = await this.userRepository
		.createQueryBuilder('user')
		.select("user")
		.where("user.login = :log", {log: login})
		.getOne()
    return user;
  }

  async findUserByCode(
    recoveryCode: string
  ): Promise<User | null> {
	const result = await this.userRepository
		.createQueryBuilder("user")
		.select("user")
		.where("user.confirmationCode = :code", {code: recoveryCode})
		.getOne()
    return result
  }

  async findUserByConfirmation(code: string): Promise<User | null> {
    const user: User | null = await this.userRepository
		.createQueryBuilder('user')
		.select("user")
		.where("user.confirmationCode = :code", {code})
		.getOne()
    
    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    let user: User | null = await this.userRepository
		.createQueryBuilder("user")
		.select("user")
		.where("user.id = :id", {id})
		.getOne()

		// const sqlRequest = user.getSql()
		// await writeSql(sqlRequest)
      
    return user;
  }
}
