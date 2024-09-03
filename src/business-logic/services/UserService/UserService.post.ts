import IFolder, { IFolderUserRecordInput } from "../../model/IFolder";
import ITechnicalDocTab from "../../model/ITechnicalDocumentationTab";
import IToken from "../../model/IToken";
import IUser, { ILoginTryOutput } from "../../model/IUser";
import { extractValidationErrors } from "../../model/ValidationError";
import APIService from "../APIService";
import UserService from "../UserService";

class UserServicePost extends UserService {
  static baseRoute = 'users';

  /**
   * Creates a new user.
   * @param user - The user object to create.
   * @returns A promise that resolves to the created user.
   * @throws If an error occurs while creating the user.
   */
  static async createUser(user: IUser, token: IToken | null): Promise<IUser> {
    try {
      const createdUser = await APIService.post<IUser>(this.baseRoute, user, token?.value as string);
      return createdUser;
    } catch (error) {
      const errorMessage = (error as Error).message;
      const errorKeys = extractValidationErrors(errorMessage);
      throw errorKeys;
    }
  }

  /**
   * Adds a technical documentation tab to a user.
   * @param clientID - The ID of the client user.
   * @param tab - The technical documentation tab to add.
   * @param token - The authentication token.
   * @throws If an error occurs while adding the tab to the user.
   */
  static async addTabToUser(clientID: string | undefined, tab: ITechnicalDocTab, token: IToken | null) {
    try {
      const castedID = clientID as string;
      const tabID = tab.id as string;
      const tokenValue = token?.value as string;
      const linkedTab = await APIService.post<ITechnicalDocTab>(`${this.baseRoute}/${castedID}/technicalDocumentationTabs/${tabID}`, null, tokenValue);
    } catch (error) {
      console.log('Error linking user:', clientID, 'to tab:', tab.name, error);
      throw error;
    }
  }

  /**
   * Verify the password of a user.
   * @param userID - The ID of the user.
   * @param password - The password to verify.
   * @param token - The authentication token.
   * @returns A promise that resolves to true if the password is valid, false otherwise.
   * @throws If an error occurs while verifying the password.
   */
  static async verifyPassword(userID: string, password: string, token: IToken | null): Promise<boolean> {
    let isValid = false;
    try {
      await APIService.postWithoutResponse(`${this.baseRoute}/${userID}/verifyPassword`, { currentPassword: password }, token?.value as string);
      isValid = true;
    } catch (error) {
      console.log('Error verifying password', error);
      throw error;
    }
    return isValid;
  }

  /**
   * Retrieves a user by email.
   * @param email - The email of the user.
   * @param token - The authentication token.
   * @returns A promise that resolves to the user.
   * @throws If an error occurs while retrieving the user.
   */
  static async getUserByEmail(email: string, token: IToken | null): Promise<IUser> {
    try {
      const user = await APIService.post<IUser>(`${this.baseRoute}/byMail`, { email }, token?.value as string);
      return user;
    } catch (error) {
      const errorMessage = (error as Error).message
      const errorKeys = extractValidationErrors(errorMessage);
      throw errorKeys;
    }
  }

  /**
   * Retrieves the login try output of a user.
   * @param username - The username of the user.
   * @returns A promise that resolves to the login try output.
   * @throws If an error occurs while retrieving the login try output.
   */
  static async getUserLoginTryOutput(username: string): Promise<ILoginTryOutput> {
    try {
      const route = `${this.baseRoute}/userLoginTry`;
      const output = await APIService.post<ILoginTryOutput>(route, { username });
      return output;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the records folders for the user
   * @param userID The user ID
   * @param token The token
   * @returns The records folders
   * @throws Error
   */
  static async getRecordsFolders(userID: string, token: IToken | null, pathInput: IFolderUserRecordInput): Promise<IFolder[]> {
    try {
      const folders = await APIService.post(`${this.baseRoute}/${userID}/folders/records`, pathInput, token?.value as string) as IFolder[];
      return folders;
    } catch (error) {
      throw error;
    }
  }
}

export default UserServicePost;