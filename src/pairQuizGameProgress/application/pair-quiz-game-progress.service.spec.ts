import { Test, TestingModule } from '@nestjs/testing';
import { PairQuizGameProgressService } from './pair-quiz-game-progress.service';

describe('PairQuizGameProgressService', () => {
  let service: PairQuizGameProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PairQuizGameProgressService],
    }).compile();

    service = module.get<PairQuizGameProgressService>(PairQuizGameProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
