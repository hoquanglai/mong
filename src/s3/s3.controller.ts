import { Controller, Post, UseInterceptors, Res, UploadedFile, HttpStatus  } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3 } from 'aws-sdk';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express'

@Controller('upload')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Res() res: Response, @UploadedFile() file: Express.Multer.File) {
    try {
      const s3Result = await this.s3Service.uploadPublicFile(
        file.buffer,
        file.originalname
      );
      const path = s3Result.url;
      res.status(HttpStatus.OK).send(path);
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.BAD_REQUEST);
    }
  }
}
