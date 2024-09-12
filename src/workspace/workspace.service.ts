import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workSpaceRepository: Repository<Workspace>,
  ) {}
  async create(createWorkspaceDto: CreateWorkspaceDto) {
    try {
      let serverExists = await this.findOne(createWorkspaceDto.name);
      if (!serverExists) {
        let server = new Workspace();
        server.id = createWorkspaceDto.id;
        server.name = createWorkspaceDto.name;
        await this.workSpaceRepository.save(server);
      } else {
        await this.update(0, createWorkspaceDto);
      }
    } catch (error) {
      return 'server  already exists';
    }
  }

  findAll() {
    return this.workSpaceRepository.find();
  }
  async findOne(name: string): Promise<Workspace | string> {
    try {
      //searching on the base of name because dicord bot will create the new id every time , when the server created
      const workspace = await this.workSpaceRepository.findOne({
        where: { name: name },
      });
      if (!workspace) {
        return null;
      }
      return workspace;
    } catch (error) {
      return null;
    }
  }

  async update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    // TODO will add the logic if needed.
    let workspace = await this.workSpaceRepository.findOne({
      where: { name: updateWorkspaceDto.name },
    });
    workspace.id = updateWorkspaceDto.id;
    workspace = await this.workSpaceRepository.save(workspace);
    return workspace;
  }

  remove(id: string) {
    return this.workSpaceRepository.delete(id);
  }
}
