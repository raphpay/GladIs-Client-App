// Import the AuthenticationService and the mock functions
import APIService from '../../../src/business-logic/services/APIService';
import AuthenticationService from '../../../src/business-logic/services/AuthenticationService';
import CacheService from '../../../src/business-logic/services/CacheService';

// Mock the APIService.login function
jest.mock('../../../src/business-logic/services/APIService', () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
  },
}));

// Mock the CacheService.getInstance().storeValue function
jest.mock('../../../src/business-logic/services/CacheService', () => ({
  __esModule: true,
  default: {
    getInstance: jest.fn(() => ({
      storeValue: jest.fn(),
    })),
  },
}));

// jest.mock('../../../src/business-logic/services/APIService');
// jest.mock('../../../src/business-logic/services/CacheService');

// Your test case
describe('AuthenticationService', () => {
  it('should login successfully and store user data in cache', async () => {
    // Mock data
    const mockUsername = 'mockUsername';
    const mockPassword = 'mockPassword';
    const mockToken = { user: { id: 'mockUserId' } };

    // Mock the login function to resolve with the mock token
    // APIService.login.mockResolvedValue(mockToken);

    // Run the login function
    await AuthenticationService.getInstance().login(mockUsername, mockPassword);

    // Verify that APIService.login was called with the correct arguments
    expect(APIService.login).toHaveBeenCalledWith('users/login', mockUsername, mockPassword);

    // Verify that CacheService.getInstance().storeValue was called with the correct arguments
    expect(CacheService.getInstance().storeValue).toHaveBeenCalledWith('currentUserID', mockToken.user.id);
    expect(CacheService.getInstance().storeValue).toHaveBeenCalledWith('currentUserToken', mockToken);
  });
});
