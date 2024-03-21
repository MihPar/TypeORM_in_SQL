import dotenv from 'dotenv';
dotenv.config();
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersQueryRepository } from '../../../api/users/users.queryRepository';

@Injectable()
export class CheckRefreshTokenForGet implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected usersQueryRepository: UsersQueryRepository,
    
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
	let token
	let payload
	if (!req.headers.authorization) {
		req.user = null
	} else {
		token = req.headers.authorization.split(' ')[1];
		try {
			// console.log('try')
			// console.log("process.env.JWT_SECRET: ", process.env.JWT_SECRET)
			// console.log("token: ", token)

			payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET!})
			// console.log("payload: ", payload)
		} catch(err) {
			// console.log("err:", err)
			payload = null
		}
	}

    if (payload) {
      const resultAuth = await this.usersQueryRepository.findUserById(payload.userId);
	//   console.log("resultAuth: ", resultAuth)
      if (resultAuth) {
        req['user'] = resultAuth;
        return true;
      }
	  
      return false;
    } else {
      return true;
    }
  }
}