import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { envValidate } from './env.validation';

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
      }),
      inject: [ConfigService],
    }),    
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
