import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../cloudinary/services/cloudinary.service';
import { UploadFileTCPRequest } from '@common/interfaces/lib/tcp/media/request.interface';

@Injectable()
export class MediaService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFile(data: UploadFileTCPRequest): Promise<string> {
    const fileBuffer = Buffer.from(data.fileBase64, 'base64');
    return this.cloudinaryService.uploadFile(fileBuffer, data.fileName);
  }
}
