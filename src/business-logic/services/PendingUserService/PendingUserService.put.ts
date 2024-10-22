import IModule, { IModuleInput } from "../../model/IModule";
import IPendingUser from "../../model/IPendingUser";
import IToken from "../../model/IToken";
import APIService from "../APIService";
import PendingUserService from "./PendingUserService";

class PendingUserServicePut extends PendingUserService {
  static baseRoute = 'pendingUsers';

  /**
   * Updates the status of a pending user.
   * @param pendingUser - The pending user object.
   * @param token - The authentication token.
   * @param status - The new status for the pending user.
   * @throws If there is an error updating the pending user status.
   */
  static async updatePendingUserStatus(pendingUser: IPendingUser, token: IToken | null, status: string) {
    try {
      const id = pendingUser.id as string;
      await APIService.put(`${this.baseRoute}/${id}/status`, { "type": status }, token?.value);
    } catch (error) {
      throw error;
    }
  }

  static async addModulesToPendingUser(modules: IModule[], pendingUser: IPendingUser) {
    let modInputs: IModuleInput[] = [];
    for (const module of modules) {
      // Create the input
      const moduleInput: IModuleInput = {
        name: module.name,
        index: module.index,
      };
      modInputs.push(moduleInput);
    }

    try {
      const route = `${this.baseRoute}/${pendingUser.id}/modules`;
      await APIService.put(route, modInputs)
    } catch (error) {
      throw error;
    }
  }
}

export default PendingUserServicePut;