import { Test, TestingModule } from '@nestjs/testing';
import { UserWorkspaceController } from './user-workspace.controller';
import { UserWorkspaceService } from './user-workspace.service';

describe('UserWorkspaceController', () => {
  let controller: UserWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWorkspaceController],
      providers: [UserWorkspaceService],
    }).compile();

    controller = module.get<UserWorkspaceController>(UserWorkspaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
