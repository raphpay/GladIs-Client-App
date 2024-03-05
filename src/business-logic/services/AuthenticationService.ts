import IToken from '../model/IToken';
import CacheKeys from '../model/enums/CacheKeys';
import APIService from './APIService';
import CacheService from './CacheService';

class AuthenticationService {
  private static instance: AuthenticationService | null = null;
  private baseRoute = 'tokens';
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
      token = await APIService.login<IToken>(`${this.baseRoute}/login`, username, password);
      await CacheService.getInstance().storeValue<string>(CacheKeys.currentUserID, token.user.id);
      await CacheService.getInstance().storeValue<IToken>(CacheKeys.currentUserToken, token);
      return token
    } catch (error) {
      console.log('Error logging user with username:', username, error);
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      // TODO: remove token on the API too
      await CacheService.getInstance().removeValueAt(CacheKeys.currentUserID);
      await CacheService.getInstance().removeValueAt(CacheKeys.currentUserToken);
    } catch (error) {
      console.error('Error logging user out', error);
      throw error;
    }
  }

  // Authentication check
  async checkAuthentication(): Promise<IToken> {
    try {
      const cachedToken = await CacheService.getInstance().retrieveValue(CacheKeys.currentUserToken) as IToken;
      const token = await APIService.get<IToken>(`${this.baseRoute}/${cachedToken.id}`);
      const cachedUserID = await CacheService.getInstance().retrieveValue(CacheKeys.currentUserID) as string;
      if (token.user.id === cachedUserID) {
        return token
      } else {
        throw new Error('The user is not connected')
      }
    } catch (error) {
      console.log('Error checking user authentication status', error);
      throw error;
    }

  }
}

export default AuthenticationService;
