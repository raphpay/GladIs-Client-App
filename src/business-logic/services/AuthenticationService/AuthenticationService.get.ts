import CacheKeys from "../../model/enums/CacheKeys";
import IToken from "../../model/IToken";
import APIService from "../APIService";
import CacheService from "../CacheService";
import AuthenticationService from "./AuthenticationService";

class AuthenticationServiceGet extends AuthenticationService {
  static baseRoute = 'tokens';

  /**
   * Gets the authentication token for the user.
   * @param adminToken - The admin token for authentication.
   * @returns A Promise that resolves to the authentication token.
   * @throws If an error occurs during the token retrieval process.
   */
  static async getTokens(adminToken: IToken | null) {
    try {
      const tokens = await APIService.get<IToken[]>(this.baseRoute, adminToken?.value);
      return tokens;
    } catch (error) {
      console.log('Error getting tokens', error);
      throw error;
    }
  }

  /**
   * Checks the authentication status of the user.
   * @returns A Promise that resolves to the authentication token.
   * @throws If an error occurs during the authentication check.
   */
  static async checkAuthentication(): Promise<IToken> {
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

export default AuthenticationServiceGet;