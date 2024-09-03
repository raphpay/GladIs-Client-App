import IModule from "../../model/IModule";
import IPendingUser from "../../model/IPendingUser";
import IToken from "../../model/IToken";
import IUser from "../../model/IUser";
import { extractValidationErrors } from "../../model/ValidationError";
import APIService from "../APIService";
import PendingUserService from "./PendingUserService";
import PendingUserServicePut from "./PendingUserService.put";

class PendingUserServicePost extends PendingUserService {
  static baseRoute = 'pendingUsers';

  /**
   * Converts a pending user to a regular user.
   * @param id - The ID of the pending user.
   * @param token - The authentication token.
   * @returns A promise that resolves to the converted user.
   * @throws If there is an error converting the pending user.
   */
  static async convertPendingUserToUser(id: string, token: IToken): Promise<IUser> {
    try {
      const newUser = await APIService.post<IUser>(`${this.baseRoute}/${id}/convertToUser`, null, token.value);
      return newUser;
    } catch (error) {
      const errorMessage = (error as Error).message;
      const errorKeys = extractValidationErrors(errorMessage);
      throw errorKeys;
    }
  }

  /**
   * Asks for sign up for a pending user.
   * @param pendingUser - The pending user object.
   * @param modules - The modules to add to the pending user.
   * @returns A promise that resolves to the added pending user.
   * @throws If there is an error asking for sign up.
   */
  static async askForSignUp(pendingUser: IPendingUser, modules: IModule[]): Promise<IPendingUser> {
    try {
      const userAdded = await APIService.post<IPendingUser>(this.baseRoute, pendingUser);
      await PendingUserServicePut.addModulesToPendingUser(modules, userAdded);
      return userAdded;
    } catch (error) {
      const errorMessage = (error as Error).message
      const errorKeys = extractValidationErrors(errorMessage);
      throw errorKeys;
    }
  }
}

export default PendingUserServicePost;