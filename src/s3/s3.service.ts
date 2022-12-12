import { Injectable } from '@nestjs/common';
import S3 from 'aws-sdk/clients/s3';

@Injectable()
export class S3Service {
  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    
    //upload file to s3
    const uploadResult = await s3
      .upload({
        Bucket: `${process.env.AWS_BUCKET_NAME}/apks`,
        Body: dataBuffer,
        Key: `${filename}`,
        ACL: process.env.AWS_ACL,
      })
      .promise();
    return { key: uploadResult.Key, url: uploadResult.Location };
  }
}
