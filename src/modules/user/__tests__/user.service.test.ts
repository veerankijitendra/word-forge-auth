import { createUser, findUsers } from '../user.service';
import { UserModel } from '../user.model';

// Mock the Mongoose model
jest.mock('../user.model');

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user, delete their password from the response, and return the data', async () => {
      const mockInput = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123',
      };
      const mockProfileImage = 'https://s3.aws.com/uploads/image.jpg';

      const mockCreatedUser = {
        _id: 'user123',
        ...mockInput,
        profileImageUrl: mockProfileImage,
        toJSON: jest.fn().mockReturnValue({
          _id: 'user123',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'securePassword123',
          profileImageUrl: mockProfileImage,
        }),
      };

      (UserModel.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await createUser(mockInput, mockProfileImage);

      expect(UserModel.create).toHaveBeenCalledWith({
        ...mockInput,
        profileImageUrl: mockProfileImage,
      });

      // The password should be omitted from the returned response
      expect(result.password).toBeUndefined();
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.profileImageUrl).toBe(mockProfileImage);
    });
  });

  describe('findUsers', () => {
    it('should return all users without their passwords', async () => {
      const mockUsers = [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Doe', email: 'jane@example.com' },
      ];

      // Mongoose chaining: find().select()
      const mockSelect = jest.fn().mockResolvedValue(mockUsers);
      (UserModel.find as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await findUsers();

      expect(UserModel.find).toHaveBeenCalled();
      expect(mockSelect).toHaveBeenCalledWith('-password');
      expect(result).toEqual(mockUsers);
    });
  });
});
