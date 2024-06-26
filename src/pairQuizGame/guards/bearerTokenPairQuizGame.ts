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

@Injectable()
export class BearerTokenPairQuizGame implements CanActivate {
  constructor(
    protected jwtServise: JwtService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization) throw new UnauthorizedException('401');
    const token = req.headers.authorization.split(' ')[1];
    let userId: string;
    try {
      userId = (
        await this.jwtServise.verifyAsync(token, {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          secret: process.env.JWT_SECRET!,
        })
      ).userId;
    } catch (err) {
      throw new UnauthorizedException('401');
    }
    if (userId) {
		// проверка на сессии в базе  ( добавить )
		// поменять запрос ниже на нахождение пользователя по айди вместе со всеми его сессиями 
		// users JOIN devices
      const user = await this.usersQueryRepository.findUserAndDevicesById(userId);
      if (user && !user.isBanned) {
        req['user'] = user;
        return true;
      }
      throw new UnauthorizedException('401');
    } else {
      throw new UnauthorizedException('401');
    }
  }
}
