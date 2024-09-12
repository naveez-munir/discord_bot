import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Repository } from 'typeorm';
import { Channel } from '../channels/entities/channel.entity';
import { User } from '../user/entities/user.entity';
import { Workspace } from '../workspace/entities/workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomLogger } from 'src/shared/services/custom-logger.service';
@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    private readonly logger: CustomLogger,
  ) {}
  async create(createChannelDto: CreateChannelDto) {
    try {
      let user = await this.userRepository.findOne({
        where: { id: createChannelDto.userId },
      });
      if (!user) return 'user not found';
      let server = await this.workspaceRepository.findOne({
        where: { id: createChannelDto.workspaceId },
      });
      if (!server) return 'server not found';
      //we can not create 2 channels with the same name in the same channel
      let channelExists = await this.channelRepository.findOne({
        where: {
          name: createChannelDto.name,
          workspace: { id: createChannelDto.workspaceId },
        },
      });

      /** Delete the existing channel as its id might have changed, so can't update it */
      if (channelExists) {
        await this.channelRepository.delete({
          name: createChannelDto.name,
          workspace: { id: createChannelDto.workspaceId },
        });
      }

      let channel = new Channel();
      channel.id = createChannelDto.id;
      channel.name = createChannelDto.name;
      channel.isActive = true;
      channel.workspace = server;
      channel.primary_member = user;
      this.channelRepository.save(channel);
    } catch (error) {
      return 'some error';
    }
  }

  //TODO we can update this like get all channel in certain server etc
  async findAll() {
    return await this.channelRepository.find();
  }

  async findOne(id: string) {
    try {
      let channel = await this.channelRepository.findOne({
        where: { id: id },
        relations: ['primary_member', 'workspace'],
      });
      if (!channel) return null;
      return channel;
    } catch (error) {
      this.logger.error(error, `${ChannelsService.name} -> findOne`);
      return null;
    }
  }

  async findChannelByUser(userId: string) {
    try {
      let channel = await this.channelRepository.findOne({
        where: { primary_member: { id: userId } },
        relations: ['primary_member', 'workspace'],
      });
      if (!channel) return null;
      return channel;
    } catch (error) {
      this.logger.error(error, `${ChannelsService.name} -> findChannelByUser`);
      return null;
    }
  }
  //TODO we might be used this to update the status of channel like active/archived etc
  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  async findChannelByName(channelName: string) {
    try {
      const channel = await this.channelRepository.findOne({
        where: { name: channelName },
      });
      if (!channel) return null;
      return channel;
    } catch (error) {
      this.logger.error(error, `${ChannelsService.name} -> findChannelByName`);
      return null;
    }
  }

  //TODO we will not going to delete any record we will just update the status or
  // we will move the record in another table
  remove(id: number) {
    return `This action removes a #${id} channel`;
  }

  async addReportingChannel(
    GuildId: string,
    channelId: string,
    channelName: string,
  ) {
    try {
      const server = await this.workspaceRepository.findOne({
        where: { id: GuildId },
      });
      if (!server) return 'server not found';

      const channelExists = await this.channelRepository.findOne({
        where: {
          name: channelName,
          workspace: { id: GuildId },
        },
      });

      if (channelExists) return 'channel already exists';
      const channel = new Channel();
      channel.id = channelId;
      channel.name = channelName;
      channel.isActive = true;
      channel.workspace = server;
      await this.channelRepository.save(channel);
    } catch (error) {
      this.logger.error(
        error,
        `${ChannelsService.name} -> addReportingChannel`,
      );
    }
  }

  async findUserChannelAgainstServer(userId: string, serverId: string) {
    try {
      const channel = await this.channelRepository.findOne({
        where: { primary_member: { id: userId }, workspace: { id: serverId } },
      });
      if (!channel) return null;
      return channel;
    } catch (error) {
      this.logger.error(
        error,
        `${ChannelsService.name} -> findUserChannelAgainstServer`,
      );
      return null;
    }
  }

  async updateUserChannelAgainstServer(
    userId: string,
    serverId: string,
    channelName: string,
  ) {
    try {
      await this.channelRepository.update(
        {
          primary_member: { id: userId },
          workspace: { id: serverId },
        },
        {
          name: channelName,
        },
      );
    } catch (error) {
      this.logger.error(
        error,
        `${ChannelsService.name} -> updateUserChannelAgainstServer`,
      );
    }
  }
}
