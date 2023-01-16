import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateMetadata, UpdatedMetadata } from './metadata.interface';

// http://localhost:3000/metadata
@Controller('metadata')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // GET http://localhost:3000/metadata/1238128-23232-2323121dasd1
  @Get(':uuid')
  readMetadata(@Param('uuid') uuid: string): Promise<string> {
    return this.appService.readMetadata(uuid);
  }

  // PUT http://localhost:3000/metadata/1238128-23232-2323121dasd1
  @Put(':uuid')
  updateMetadata(
    @Param('uuid') uuid: string,
    @Body() updatedMetadata: UpdatedMetadata,
  ): Promise<string> {
    return this.appService.updateMetadata(uuid, updatedMetadata);
  }

  // POST http://localhost:3000/metadata
  @Post()
  createMetadata(@Body() metadata: CreateMetadata): Promise<string> {
    return this.appService.createMetadata(metadata);
  }
}
