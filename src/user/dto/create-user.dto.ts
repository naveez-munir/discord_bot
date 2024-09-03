import { IsString, IsOptional, Length, IsDate } from 'class-validator';
export class CreateUserDto {
  @IsString()
  id: string;

  @IsString()
  @Length(1, 300)
  name: string;

  @IsString()
  @Length(1, 150)
  username: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  status?: string | 'offline';

  @IsString()
  emp_no: string;

  @IsOptional()
  @IsDate()
  joining_date: Date;
}
