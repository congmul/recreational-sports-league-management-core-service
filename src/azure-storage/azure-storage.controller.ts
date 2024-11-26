import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AzureStorageService } from './azure-storage.service';

@Controller('azure-storage')
export class AzureStorageController {
  constructor(private readonly azureStorageService: AzureStorageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File is required');
    }
    const url = await this.azureStorageService.uploadFile(file);
    return { url };
  }
}