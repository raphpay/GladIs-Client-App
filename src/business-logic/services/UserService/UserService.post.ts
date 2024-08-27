import IFolder, { IFolderUserRecordInput } from "../../model/IFolder";
import IToken from "../../model/IToken";
import APIService from "../APIService";
import UserService from "../UserService";

class UserServicePost extends UserService {
  static baseRoute = 'users';

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