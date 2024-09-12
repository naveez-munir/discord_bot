import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DiscordModule } from '@discord-nestjs/core';
import { CustomLogger } from '../shared/services/custom-logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), DiscordModule.forFeature()],
  controllers: [UserController],
  providers: [UserService, CustomLogger],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
