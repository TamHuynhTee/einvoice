import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/lib/grpc.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { AuthorizerGrpcController } from './controllers/authorizer-grpc.controller';
import { AuthorizerController } from './controllers/authorizer.controller';
import { AuthorizerService } from './services/authorizer.service';

@Module({
  imports: [KeycloakModule, ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.USER_ACCESS_SERVICE)])],
  controllers: [AuthorizerController, AuthorizerGrpcController],
  providers: [AuthorizerService],
})
export class AuthorizerModule {}
