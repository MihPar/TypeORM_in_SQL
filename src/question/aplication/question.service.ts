import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionService {

  findAll() {
    return `This action returns all question`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
