import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, Equal } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomLogger } from 'src/shared/services/custom-logger.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly logger: CustomLogger,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<boolean | User> {
    const existingUser = await this.findOne(createUserDto.id);
    if (!existingUser) {
      let user: User = new User();
      user.id = createUserDto.id;
      user.name = createUserDto.name;
      user.username = createUserDto.username;
      user.emp_no = createUserDto.emp_no;
      user.status = createUserDto.status;
      user.joining_date = createUserDto.joining_date;
      return this.userRepository.save(user);
    }
    return true;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: {
        joining_date: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<User> {
    try {
      let user = await this.userRepository.findOne({
        where: { id: Equal(id) },
      });
      if (!user) return null;
      return user;
    } catch (error) {
      this.logger.error(`findOne ->${error}`, 'user.service.ts');
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | string> {
    let user = await this.userRepository.findOne({ where: { id: Equal(id) } });
    if (!user) return 'user not found';
    user.status = updateUserDto.status;
    user.emp_no = updateUserDto.emp_no;
    return this.userRepository.save(user);
  }

  async updateStatus(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | string> {
    const user = await this.userRepository.findOne({
      where: { id: Equal(id) },
    });
    if (!user) return 'user not found';
    user.status = updateUserDto.status;
    return this.userRepository.save(user);
  }

  async updateUsername(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | string> {
    const user = await this.userRepository.findOne({
      where: { id: Equal(id) },
    });
    if (!user || user.name == updateUserDto.name) return;
    user.name = updateUserDto.name;
    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async getUserStatus(userId: string) {
    try {
      let user = await this.userRepository.findOne({
        where: { id: Equal(userId) },
      });
      return user.status;
    } catch (error) {
      return null;
    }
  }

  async getOnlineUsers() {
    try {
      let users;
      const usersCount = await this.userRepository.count({
        where: { status: 'online' },
      });
      if (usersCount < 4) {
        users = await this.userRepository.find({
          where: { status: 'online' },
        });
      } else {
        return null;
      }
      return users;
    } catch (error) {
      this.logger.error(`getOnlineUserCount ->${error}`, 'user.service.ts');
    }
  }
}
