import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MetadataInterface } from './metadata.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('metadata')
  async writeMetadata(@Body() body: MetadataInterface): Promise<string> {
    return this.appService.createMetadata(body);
  }

  @Get('metadata/:uuid')
  async readMetadata(@Param() params: any): Promise<MetadataInterface> {
    return this.appService.readMetadata(params.uuid);
  }
}
