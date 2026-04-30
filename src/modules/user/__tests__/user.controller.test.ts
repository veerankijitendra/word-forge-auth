import { Request, Response, NextFunction } from 'express';
import { createUserController, getUsersController } from '../user.controller';
import * as UserService from '../user.service';

jest.mock('../user.service');

describe('User Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('createUserController', () => {
    it('should successfully create a user and return 201 status', async () => {
      mockReq.body = { name: 'John', email: 'john@example.com', password: 'password123' };
      mockReq.file = { location: 'https://s3.com/image.jpg' } as any;

      const mockReturnedUser = { name: 'John', email: 'john@example.com' };
      (UserService.createUser as jest.Mock).mockResolvedValue(mockReturnedUser);

      await createUserController(mockReq as Request, mockRes as Response, mockNext);

      expect(UserService.createUser).toHaveBeenCalledWith(mockReq.body, 'https://s3.com/image.jpg');
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        data: { user: mockReturnedUser },
      });
    });

    it('should handle MongoDB duplicate key error and return 409 status', async () => {
      mockReq.body = { email: 'duplicate@example.com' };
      const duplicateError = new Error('Duplicate key');
      (duplicateError as any).code = 11000;

      (UserService.createUser as jest.Mock).mockRejectedValue(duplicateError);

      await createUserController(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Email already exists',
      });
      expect(mockNext).not.toHaveBeenCalled(); // The error is handled inside the controller
    });

    it('should pass unexpected errors to next()', async () => {
      mockReq.body = { name: 'Test' };
      const unexpectedError = new Error('Database down');
      (UserService.createUser as jest.Mock).mockRejectedValue(unexpectedError);

      await createUserController(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(unexpectedError);
    });
  });

  describe('getUsersController', () => {
    it('should return 200 with the list of users', async () => {
      const mockUsersList = [{ name: 'A' }, { name: 'B' }];
      (UserService.findUsers as jest.Mock).mockResolvedValue(mockUsersList);

      await getUsersController(mockReq as Request, mockRes as Response, mockNext);

      expect(UserService.findUsers).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        data: { users: mockUsersList },
      });
    });
  });
});
