import { Injectable } from '@nestjs/common';
import { CreateUserWorkspaceDto } from './dto/create-user-workspace.dto';
import { UpdateUserWorkspaceDto } from './dto/update-user-workspace.dto';
import { Repository } from 'typeorm';
import { UserWorkspace } from './entities/user-workspace.entity';
import { User } from '../user/entities/user.entity';
import { Workspace } from '../workspace/entities/workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomLogger } from 'src/shared/services/custom-logger.service';
@Injectable()
export class UserWorkspaceService {
  constructor(
    @InjectRepository(UserWorkspace)
    private readonly userWorkspaceRepository: Repository<UserWorkspace>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    private readonly logger: CustomLogger,
  ) {}
  async create(createUserWorkspaceDto: CreateUserWorkspaceDto) {
    if (
      !(await this.checkEntryExists(
        createUserWorkspaceDto.userId,
        createUserWorkspaceDto.workspaceId,
      ))
    ) {
      try {
        let user = await this.userRepository.findOne({
          where: { id: createUserWorkspaceDto.userId },
        });
        if (!user) return 'user not found';
        let workspace = await this.workspaceRepository.findOne({
          where: { id: createUserWorkspaceDto.workspaceId },
        });
        if (!workspace) return 'workspace not found';
        let userWorkspace = new UserWorkspace();
        userWorkspace.user = user;
        userWorkspace.workspace = workspace;
        userWorkspace = await this.userWorkspaceRepository.save(userWorkspace);
        return userWorkspace;
      } catch (error) {
        return error;
      }
    }
  }

  async findAll() {
    return await this.userWorkspaceRepository.find({
      relations: ['workspace', 'user'],
    });
  }

  async findOne(id: number) {
    try {
      return await this.userWorkspaceRepository.find({
        where: { id: id },
        relations: ['workspace', 'user'],
      });
    } catch (error) {
      return error;
    }
  }

  async findWorkSpaceUsers(workspaceId: string): Promise<User[]> {
    try {
      const userWorkspaces = await this.userWorkspaceRepository
        .createQueryBuilder('userWorkspace')
        .leftJoinAndSelect('userWorkspace.user', 'user')
        .where('userWorkspace.workspace.id = :workspaceId', { workspaceId })
        .orderBy('user.joining_date', 'ASC')
        .getMany();
      const users = userWorkspaces.map((userWorkspace) => userWorkspace.user);
      return users;
    } catch (error) {
      return [];
      //TODO modify this to handle db error
    }
  }

  async checkEntryExists(userId: string, serverID: string) {
    try {
      const userWorkspaceExists = await this.userWorkspaceRepository.findOne({
        where: { user: { id: userId }, workspace: { id: serverID } },
      });
      if (userWorkspaceExists) return true;
      return false;
    } catch (error) {
      this.logger.error(
        error,
        `${UserWorkspaceService.name} -> checkEntryExists`,
      );
      return error;
    }
  }
  //we might not need this method
  update(id: number, updateUserWorkspaceDto: UpdateUserWorkspaceDto) {
    return `This action updates a #${id} userWorkspace`;
  }
  //TODO handle data deletion process (discuss with HN)
  remove(id: number) {
    return `This action removes a #${id} userWorkspace`;
  }
}
