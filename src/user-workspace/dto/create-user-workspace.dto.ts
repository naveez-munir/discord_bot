import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
