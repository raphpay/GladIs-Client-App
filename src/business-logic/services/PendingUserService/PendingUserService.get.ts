import IModule from "../../model/IModule";
import IPendingUser from "../../model/IPendingUser";
import IPotentialEmployee from "../../model/IPotentialEmployee";
import IToken from "../../model/IToken";
import APIService from "../APIService";
import PendingUserService from "./PendingUserService";

class PendingUserServiceGet extends PendingUserService {
  static baseRoute = 'pendingUsers';

  /**
   * Retrieves all pending users.
   * @param token - The authentication token.
   * @returns A promise that resolves to an array of pending users.
   * @throws If there is an error retrieving the pending users.
   */
  static async getUsers(token: IToken): Promise<IPendingUser[]> {
    try {
      const pendingUsers = await APIService.get<IPendingUser[]>(this.baseRoute, token.value);
      return pendingUsers;
    } catch (error) {
      console.log('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Retrieves the module IDs of a pending user.
   * @param id - The ID of the pending user.
   * @returns A promise that resolves to an array of module IDs.
   * @throws If there is an error retrieving the module IDs.
   */
  static async getPendingUsersModules(id: string): Promise<IModule[]> {
    try {
      let moduleIDs: string[] = [];
      const modules = await APIService.get<IModule[]>(`${this.baseRoute}/${id}/modules`);
      return modules;
    } catch (error) {
      console.log('Error getting pending user\'s modules for id:', id, error);
      throw error;
    }
  }

  /**
   * Retrieves the potential employees of a pending user.
   * @param id - The ID of the pending user.
   * @param token - The authentication token.
   * @returns A promise that resolves to an array of potential employees.
   * @throws If there is an error retrieving the potential employees.
   */
  static async getPotentialEmployees(id: string | undefined, token: IToken | null): Promise<IPotentialEmployee[]> {
    try {
      const employees = await APIService.get<IPotentialEmployee[]>(`${this.baseRoute}/${id}/employees`, token?.value);
      return employees;
    } catch (error) {
      console.log('Error getting pending user\'s employees for id:', id, error);
      throw error;
    }
  }
}

export default PendingUserServiceGet;