import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3 } from 'aws-sdk';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, UploadedFile } from '@nestjs/common/decorators';

@Controller('upload')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadApk(@UploadedFile() file: Express.Multer.File) {
    try {
      const s3Result = await this.s3Service.uploadPublicFile(
        file.buffer,
        file.originalname
      );
      const path = s3Result.url;
      return path;
    } catch (error) {
      console.log(error);
    }
  }
}
