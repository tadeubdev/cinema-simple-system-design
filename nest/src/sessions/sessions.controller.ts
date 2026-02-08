import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import SessionsService from './sessions.service';
import { AllSessionsQueryDto } from './dtos/all-sessions.query';
import { CreateSessionQueryDto } from './dtos/create-session.query';
import { UpdateSessionQueryDto } from './dtos/update-session.query';

@Controller('sessions')
export default class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('/')
  async getAllSessions(@Query() query: AllSessionsQueryDto) {
    return await this.sessionsService.getAllSessions(query);
  }

  @Post('/')
  async createSession(@Body() body: CreateSessionQueryDto) {
    return await this.sessionsService.createSession(body);
  }

  @Put('/:id')
  async updateSession(
    @Param('id') id: string,
    @Body() body: UpdateSessionQueryDto,
  ) {
    return await this.sessionsService.updateSession(id, body);
  }
}
