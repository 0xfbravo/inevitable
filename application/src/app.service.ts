import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Logger } from 'nestjs-pino';
import { AwsService } from './aws/src';
import { CreateMetadata, UpdatedMetadata } from './metadata.interface';

@Injectable()
export class AppService {
  constructor(
    private readonly awsService: AwsService,
    private readonly logger: Logger,
  ) {}

  private bucketName = 'inevitable-0xfbravo';

  async readMetadata(uuid: string): Promise<string> {
    this.logger.debug(`I'm reading the metadata for ${uuid}`);
    const data = await this.awsService.readFromS3(
      this.bucketName,
      `metadata/${uuid}.json`,
    );
    return data['Body'].toString('utf-8');
  }

  async updateMetadata(
    uuid: string,
    updatedMetadata: UpdatedMetadata,
  ): Promise<string> {
    this.logger.debug(`I'm updating the metadata for ${uuid}`);
    const objectKey = `metadata/${uuid}.json`;
    const metadataString = JSON.stringify(updatedMetadata);
    this.awsService.deleteFromS3(this.bucketName, objectKey);
    this.awsService.writeToS3(
      this.bucketName,
      objectKey,
      'application/json',
      metadataString,
      'public-read',
    );
    return await this.readMetadata(uuid);
  }

  async createMetadata(metadata: CreateMetadata): Promise<string> {
    const uuid = randomUUID().toString();
    this.logger.debug(`I'm creating the metadata for ${uuid}`);
    const objectKey = `metadata/${uuid}.json`;
    const metadataString = JSON.stringify(metadata);
    this.awsService.writeToS3(
      this.bucketName,
      objectKey,
      'application/json',
      metadataString,
      'public-read',
    );
    return await this.readMetadata(uuid);
  }
}
