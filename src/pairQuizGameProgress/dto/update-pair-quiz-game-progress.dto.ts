import { PartialType } from '@nestjs/mapped-types';
import { CreatePairQuizGameProgressDto } from './create-pair-quiz-game-progress.dto';

export class UpdatePairQuizGameProgressDto extends PartialType(CreatePairQuizGameProgressDto) {}
