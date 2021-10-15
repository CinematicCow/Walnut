import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class ImageUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
