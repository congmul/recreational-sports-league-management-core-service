import { Module } from '@nestjs/common';
import { AzureStorageService } from './azure-storage.service';
import { AzureStorageController } from './azure-storage.controller';

@Module({
  providers: [AzureStorageService],
  controllers: [AzureStorageController]
})
export class AzureStorageModule {}
