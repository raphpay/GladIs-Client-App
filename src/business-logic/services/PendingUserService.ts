import IModule, { IModuleInput } from '../model/IModule';
import IPendingUser from '../model/IPendingUser';
import IPotentialEmployee from '../model/IPotentialEmployee';
import IToken from '../model/IToken';
import IUser from '../model/IUser';
import { extractValidationErrors } from '../model/ValidationError';
import CacheKeys from '../model/enums/CacheKeys';
import APIService from './APIService';
import CacheService from './CacheService';

/**
 * Service class for managing pending users.
 */
class PendingUserService {
  private static instance: PendingUserService | null = null;
  private baseRoute = 'pendingUsers';

  private constructor() {}

  /**
   * Returns the singleton instance of the PendingUserService class.
   * @returns The singleton instance of the PendingUserService class.
   */
  static getInstance(): PendingUserService {
    if (!PendingUserService.instance) {
      PendingUserService.instance = new PendingUserService();
    }
    return PendingUserService.instance;
  }

  // CREATE
  /**
   * Converts a pending user to a regular user.
   * @param id - The ID of the pending user.
   * @param token - The authentication token.
   * @returns A promise that resolves to the converted user.
   * @throws If there is an error converting the pending user.
   */
  async convertPendingUserToUser(id: string, token: IToken): Promise<IUser> {
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
  async askForSignUp(pendingUser: IPendingUser, modules: IModule[]): Promise<IPendingUser> {
    try {
      const userAdded = await APIService.post<IPendingUser>(this.baseRoute, pendingUser);
      await this.addModulesToPendingUser(modules, userAdded);
      return userAdded;
    } catch (error) {
      const errorMessage = (error as Error).message
      const errorKeys = extractValidationErrors(errorMessage);
      throw errorKeys;
    }
  }

  private async addModulesToPendingUser(modules: IModule[], pendingUser: IPendingUser) {
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

  // READ
  /**
   * Retrieves all pending users.
   * @param token - The authentication token.
   * @returns A promise that resolves to an array of pending users.
   * @throws If there is an error retrieving the pending users.
   */
  async getUsers(token: IToken): Promise<IPendingUser[]> {
    try {
      const pendingUsers = await APIService.get<IPendingUser[]>(this.baseRoute, token.value);
      return pendingUsers;
    } catch (error) {
      console.log('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Retrieves a pending user by ID.
   * @param id - The ID of the pending user.
   * @returns A promise that resolves to the retrieved pending user.
   * @throws If there is an error retrieving the pending user.
   */
  async getPendingUserByID(id: string): Promise<IPendingUser> {
    try {
      const token = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
      const castedToken = token as IToken;
      const pendingUser = await APIService.get<IPendingUser>(`${this.baseRoute}/${id}`, castedToken?.value);
      return pendingUser;
    } catch (error) {
      console.log('Error getting pending user by id:', id, error);
      throw error;
    }
  }

  /**
   * Retrieves the module IDs of a pending user.
   * @param id - The ID of the pending user.
   * @returns A promise that resolves to an array of module IDs.
   * @throws If there is an error retrieving the module IDs.
   */
  async getPendingUsersModulesIDs(id: string): Promise<string[]> {
    try {
      let moduleIDs: string[] = [];
      const modules = await APIService.get<IModule[]>(`${this.baseRoute}/${id}/modules`);
      for (const module of modules) {
        const id = module.id as string;
        moduleIDs.push(id);
      }
      return moduleIDs;
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
  async getPotentialEmployees(id: string | undefined, token: IToken | null): Promise<IPotentialEmployee[]> {
    try {
      const employees = await APIService.get<IPotentialEmployee[]>(`${this.baseRoute}/${id}/employees`, token?.value);
      return employees;
    } catch (error) {
      console.log('Error getting pending user\'s employees for id:', id, error);
      throw error;
    }
  }

  // UPDATE
  /**
   * Updates the status of a pending user.
   * @param pendingUser - The pending user object.
   * @param token - The authentication token.
   * @param status - The new status for the pending user.
   * @throws If there is an error updating the pending user status.
   */
  async updatePendingUserStatus(pendingUser: IPendingUser, token: IToken | null, status: string) {
    try {
      const id = pendingUser.id as string;
      await APIService.put(`${this.baseRoute}/${id}/status`, { "type": status }, token?.value);
    } catch (error) {
      throw error;
    }
  }

  // DELETE
  /**
   * Removes a pending user.
   * @param id - The ID of the pending user.
   * @param token - The authentication token.
   * @throws If there is an error deleting the pending user.
   */
  async removePendingUser(id: string | undefined, token: IToken | null) {
    try {
      await APIService.delete(`${this.baseRoute}/${id}`, token?.value);
    } catch (error) {
      throw error;
    }
  }
}

export default PendingUserService;
