import { CLOUDINARY_MEDIA_FOLDER } from '@common/constants/common.constants';
import { UploadFileTCPResponse } from '@common/interfaces/tcp/media';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  private readonly cloudinary = cloudinary;
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {
    this.cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CONFIG.CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_CONFIG.API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_CONFIG.API_SECRET'),
    });
  }

  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<UploadFileTCPResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: CLOUDINARY_MEDIA_FOLDER,
          resource_type: 'auto',
          public_id: fileName,
        },
        (error, result) => {
          if (error || !result) {
            this.logger.error('Upload error:', error);
            return reject(error);
          }
          this.logger.log('Upload successful:', result);
          return resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error || !result) {
          this.logger.error('Delete error:', error);
          return reject(error);
        }
        this.logger.log('Delete successful:', result);
        return resolve();
      });
    });
  }
}
