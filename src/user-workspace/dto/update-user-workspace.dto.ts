import { PartialType } from '@nestjs/mapped-types';
import { CreateUserWorkspaceDto } from './create-user-workspace.dto';

export class UpdateUserWorkspaceDto extends PartialType(CreateUserWorkspaceDto) {}
