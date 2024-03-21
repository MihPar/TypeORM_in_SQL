import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../entities/user.entity';

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const UserIdDecorator = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
	  const request = ctx.switchToHttp().getRequest();
	  return (request.user as User)?.id ?? null;
	},
  );