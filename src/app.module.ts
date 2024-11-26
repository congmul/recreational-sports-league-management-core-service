import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { envValidate } from './env.validation';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { PlayerModule } from './player/player.module';
import { CoachModule } from './coach/coach.module';
import { SeedService } from './seed/seed.service';
import { SeedModule } from './seed/seed.module';
import { AzureStorageModule } from './azure-storage/azure-storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule globally available
      // If a variable is found in multiple files, the first one takes precedence.
      envFilePath: ['.env.local', '.env'],
      validate: envValidate
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // Access the MONGODB_URI variable
        dbName: configService.get<string>('MONGO_DB_NAME'),
      }),
      inject: [ConfigService],
    }),    
    UserModule, HealthModule, 
    AuthModule, 
    TeamModule, PlayerModule, CoachModule, SeedModule, AzureStorageModule
  ],
  providers: [SeedService]
})
export class AppModule {}
