import IUser from '../../../src/business-logic/model/IUser';
import UserType from '../../../src/business-logic/model/enums/UserType';
import APIService from '../../../src/business-logic/services/APIService';

describe('APIService', () => {
  describe('get', () => {
    it('should fetch users from the API', async () => {
      // Mock the response from the API
      const mockUser: IUser = {
        id: '1',
        phoneNumber: '123456',
        firstName: 'John',
        lastName: 'Doe',
        companyName: 'Acme.Inc',
        email: 'john@example.com',
        username: 'john.doe',
        password: 'password',
        firstConnection: true,
        userType: UserType.Client,
      }
      const mockUsers = [mockUser];
      const mockResponse = {
        ok: true,
        json: async () => mockUsers,
      };
      // Mock the fetch function
      jest.spyOn(global, 'fetch').mockResolvedValueOnce(mockResponse as any);

      // Call the get method
      const users = await APIService.get<IUser[]>('users', 'mockToken');

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mockToken',
        },
      });
      expect(users).toEqual(mockUsers);
    });

    it('should throw an error if the API call fails', async () => {
      // Mock the response from the API
      const mockErrorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      };
      // Mock the fetch function
      jest.spyOn(global, 'fetch').mockResolvedValueOnce(mockErrorResponse as any);

      // Call the get method
      await expect(APIService.get<IUser[]>('users', 'mockToken')).rejects.toThrowError('HTTP error! Status: 500');
    });
  });

  describe('post', () => {
    it('should send data to the API and return the response', async () => {
      // Mock data to be sent to the API
      const postData = { firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      // Mock the response from the API
      const mockResponseData = { id: '1', ...postData }; // Mock response with an ID added
      const mockResponse = {
        ok: true,
        json: async () => mockResponseData,
      };
      // Mock the fetch function
      jest.spyOn(global, 'fetch').mockResolvedValueOnce(mockResponse as any);

      // Call the post method
      const createdUser = await APIService.post<IUser>('users', postData, 'mockToken');

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mockToken',
        },
        body: JSON.stringify(postData),
      });
      expect(createdUser).toEqual(mockResponseData);
    });

    it('should throw an error if the API call fails', async () => {
      // Mock data
      const postData = { /* Data to be sent to the API */ };
      // Mock the response from the API
      const mockErrorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      };
      // Mock the fetch function
      jest.spyOn(global, 'fetch').mockResolvedValueOnce(mockErrorResponse as any);

      // Call the post method and expect it to throw an error
      await expect(APIService.post<IUser>('users', postData, 'mockToken')).rejects.toThrowError('HTTP error! Status: 500');
    });
  });

  describe('login', () => {
    it('should send login credentials to the API and return the response', async () => {
      // Mock login credentials
      const username = 'testuser';
      const password = 'testpassword';
      // Mock the response from the API
      const mockResponseData = { /* Mocked response data */ };
      const mockResponse = {
        ok: true,
        json: async () => mockResponseData,
      };
      // Mock the fetch function
      jest.spyOn(global, 'fetch').mockResolvedValueOnce(mockResponse as any);

      // Call the login method
      const loginResponse = await APIService.login<any>('login', username, password);

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic dGVzdHVzZXI6dGVzdHBhc3N3b3Jk', // Base64 encoded username:password
        },
      });
      expect(loginResponse).toEqual(mockResponseData);
    });

    it('should throw an error if the API call fails', async () => {
      // Mock login credentials
      const username = 'testuser';
      const password = 'testpassword';
      // Mock the response from the API
      const mockErrorResponse = {
        ok: false,
        status: 401, // Unauthorized
        statusText: 'Unauthorized',
      };
      // Mock the fetch function
      jest.spyOn(global, 'fetch').mockResolvedValueOnce(mockErrorResponse as any);

      // Call the login method and expect it to throw an error
      await expect(APIService.login<any>('login', username, password)).rejects.toThrowError('HTTP error! Status: 401');
    });
  });

  describe('put', () => {
    it('should send data to the API using the PUT method and return the response', async () => {
      // Mock data and token
      const data = { /* Mocked data */ };
      const token = 'mockToken';
      // Mock the response from the API
      const mockResponseData = { /* Mocked response data */ };
      const mockResponse = {
        ok: true,
        json: async () => mockResponseData,
      };
      // Mock the fetch function
      jest.spyOn(global, 'fetch').mockResolvedValueOnce(mockResponse as any);

      // Call the put method
      const putResponse = await APIService.put('endpoint', data, token);

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/endpoint', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mockToken',
        },
        body: JSON.stringify(data),
      });
      expect(putResponse).toEqual(mockResponseData);
    });

    it('should throw an error if the API call fails', async () => {
      // Mock data and token
      const data = { /* Mocked data */ };
      const token = 'mockToken';
      // Mock the response from the API
      const mockErrorResponse = {
        ok: false,
        status: 404, // Not Found
        statusText: 'Not Found',
      };
      // Mock the fetch function
      jest.spyOn(global, 'fetch').mockResolvedValueOnce(mockErrorResponse as any);

      // Call the put method and expect it to throw an error
      await expect(APIService.put('endpoint', data, token)).rejects.toThrowError('HTTP error! Status: 404');
    });
  });
});
