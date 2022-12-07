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

  async deleteFromS3(bucket: string, key: string) {
    this.logger.log(`Deleting a file from [${bucket}/${key}] S3`);
    const s3Manager = new S3();
    const objectRequest: S3.DeleteObjectRequest = {
      Bucket: bucket,
      Key: key,
    };
    await s3Manager.deleteObject(objectRequest).promise();
    return true;
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
    const s3Manager = new S3();
    const objectRequest: S3.GetObjectRequest = {
      Bucket: bucket,
      Key: key,
    };
    const object = await s3Manager.getObject(objectRequest).promise();
    return object;
  }
}
