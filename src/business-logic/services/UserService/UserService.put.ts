import IModule, { IModuleInput } from "../../model/IModule";
import IToken from "../../model/IToken";
import IUser, { IUserUpdateInput } from "../../model/IUser";
import APIService from "../APIService";
import UserService from "./UserService";

class UserServicePut extends UserService {
  static baseRoute = 'users';

  /**
   * Updates the user.
   * @param user - The user to update.
   * @param token - The authentication token.
   */
  static async updateUser(user: IUser, token: IToken | null): Promise<void> {
    try {
      await APIService.put(`${this.baseRoute}/${user.id}/updateInfos/`, user, token?.value as string);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the user.
   * @param userID - The user to update.
   * @param input - The input to change the user informations
   * @param token - The authentication token.
   * @returns - The updated user as a IUser object
   */
  static async updateUserInfos(userID: string, input: IUserUpdateInput, token: IToken | null): Promise<IUser> {
    try {
      const updatedUser = await APIService.put(`${this.baseRoute}/${userID}/updateInfos/`, input, token?.value as string);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds a module array to a user.
   * @param id - The ID of the user.
   * @param modules - The modules to add to the user.
   * @param token - The authentication token.
   * @returns A promise that resolves to the updated user.
   * @throws If an error occurs while adding the modules to the user.
   */
  static async updateModules(id: string, modules: IModule[], token: IToken | null) {
    let modInputs: IModuleInput[] = [];
    for (const module of modules) {
      // Create the input
      const moduleInput: IModuleInput = {
        name: module.name,
        index: module.index,
      };
      modInputs.push(moduleInput);
    }
    
    // Add the modules to the user
    try {
      const route = `${this.baseRoute}/${id}/modules`;
      await APIService.put(route, modInputs, token?.value as string);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Changes the password of the current user.
   * @param userID - The ID of the user.
   * @param currentPassword - The current password.
   * @param newPassword - The new password.
   * @param token - The authentication token.
   * @returns A promise that resolves when the password is changed.
   * @throws If an error occurs while changing the user's password.
   */
  static async changePassword(userID: string, currentPassword: string, newPassword: string, token: IToken | null): Promise<void> {
    try {
      await APIService.put(`${this.baseRoute}/${userID}/changePassword`, { currentPassword, newPassword }, token?.value as string);
    } catch (error) {
      throw error;
    }
  }

   /**
   * Sets the first connection parameter of the current user to false.
   * @param userID - The ID of the user.
   * @param token - The authentication token.
   * @returns A promise that resolves when the first connection parameter is changed.
   * @throws If an error occurs while changing the user's first connection parameter.
   */
   static async setUserFirstConnectionToFalse(userID: string, token: IToken | null): Promise<void> {
    try {
      await APIService.put(`${this.baseRoute}/${userID}/setFirstConnectionToFalse`, null, token?.value as string);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds a manager to a user.
   * @param userID - The ID of the user.
   * @param managerID - The ID of the manager.
   * @param token - The authentication token.
   * @throws If an error occurs while adding the manager to the user.
   */
  static async addManagerToUser(userID: string, managerID: string, token: IToken | null) {
    try {
      await APIService.put(`${this.baseRoute}/${userID}/addManager/${managerID}`, null, token?.value as string);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Blocks a user.
   * @param clientID - The ID of the user to block.
   * @param token - The authentication token.
   */
  static async blockUser(clientID: string, token: IToken | null) {
    try {
      await APIService.put(`${this.baseRoute}/${clientID}/block`, null, token?.value as string);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Unblocks a user.
   * @param clientID - The ID of the user to unblock.
   * @param token - The authentication token.
   */
  static async unblockUser(clientID: string, token: IToken | null) {
    try {
      await APIService.put(`${this.baseRoute}/${clientID}/unblock`, null, token?.value as string);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Removes an employee from a manager.
   * @param managerID - The ID of the manager.
   * @param employeeID - The ID of the employee.
   * @param token - The authentication token.
   * @returns The updated manager.
   * @throws If an error occurs while removing the employee from the manager.
   */
  static async removeEmployeeFromManager(managerID: string, employeeID: string, token: IToken | null): Promise<IUser> {
    try {
      const manager = await APIService.put(`${this.baseRoute}/${managerID}/remove/${employeeID}`, null, token?.value as string);
      return manager;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Block user connection
   * @param userID - The ID of the user to block.
   * @returns The number of connection failed attempts.
   * @throws If an error occurs while blocking the user connection.
   */
  static async blockUserConnection(userID: string): Promise<number> {
    try {
      const route = `${this.baseRoute}/${userID}/block/connection`;
      const user = await APIService.put(route);
      return user.connectionFailedAttempts;
    } catch (error) {
      throw error;
    }
  }
}

export default UserServicePut;