import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../cloudinary/services/cloudinary.service';
import { DeleteFileTCPRequest, UploadFileTCPRequest, UploadFileTCPResponse } from '@common/interfaces/tcp/media';

@Injectable()
export class MediaService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFile(data: UploadFileTCPRequest): Promise<UploadFileTCPResponse> {
    const fileBuffer = Buffer.from(data.fileBase64, 'base64');
    return this.cloudinaryService.uploadFile(fileBuffer, data.fileName);
  }

  async deleteFile(params: DeleteFileTCPRequest): Promise<void> {
    await this.cloudinaryService.deleteFile(params);
  }
}
