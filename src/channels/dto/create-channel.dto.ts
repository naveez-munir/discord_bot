import { IsString, Length } from 'class-validator';
export class CreateChannelDto {
  @IsString()
  id: string;

  @IsString()
  @Length(1, 300)
  name: string;

  @IsString()
  workspaceId: string;

  @IsString()
  userId: string;
}
