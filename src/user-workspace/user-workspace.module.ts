import { Module } from '@nestjs/common';
import { UserWorkspaceService } from './user-workspace.service';
import { UserWorkspaceController } from './user-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWorkspace } from './entities/user-workspace.entity';
import { UserModule } from 'src/user/user.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { DiscordModule } from '@discord-nestjs/core';
import { CustomLogger } from 'src/shared/services/custom-logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserWorkspace]),
    UserModule,
    WorkspaceModule,
    DiscordModule.forFeature(),
  ],
  controllers: [UserWorkspaceController],
  providers: [UserWorkspaceService, CustomLogger],
  exports: [UserWorkspaceService, TypeOrmModule],
})
export class UserWorkspaceModule {}
