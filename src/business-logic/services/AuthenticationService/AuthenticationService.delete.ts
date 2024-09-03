import CacheKeys from "../../model/enums/CacheKeys";
import IToken from "../../model/IToken";
import APIService from "../APIService";
import CacheService from "../CacheService";
import AuthenticationService from "./AuthenticationService";
import AuthenticationServiceGet from "./AuthenticationService.get";

class AuthenticationServiceDelete extends AuthenticationService {
  static baseRoute = 'tokens';

  /**
   * Logs out the user with the provided token.
   * @param token - The authentication token of the user.
   * @throws If an error occurs during the logout process.
   */
  static async logout(token: IToken | null) {
    try {
      await APIService.delete(`${this.baseRoute}/${token?.id}`);
      await CacheService.getInstance().removeValueAt(CacheKeys.currentUserID);
      await CacheService.getInstance().removeValueAt(CacheKeys.currentUserToken);
    } catch (error) {
      // TODO: Remove all console.log
      console.log('Error logging user out', error);
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
  static async removeTokenForUser(userID: string, adminToken: IToken | null) {
    try {
      const tokens = await AuthenticationServiceGet.getTokens(adminToken);
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
}

export default AuthenticationServiceDelete;