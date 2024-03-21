import { Injectable } from '@nestjs/common';
import { CreatePairQuizGameProgressDto } from '../dto/create-pair-quiz-game-progress.dto';
import { UpdatePairQuizGameProgressDto } from '../dto/update-pair-quiz-game-progress.dto';

@Injectable()
export class PairQuizGameProgressService {
  create(createPairQuizGameProgressDto: CreatePairQuizGameProgressDto) {
    return 'This action adds a new pairQuizGameProgress';
  }

  findAll() {
    return `This action returns all pairQuizGameProgress`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pairQuizGameProgress`;
  }

  update(id: number, updatePairQuizGameProgressDto: UpdatePairQuizGameProgressDto) {
    return `This action updates a #${id} pairQuizGameProgress`;
  }

  remove(id: number) {
    return `This action removes a #${id} pairQuizGameProgress`;
  }
}
