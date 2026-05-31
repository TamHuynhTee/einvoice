import { Module } from '@nestjs/common';
import { UserDestination } from '@common/schemas/lib/user.schema';
import { RoleDestination } from '@common/schemas/lib/role.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/lib/tcp.config';
import { UserGrpcController } from './controllers/user-grpc.controller';

@Module({
  imports: [
    MongooseModule.forFeature([UserDestination, RoleDestination]),
    ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.AUTHORIZER_SERVICE)]),
  ],
  controllers: [UserController, UserGrpcController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
