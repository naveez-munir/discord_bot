import { IsString, Length } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  id: string;

  @IsString()
  @Length(1, 300)
  name: string;
}
