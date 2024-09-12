import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Channel } from './entities/channel.entity';
import { CustomLogger } from 'src/shared/services/custom-logger.service';
import { DiscordModule } from '@discord-nestjs/core';
@Module({
  imports: [
    TypeOrmModule.forFeature([Channel]),
    UserModule,
    DiscordModule.forFeature(),
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService, CustomLogger],
  exports: [ChannelsService],
})
export class ChannelsModule {}
