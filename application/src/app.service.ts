import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Logger } from 'nestjs-pino';
import { AwsService } from './aws/src';
import { MetadataInterface } from './metadata.interface';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: Logger,
    private readonly awsService: AwsService,
  ) {}

  private baseURL = 'https://inevitable-0xfbravo.s3.amazonaws.com';
  private bucketName = 'inevitable-0xfbravo';
  private prefix = 'metadata';

  async createMetadata(metadata: MetadataInterface): Promise<string> {
    const uuid = randomUUID();
    const finalUrl = `${this.baseURL}/${this.prefix}/${uuid}.json`;
    this.logger.log(`Writing metadata to [${finalUrl}]`);
    await this.awsService.writeToS3(
      this.bucketName,
      `${this.prefix}/${uuid}.json`,
      `application/json`,
      JSON.stringify(metadata),
      `public-read`,
    );
    return finalUrl;
  }

  async readMetadata(uuid: string): Promise<MetadataInterface> {
    this.logger.log(`Reading metadata from [${this.prefix}/${uuid}.json]`);
    return this.awsService.readFromS3(
      this.bucketName,
      `${this.prefix}/${uuid}.json`,
    );
  }
}
