import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import {
  ApiFile,
  editFileName,
  imageFilter,
  textFileFilter,
} from './upload.util';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  @Post('image')
  @ApiConsumes('multiform/form-data')
  @ApiFile('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: editFileName,
      }),
      fileFilter: imageFilter,
    }),
  )
  async uploadImage(@UploadedFile() image: Express.Multer.File) {
    if (!image)
      return new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    const response = {
      originalName: image.originalname,
      fileName: image.filename,
    };
    return response;
  }

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/files',
        filename: editFileName,
      }),
      fileFilter: textFileFilter,
    }),
  )
  @ApiConsumes('multiform/form-data')
  @ApiFile()
  async uploadTextFile(@UploadedFile() file: Express.Multer.File) {
    if (!file)
      return new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    const response = {
      originalName: file.originalname,
      fileName: file.filename,
    };
    return response;
  }

  @Get('image/:imgpath')
  sendUploadedImage(@Param('imgpath') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: './uploads/images' });
  }

  @Get('file/:filepath')
  sendUploadedFile(@Param('filepath') file: string, @Res() res: Response) {
    return res.sendFile(file, { root: './uploads/files' });
  }
}
