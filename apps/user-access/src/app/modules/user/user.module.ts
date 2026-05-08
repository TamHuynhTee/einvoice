import { Module } from '@nestjs/common';
import { UserDestination } from '@common/schemas/lib/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [MongooseModule.forFeature([UserDestination])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
