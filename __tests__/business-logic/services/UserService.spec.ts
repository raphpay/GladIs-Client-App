import IUser from "../../../src/business-logic/model/IUser";
import UserType from "../../../src/business-logic/model/enums/UserType";
import ApiService from "../../../src/business-logic/services/APIService";
import UserService from "../../../src/business-logic/services/UserService";


// Mock the ApiService class
jest.mock('../../../src/business-logic/services/APIService');

describe('UserService', () => {
  // Test suite for the createUser method
  describe('createUser', () => {
    it('should create a new user', async () => {
      // Define a user object to pass to the createUser method
      const user: IUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'john_doe',
        password: 'password123',
        userType: UserType.Client,
      };

      // Mock the ApiService.post method to return the created user
      const createdUser: IUser = { ...user, id: '1234567890' };
      (ApiService.post as jest.MockedFunction<typeof ApiService.post>).mockResolvedValue(createdUser);

      // Call the createUser method
      const result = await UserService.createUser(user);

      // Expect the ApiService.post method to have been called with the correct arguments
      expect(ApiService.post).toHaveBeenCalledWith('users', user);

      // Expect the result to match the created user
      expect(result).toEqual(createdUser);
    });

    it('should throw an error if ApiService.post throws an error', async () => {
      // Mock ApiService.post to throw an error
      const error = new Error('Failed to create user');
      (ApiService.post as jest.MockedFunction<typeof ApiService.post>).mockRejectedValue(error);

      // Call createUser and expect it to throw an error
      await expect(UserService.createUser({} as IUser)).rejects.toThrowError(error);
    });
  });

  // Test suite for the getUserById method
  describe('getUserById', () => {
    it('should fetch a user by ID', async () => {
      // Mock the ApiService.get method to return a user
      const userId = '1234567890';
      const user: IUser = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'john_doe',
        password: 'password123',
        userType: UserType.Client,
      };
      (ApiService.get as jest.MockedFunction<typeof ApiService.get>).mockResolvedValue(user);

      // Call the getUserById method
      const result = await UserService.getUserById(userId);

      // Expect the ApiService.get method to have been called with the correct URL
      expect(ApiService.get).toHaveBeenCalledWith(`users/${userId}`);

      // Expect the result to match the fetched user
      expect(result).toEqual(user);
    });

    it('should throw an error if ApiService.get throws an error', async () => {
      // Mock ApiService.get to throw an error
      const error = new Error('Failed to fetch user');
      (ApiService.get as jest.MockedFunction<typeof ApiService.get>).mockRejectedValue(error);

      // Call getUserById and expect it to throw an error
      await expect(UserService.getUserById('123')).rejects.toThrowError(error);
    });
  });
});
