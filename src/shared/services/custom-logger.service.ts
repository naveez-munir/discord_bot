import { Injectable, LoggerService } from '@nestjs/common';

import { Channel, Client } from 'discord.js';
import { InjectDiscordClient } from '@discord-nestjs/core';

@Injectable()
export class CustomLogger implements LoggerService {
  private logChannelId: string;
  private logChannel: Channel;

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  private async sendLogMessage(message: string) {
    if (global.logChannelId && (!this.logChannelId || !this.logChannel)) {
      this.logChannelId = global.logChannelId;
      this.logChannel = await this.client.channels.fetch(this.logChannelId);
    }

    if (this.logChannel?.isTextBased()) {
      /** 4096 is to send silent message */
      this.logChannel.send({
        content: message,
        flags: [4096],
      });
    }
  }

  log(message: string) {
    this.sendLogMessage(`[Log] ${message}`);
  }

  error(message: unknown, trace: string) {
    this.sendLogMessage(`[Error] ${message}\nTrace: ${trace}`);
  }

  warn(message: unknown, trace: string) {
    this.sendLogMessage(`[Warn] ${message}\nTrace: ${trace}`);
  }
}
