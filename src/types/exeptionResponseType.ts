import { ResultCode } from "../infrastructura/enum/enumExeptionType";

export type exceptionObjectType = {
  message: string;
  field: string;
};

export type exceptionResponseType = {
  errorsMessages: exceptionObjectType[];
};

export type ExceptionResultType<T> = {
  data: T;
  code: ResultCode;
  field?: string;
  message?: string;
  response?: any;
};