import { PartialType } from '@nestjs/mapped-types';
import { CreatePairQuizGameDto } from './create-pair-quiz-game.dto';

export class UpdatePairQuizGameDto extends PartialType(CreatePairQuizGameDto) {}
