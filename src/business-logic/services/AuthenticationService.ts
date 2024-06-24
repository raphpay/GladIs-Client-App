import IToken from '../model/IToken';
import CacheKeys from '../model/enums/CacheKeys';
import APIService from './APIService';
import CacheService from './CacheService';

/**
 * Represents the AuthenticationService class responsible for handling authentication-related operations.
 */
class AuthenticationService {
  private static instance: AuthenticationService | null = null;
  private baseRoute = 'tokens';

  private constructor() {}

  /**
   * Gets the instance of the AuthenticationService class.
   * @returns The instance of the AuthenticationService class.
   */
  static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  /**
   * Logs in a user with the provided username and password.
   * @param username - The username of the user.
   * @param password - The password of the user.
   * @returns A Promise that resolves to the authentication token.
   * @throws If an error occurs during the login process.
   */
  async login(username: string, password: string): Promise<IToken> {
    let token: IToken;
    try {
      token = await APIService.login<IToken>(`${this.baseRoute}/login`, username, password);
      await CacheService.getInstance().storeValue<string>(CacheKeys.currentUserID, token.user.id);
      await CacheService.getInstance().storeValue<IToken>(CacheKeys.currentUserToken, token);
      return token;
    } catch (error: any) {
      console.log('Error logging user with username:', username, error.message);
      throw error;
    }
  }

  /**
   * Logs out the user with the provided token.
   * @param token - The authentication token of the user.
   * @throws If an error occurs during the logout process.
   */
  async logout(token: IToken | null) {
    try {
      await APIService.delete(`${this.baseRoute}/${token?.id}`);
      await CacheService.getInstance().clearStorage();
    } catch (error) {
      // TODO: Remove all console.log
      console.log('Error logging user out', error);
      throw error;
    }
  }

  /**
   * Gets the authentication token for the user.
   * @param adminToken - The admin token for authentication.
   * @returns A Promise that resolves to the authentication token.
   * @throws If an error occurs during the token retrieval process.
   */
  async getTokens(adminToken: IToken | null) {
    try {
      const tokens = await APIService.get<IToken[]>(this.baseRoute, adminToken?.value);
      return tokens;
    } catch (error) {
      console.log('Error getting tokens', error);
      throw error;
    }
  }

  /**
   * Removes the authentication token for the user.
   * @param userID - The ID of the user.
   * @param adminToken - The admin token for authentication.
   * @throws If an error occurs during the token removal process.
   * @returns A Promise that resolves when the token is removed.
   */
  async removeTokenForUser(userID: string, adminToken: IToken | null) {
    try {
      const tokens = await this.getTokens(adminToken);
      if (tokens && tokens.length !== 0) {
        for (const token of tokens) {
          if (token.user.id === userID) {
            await APIService.delete(`${this.baseRoute}/${token.id}`);
          } else {
            console.log('User is not authenticated, no need to remove its token');
          }
        }
      }
    } catch (error) {
      console.log('Error removing token for user', error);
      throw error;
    }
  }

  /**
   * Checks the authentication status of the user.
   * @returns A Promise that resolves to the authentication token.
   * @throws If an error occurs during the authentication check.
   */
  async checkAuthentication(): Promise<IToken> {
    try {
      const cachedToken = await CacheService.getInstance().retrieveValue(CacheKeys.currentUserToken) as IToken;
      if (cachedToken !== null) {
        const token = await APIService.get<IToken>(`${this.baseRoute}/${cachedToken.id}`);
        const cachedUserID = await CacheService.getInstance().retrieveValue(CacheKeys.currentUserID) as string;
        if (token.user.id === cachedUserID) {
          return token;
        } else {
          throw new Error('User is not authenticated');
        }
      } else {
        throw new Error('User is not authenticated');
      }
    } catch (error) {
      console.log('Error checking user authentication status', error);
      throw error;
    }
  }
}

export default AuthenticationService;
