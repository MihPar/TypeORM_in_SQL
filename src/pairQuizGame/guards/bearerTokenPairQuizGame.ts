import dotenv from 'dotenv';
dotenv.config();
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersQueryRepository } from '../../users/users.queryRepository';
import { Observable } from 'rxjs';

@Injectable()
export class BearerTokenPairQuizGame implements CanActivate {
  constructor(
    protected jwtServise: JwtService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}
  async canActivate(
	context: ExecutionContext
	): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization) throw new UnauthorizedException('401');
    const token = req.headers.authorization.split(' ')[1];
    let userId: string;
    try {
      userId = (
        await this.jwtServise.verifyAsync(token, {
          secret: process.env.JWT_SECRET!,
        })
      ).userId;
    } catch (err) {
      throw new UnauthorizedException('401');
    }
    if (userId) {
      const user = await this.usersQueryRepository.findUserById(userId);
      if (user) {
        req['user'] = user;
        return true;
      }
      throw new UnauthorizedException('401');
    } else {
      throw new UnauthorizedException('401');
    }
  }
}
