import IToken from "../model/IToken";
import APIService from "./APIService";
import UserService from "./UserService";

class UserServiceRead extends UserService {
  static baseRoute = 'users';

  /**
   * Get the system quality folders for the user
   * @param userID The user ID
   * @param token The token
   * @returns The system quality folders
   * @throws Error
   */
  static async getSystemQualityFolders(userID: string, token: IToken | null): Promise<IFolder[]> {
    try {
      const folder = await APIService.get<IFolder[]>(`${this.baseRoute}/${userID}/folders/systemQuality`, token?.value as string);
      return folder;
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
  static async getRecordsFolders(userID: string, token: IToken | null): Promise<IFolder[]> {
    try {
      const folder = await APIService.get<IFolder[]>(`${this.baseRoute}/${userID}/folders/records`, token?.value as string);
      return folder;
    } catch (error) {
      throw error;
    }
  }
}

export default UserServiceRead;