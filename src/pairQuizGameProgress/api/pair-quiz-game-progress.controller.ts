import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PairQuizGameProgressService } from '../application/pair-quiz-game-progress.service';
import { CreatePairQuizGameProgressDto } from '../dto/create-pair-quiz-game-progress.dto';
import { UpdatePairQuizGameProgressDto } from '../dto/update-pair-quiz-game-progress.dto';

@Controller('pair-quiz-game-progress')
export class PairQuizGameProgressController {
  constructor(private readonly pairQuizGameProgressService: PairQuizGameProgressService) {}

  @Post()
  create(@Body() createPairQuizGameProgressDto: CreatePairQuizGameProgressDto) {
    return this.pairQuizGameProgressService.create(createPairQuizGameProgressDto);
  }

  @Get()
  findAll() {
    return this.pairQuizGameProgressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pairQuizGameProgressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePairQuizGameProgressDto: UpdatePairQuizGameProgressDto) {
    return this.pairQuizGameProgressService.update(+id, updatePairQuizGameProgressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pairQuizGameProgressService.remove(+id);
  }
}
