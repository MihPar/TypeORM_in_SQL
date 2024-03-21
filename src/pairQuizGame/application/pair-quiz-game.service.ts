import { Injectable } from '@nestjs/common';
import { CreatePairQuizGameDto } from '../dto/create-pair-quiz-game.dto';
import { UpdatePairQuizGameDto } from '../dto/update-pair-quiz-game.dto';

@Injectable()
export class PairQuizGameService {
  create(createPairQuizGameDto: CreatePairQuizGameDto) {
    return 'This action adds a new pairQuizGame';
  }

  findAll() {
    return `This action returns all pairQuizGame`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pairQuizGame`;
  }

  update(id: number, updatePairQuizGameDto: UpdatePairQuizGameDto) {
    return `This action updates a #${id} pairQuizGame`;
  }

  remove(id: number) {
    return `This action removes a #${id} pairQuizGame`;
  }
}
