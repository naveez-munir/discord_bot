import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DiscordModule } from '@discord-nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from 'config/typeorm';
import { GatewayIntentBits } from 'discord.js';
import { ChannelsModule } from './channels/channels.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { UserWorkspaceModule } from './user-workspace/user-workspace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    DiscordModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('DISCORD_TOKEN'),
        discordClientOptions: {
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildPresences,
          ],
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ChannelsModule,
    WorkspaceModule,
    UserWorkspaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
