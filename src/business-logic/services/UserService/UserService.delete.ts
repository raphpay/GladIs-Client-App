import IToken from "../../model/IToken";
import APIService from "../APIService";
import UserService from "../UserService";

class UserServiceDelete extends UserService {
  static baseRoute = 'users';

  /**
   * Removes a user.
   * @param id - The ID of the user to remove.
   * @param token - The authentication token.
   * @throws If an error occurs while removing the user.
   * @returns A promise that resolves when the user is removed.
   */
  static async removeUser(id: string, token: IToken | null): Promise<void> {
    try {
      await APIService.delete(`${this.baseRoute}/${id}`, token?.value as string);
    } catch (error) {
      throw error;
    }
  }
}

export default UserServiceDelete;