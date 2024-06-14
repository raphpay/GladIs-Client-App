import IModule, { IModuleInput } from '../model/IModule';
import IPasswordResetToken from '../model/IPasswordResetToken';
import ITechnicalDocTab from '../model/ITechnicalDocumentationTab';
import IToken from '../model/IToken';
import IUser, { ILoginTryOutput } from '../model/IUser';
import { extractValidationErrors } from '../model/ValidationError';
import CacheKeys from '../model/enums/CacheKeys';

import APIService from './APIService';
import CacheService from './CacheService';

/**
 * Represents a service for managing user-related operations.
 */
class UserService {
  private static instance: UserService | null = null;
  private baseRoute = 'users';

  private constructor() {}

  /**
   * Returns the singleton instance of the UserService class.
   * @returns The singleton instance of the UserService class.
   */
  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // CREATE

  /**
   * Creates a new user.
   * @param user - The user object to create.
   * @returns A promise that resolves to the created user.
   * @throws If an error occurs while creating the user.
   */
  async createUser(user: IUser, token: IToken | null): Promise<IUser> {
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
  async addTabToUser(clientID: string | undefined, tab: ITechnicalDocTab, token: IToken | null) {
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
   * Adds a module array to a user.
   * @param id - The ID of the user.
   * @param modules - The modules to add to the user.
   * @param token - The authentication token.
   * @returns A promise that resolves to the updated user.
   * @throws If an error occurs while adding the modules to the user.
   */
  async updateModules(id: string, modules: IModule[], token: IToken | null) {
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

  
  async removeModuleFromClient(id: string, moduleID: string, token: IToken | null): Promise<IModule[]> {
    try {
      const remaningModules = await APIService.post<IModule[]>(`${this.baseRoute}/${id}/remove/modules/${moduleID}`, null, token?.value as string);
      return remaningModules;
    } catch (error) {
      console.log('Error removing module from client', error);
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
  async verifyPassword(userID: string, password: string, token: IToken | null): Promise<boolean> {
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

  // READ

  /**
   * Retrieves all users.
   * @returns A promise that resolves to an array of users.
   * @throws If an error occurs while retrieving the users.
   */
  async getUsers(): Promise<IUser[]> {
    try {
      const token = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
      const castedToken = token as IToken;
      const users = await APIService.get<IUser[]>(this.baseRoute, castedToken.value);
      return users;
    } catch (error) {
      console.log('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Retrieves all clients.
   * @returns A promise that resolves to an array of clients.
   * @throws If an error occurs while retrieving the clients.
   */
  async getClients(token: IToken | null): Promise<IUser[]> {
    try {
      const clients = await APIService.get<IUser[]>(`${this.baseRoute}/clients`, token?.value as string);
      return clients;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a user by ID.
   * @param id - The ID of the user.
   * @param token - The authentication token.
   * @returns A promise that resolves to the user.
   * @throws If an error occurs while retrieving the user.
   */
  async getUserByID(id: string | undefined, token: IToken | null): Promise<IUser> {
    try {
      let usedToken = token;
      if (!usedToken) {
        const cachedToken = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
        usedToken = cachedToken as IToken;
      }
      const user = await APIService.get<IUser>(`${this.baseRoute}/${id}`, usedToken?.value);
      return user;
    } catch (error) {
      console.log('Error getting user by id:', id, error);
      throw error;
    }
  }

  /**
   * Retrieves a user by email.
   * @param email - The email of the user.
   * @param token - The authentication token.
   * @returns A promise that resolves to the user.
   * @throws If an error occurs while retrieving the user.
   */
  async getUserByEmail(email: string, token: IToken | null): Promise<IUser> {
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
   * Retrieves the modules of a user.
   * @param id - The ID of the user.
   * @param token - The authentication token.
   * @returns A promise that resolves to an array of modules.
   * @throws If an error occurs while retrieving the user's modules.
   */
  async getUsersModules(id: string | undefined, token: IToken | null): Promise<IModule[]> {
    try {
      const modules = await APIService.get<IModule[]>(`${this.baseRoute}/${id}/modules`, token?.value);
      return modules;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves the technical documentation tabs of a user.
   * @param id - The ID of the user.
   * @param token - The authentication token.
   * @returns A promise that resolves to an array of technical documentation tabs.
   * @throws If an error occurs while retrieving the user's technical documentation tabs.
   */
  async getUsersTabs(id: string | undefined, token: IToken | null): Promise<ITechnicalDocTab[]> {
    try {
      let usedToken = token;
      if (!usedToken) {
        const cachedToken = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
        usedToken = cachedToken as IToken;
      }
      const tabs = await APIService.get<ITechnicalDocTab[]>(`${this.baseRoute}/${id}/technicalDocumentationTabs`, usedToken?.value);
      return tabs;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves the employees of a user.
   * @param id - The ID of the user.
   * @param token - The authentication token.
   * @returns A promise that resolves to an array of employees.
   */
  async getClientEmployees(clientID: string, token: IToken | null): Promise<IUser[]> {
    try {
      const employees = await APIService.get<IUser[]>(`${this.baseRoute}/${clientID}/employees`, token?.value as string);
      return employees;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves the reset token value of a user.
   * @param userID - The ID of the user.
   * @param token - The authentication token.
   * @returns A promise that resolves to the reset token value.
   * @throws If an error occurs while retrieving the reset token value.
   */
  async getResetTokenValue(userID: string, token: IToken | null): Promise<string> {
    try {
      const resetToken = await APIService.get<IPasswordResetToken>(`${this.baseRoute}/${userID}/resetToken`, token?.value as string);
      const value = resetToken.token as string;
      return value;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves the login try output of a user.
   * @param username - The username of the user.
   * @returns A promise that resolves to the login try output.
   * @throws If an error occurs while retrieving the login try output.
   */
  async getUserLoginTryOutput(username: string): Promise<ILoginTryOutput> {
    try {
      const route = `${this.baseRoute}/userLoginTry`;
      const output = await APIService.post<ILoginTryOutput>(route, { username });
      return output;
    } catch (error) {
      throw error;
    }
  }

  // UPDATE
  /**
   * Updates the user.
   * @param user - The user to update.
   * @param token - The authentication token.
   */
  async updateUser(user: IUser, token: IToken | null): Promise<void> {
    try {
      await APIService.put(`${this.baseRoute}/${user.id}/updateInfos/`, user, token?.value as string);
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
  async changePassword(userID: string, currentPassword: string, newPassword: string, token: IToken | null): Promise<void> {
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
  async setUserFirstConnectionToFalse(userID: string, token: IToken | null): Promise<void> {
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
  async addManagerToUser(userID: string, managerID: string, token: IToken | null) {
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
  async blockUser(clientID: string, token: IToken | null) {
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
  async unblockUser(clientID: string, token: IToken | null) {
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
  async removeEmployeeFromManager(managerID: string, employeeID: string, token: IToken | null): Promise<IUser> {
    try {
      const manager = await APIService.put(`${this.baseRoute}/${managerID}/remove/${employeeID}`, null, token?.value as string);
      return manager;
    } catch (error) {
      throw error;
    }
  }

  async blockUserConnection(userID: string): Promise<number> {
    try {
      const route = `${this.baseRoute}/${userID}/block/connection`;
      const user = await APIService.put(route);
      return user.connectionFailedAttempts;
    } catch (error) {
      throw error;
    }
  }

  // DELETE
  /**
   * Removes a user.
   * @param id - The ID of the user to remove.
   * @param token - The authentication token.
   * @throws If an error occurs while removing the user.
   * @returns A promise that resolves when the user is removed.
   */
  async removeUser(id: string, token: IToken | null): Promise<void> {
    try {
      await APIService.delete(`${this.baseRoute}/${id}`, token?.value as string);
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
