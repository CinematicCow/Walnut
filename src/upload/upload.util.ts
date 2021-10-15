import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import { ApiBody } from '@nestjs/swagger';

export const imageFilter = (req, file, callback) => {
  if (file.originalname.match('/.(jpg|jpeg|png|gif)$/')) {
    return callback(
      new HttpException('Only image files allowed', HttpStatus.BAD_REQUEST),
    );
  }
  return callback(null, true);
};

export const textFileFilter = (req, file, callback) => {
  if (file.originalname.match('/.(txt)$/')) {
    return callback(
      new HttpException('Only text files allowed', HttpStatus.BAD_REQUEST),
    );
  }
  return callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16));
  callback(null, `${name}-${randomName}-${fileExtName}`);
};

export const ApiFile =
  (fileName: string = 'file'): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
