import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION } from '../configuration';
import { MediaModule } from './modules/media/media.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    MediaModule,
    CloudinaryModule,
  ],
  exports: [],
})
export class AppModule {
  static CONFIGURATION = CONFIGURATION;
}
