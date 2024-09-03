import IToken from "../../model/IToken";
import APIService from "../APIService";
import PendingUserService from "./PendingUserService";

class PendingUserServiceDelete extends PendingUserService {
  static baseRoute = 'pendingUsers';

  /**
   * Removes a pending user.
   * @param id - The ID of the pending user.
   * @param token - The authentication token.
   * @throws If there is an error deleting the pending user.
   */
  static async removePendingUser(id: string | undefined, token: IToken | null) {
    try {
      await APIService.delete(`${this.baseRoute}/${id}`, token?.value);
    } catch (error) {
      throw error;
    }
  }
}

export default PendingUserServiceDelete;