import { Test, TestingModule } from '@nestjs/testing';
import { PairQuizGameProgressController } from './pair-quiz-game-progress.controller';
import { PairQuizGameProgressService } from '../application/pair-quiz-game-progress.service';

describe('PairQuizGameProgressController', () => {
  let controller: PairQuizGameProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PairQuizGameProgressController],
      providers: [PairQuizGameProgressService],
    }).compile();

    controller = module.get<PairQuizGameProgressController>(PairQuizGameProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
