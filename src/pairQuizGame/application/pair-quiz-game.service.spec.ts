import { Test, TestingModule } from '@nestjs/testing';
import { PairQuizGameService } from './pair-quiz-game.service';

describe('PairQuizGameService', () => {
  let service: PairQuizGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PairQuizGameService],
    }).compile();

    service = module.get<PairQuizGameService>(PairQuizGameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
