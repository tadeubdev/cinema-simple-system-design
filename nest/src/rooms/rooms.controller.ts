import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { AllRoomsQueryDto } from './dto/all-rooms-query.dto';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('/')
  findAll(@Query() query: AllRoomsQueryDto) {
    return this.roomsService.findAll(query);
  }

  @Get('/:id')
  findOne(@Query('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Post('/')
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Put('/:id')
  update(@Query('id') id: string, @Body() updateRoomDto: CreateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete('/:id')
  delete(@Query('id') id: string) {
    return this.roomsService.delete(id);
  }
}
