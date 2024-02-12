import IToken from "../../../src/business-logic/model/IToken";
import IUser from "../../../src/business-logic/model/IUser";
import UserType from "../../../src/business-logic/model/enums/UserType";
import APIService from "../../../src/business-logic/services/APIService";
import CacheService from "../../../src/business-logic/services/CacheService";
import UserService from "../../../src/business-logic/services/UserService";


// Mock the ApiService class
jest.mock('../../../src/business-logic/services/APIService');
// jest.mock('../../../src/business-logic/services/UserService');

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
        firstConnection: true,
      };

      // Mock the ApiService.post method to return the created user
      const createdUser: IUser = { ...user, id: '1234567890' };
      (APIService.post as jest.MockedFunction<typeof APIService.post>).mockResolvedValue(createdUser);

      // Call the createUser method
      const result = await UserService.getInstance().createUser(user);

      // Expect the ApiService.post method to have been called with the correct arguments
      expect(APIService.post).toHaveBeenCalledWith('users', user);

      // Expect the result to match the created user
      expect(result).toEqual(createdUser);
    });

    it('should throw an error if ApiService.post throws an error', async () => {
      // Mock ApiService.post to throw an error
      const error = new Error('Failed to create user');
      (APIService.post as jest.MockedFunction<typeof APIService.post>).mockRejectedValue(error);

      // Call createUser and expect it to throw an error
      await expect(UserService.getInstance().createUser({} as IUser)).rejects.toThrowError(error);
    });
  });

  // Test suite for the getUsers method
  describe('getUsers', () => {
    it('should fetch users from the API', async () => {
      // Mock the token retrieval from CacheService
      const mockToken = { value: 'mockTokenValue' };
      jest.spyOn(CacheService.getInstance(), 'retrieveValue').mockResolvedValueOnce(mockToken);
  
      // Mock the response from the API
      const mockUser: IUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'john.doe',
        password: 'password',
        firstConnection: true,
        userType: UserType.Client,
      };
      const mockUsers = [mockUser];
      jest.spyOn(APIService, 'get').mockResolvedValueOnce(mockUsers);
  
      // Call the getUsers method
      const users = await UserService.getInstance().getUsers();
  
      // Assertions
      expect(CacheService.getInstance().retrieveValue).toHaveBeenCalledWith('currentUserToken');
      expect(APIService.get).toHaveBeenCalledWith('users', mockToken.value);
      expect(users).toEqual(mockUsers);
    });
  });

  describe('getUserByID', () => {
    it('should fetch a user by ID from the API', async () => {
      // Mock the token retrieval from CacheService
      const mockToken = { value: 'mockTokenValue' };
      jest.spyOn(CacheService.getInstance(), 'retrieveValue').mockResolvedValueOnce(mockToken);
  
      // Mock the response from the API
      const userId = '1';
      const mockUser: IUser = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'john.doe',
        password: 'password',
        firstConnection: true,
        userType: UserType.Client,
      };
      jest.spyOn(APIService, 'get').mockResolvedValueOnce(mockUser);
  
      // Call the getUserByID method
      const user = await UserService.getInstance().getUserByID(userId);
  
      // Assertions
      expect(CacheService.getInstance().retrieveValue).toHaveBeenCalledWith('currentUserToken');
      expect(APIService.get).toHaveBeenCalledWith(`users/${userId}`, mockToken.value);
      expect(user).toEqual(mockUser);
    });
  });

  describe('changePassword', () => {
    it('should change user password successfully', async () => {
      const mockToken: IToken = { value: 'mockTokenValue', user: { id: '1' } };
      // Mock the retrieveValue method of CacheService
      jest.spyOn(CacheService.getInstance(), 'retrieveValue').mockResolvedValueOnce('1');
      jest.spyOn(CacheService.getInstance(), 'retrieveValue').mockResolvedValueOnce(mockToken);

      // Mock the put method of APIService
      jest.spyOn(APIService, 'put').mockResolvedValueOnce(undefined);

      // Call the changePassword method
      await UserService.getInstance().changePassword('oldPassword', 'newPassword');

      // Assertions
      expect(CacheService.getInstance().retrieveValue).toHaveBeenCalledWith('currentUserID');
      expect(CacheService.getInstance().retrieveValue).toHaveBeenCalledWith('currentUserToken');
      expect(APIService.put).toHaveBeenCalledWith('users/1/changePassword', { currentPassword: 'oldPassword', newPassword: 'newPassword' }, mockToken.value);
    });
  });

  describe('setUserFirstConnectionToFalse', () => {
    it('should update the user first connection parameter', async () => {
      // Mock the dependencies
      const userID = '123'; // Mocked user ID
      const mockToken: IToken = { value: 'mockTokenValue', user: { id: userID } };
      jest.spyOn(CacheService.getInstance(), 'retrieveValue')
        .mockResolvedValueOnce(userID)
        .mockResolvedValueOnce(mockToken);
  
      const putSpy = jest.spyOn(APIService, 'put').mockResolvedValueOnce(undefined);
  
      // Call the method
      await UserService.getInstance().setUserFirstConnectionToFalse();
  
      // Assertions
      expect(putSpy).toHaveBeenCalledWith(
        `users/${userID}/setFirstConnectionToFalse`,
        null,
        mockToken.value
      );
    });
  });
  
});

