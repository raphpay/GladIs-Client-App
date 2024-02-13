import fetchMock from 'jest-fetch-mock';

import IToken from '../../../src/business-logic/model/IToken';
import APIService from '../../../src/business-logic/services/APIService';
import AuthenticationService from '../../../src/business-logic/services/AuthenticationService';

fetchMock.enableMocks();

jest.mock('../../../src/business-logic/services/CacheService', () => ({
  getInstance: jest.fn(() => ({
    storeValue: jest.fn(),
    removeValueAt: jest.fn(),
    retrieveValue: jest.fn(),
  })),
}));

jest.mock('../../../src/business-logic/services/APIService', () => ({
  login: jest.fn(),
  get: jest.fn(),
}));

describe('AuthenticationService', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('logs in a user and stores token and user ID in cache', async () => {
      const username = 'testuser';
      const password = 'testpassword';
      const token: IToken = { id: 'token_id', value: 'token_value', user: { id: 'user_id' } };

      (APIService.login as jest.Mock).mockResolvedValue(token);

      await AuthenticationService.getInstance().login(username, password);

      expect(APIService.login).toHaveBeenCalledWith('tokens/login', username, password);
    });

    it('throws an error if login fails', async () => {
      const username = 'testuser';
      const password = 'testpassword';
      const error = new Error('Failed to login');

      (APIService.login as jest.Mock).mockRejectedValue(error);

      await expect(AuthenticationService.getInstance().login(username, password)).rejects.toThrow('Failed to login');

      expect(APIService.login).toHaveBeenCalledWith('tokens/login', username, password);
    });
  });
});
