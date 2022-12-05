import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { Body, ObjectCannedACL } from 'aws-sdk/clients/s3';
import { Cache } from 'cache-manager';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AwsService {
  private region: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: Logger,
  ) {
    this.region = process.env.AWS_REGION || 'unknown';
  }

  async writeToS3(
    bucket: string,
    key: string,
    contentType: string,
    body: Body,
    ACL: ObjectCannedACL,
  ) {
    this.logger.log(
      `Writing a file at [${bucket}/${key}] S3 with type [${contentType}] & ACL [${ACL}]`,
    );
    const s3Manager = new S3();
    const objectRequest: S3.PutObjectRequest = {
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      Body: body,
      ACL,
    };
    await s3Manager.putObject(objectRequest).promise();
  }

  async readFromS3(bucket: string, key: string): Promise<any> {
    this.logger.log(`Reading a file at [${bucket}/${key}] S3`);
    const cacheKey = bucket + key;
    const cachedResponse: string = await this.cacheManager.get(cacheKey);

    if (cachedResponse && cachedResponse !== '') {
      return cachedResponse;
    }

    const s3Manager = new S3();
    const objectRequest: S3.GetObjectRequest = {
      Bucket: bucket,
      Key: key,
    };
    const object = await s3Manager.getObject(objectRequest).promise();
    await this.cacheManager.set(cacheKey, object, 100);
    return object;
  }
}
