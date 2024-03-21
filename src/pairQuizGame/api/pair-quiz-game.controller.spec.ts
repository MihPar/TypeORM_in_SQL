import { Test, TestingModule } from '@nestjs/testing';
import { PairQuizGameController } from './pair-quiz-game.controller';
import { PairQuizGameService } from '../application/pair-quiz-game.service';

describe('PairQuizGameController', () => {
  let controller: PairQuizGameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PairQuizGameController],
      providers: [PairQuizGameService],
    }).compile();

    controller = module.get<PairQuizGameController>(PairQuizGameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
