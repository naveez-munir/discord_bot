import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserWorkspaceService } from './user-workspace.service';
import { CreateUserWorkspaceDto } from './dto/create-user-workspace.dto';
import { UpdateUserWorkspaceDto } from './dto/update-user-workspace.dto';

@Controller('user-workspace')
export class UserWorkspaceController {
  constructor(private readonly userWorkspaceService: UserWorkspaceService) {}

  @Post()
  create(@Body() createUserWorkspaceDto: CreateUserWorkspaceDto) {
    return this.userWorkspaceService.create(createUserWorkspaceDto);
  }

  @Get()
  findAll() {
    return this.userWorkspaceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userWorkspaceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserWorkspaceDto: UpdateUserWorkspaceDto) {
    return this.userWorkspaceService.update(+id, updateUserWorkspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userWorkspaceService.remove(+id);
  }
}
