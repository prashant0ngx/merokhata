
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from "@nestjs/config";
import { configuration } from "./config/configuration";

@Module({ 
  imports: [MongooseModule.forRoot(configuration().databaseUrl), UserModule, AuthModule,
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env', '.env.development', '.env.production', '.env.test', '.env.local'],
    load: [configuration],
  }),


],
  controllers: [AppController], 
  providers: [
         AppService],
})
export class AppModule {}
