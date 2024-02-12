import IToken from '../model/IToken';
import CacheKeys from '../model/enums/CacheKeys';
import APIService from './APIService';
import CacheService from './CacheService';

class AuthenticationService {
  private static instance: AuthenticationService | null = null;

  private constructor() {}

  static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  // Login
  async login(username: string, password: string): Promise<IToken> {
    let token: IToken;
    try {
      token = await APIService.login<IToken>('users/login', username, password);
      await CacheService.getInstance().storeValue<string>(CacheKeys.currentUserID, token.user.id);
      await CacheService.getInstance().storeValue<IToken>(CacheKeys.currentUserToken, token);
      return token
    } catch (error) {
      console.error('Error logging user with username:', username, error);
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      await CacheService.getInstance().removeValueAt(CacheKeys.currentUserID);
      await CacheService.getInstance().removeValueAt(CacheKeys.currentUserToken);
    } catch (error) {
      console.error('Error logging user out', error);
      throw error;
    }
  }

  // Authentication check
  async checkAuthentication(): Promise<IToken | null> {
    let authToken: IToken | null = null;
    try {
      const cachedToken = await CacheService.getInstance().retrieveValue(CacheKeys.currentUserToken) as IToken;
      const token = await APIService.get<IToken>(`tokens/${cachedToken.id}`);
      const cachedUserID = await CacheService.getInstance().retrieveValue(CacheKeys.currentUserID) as string;
      if (token.user.id === cachedUserID) {
        authToken = token
      }
    } catch (error) {
      console.log('Error checking user authentication status', error);
      throw error;
    }

    return authToken;
  }
}

export default AuthenticationService;
