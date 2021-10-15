import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File) {
    const res = {
      originalName: file.filename,
      fileName: file.filename,
    };
    return res;
  }

  private async imageFilter(req, file, callback) {
    if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(
        new HttpException('Only image files', HttpStatus.BAD_REQUEST),
      );
    }
    return callback(null, true);
  }

  private async editFileName(req, file, callback) {}
}
