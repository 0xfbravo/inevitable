import { CacheModule, Module } from '@nestjs/common';
import { AwsService } from './aws.service';

@Module({
  imports: [CacheModule.register()],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
