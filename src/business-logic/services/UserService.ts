import IModule from '../model/IModule';
import ITechnicalDocTab from '../model/ITechnicalDocumentationTab';
import IToken from '../model/IToken';
import IUser from '../model/IUser';
import CacheKeys from '../model/enums/CacheKeys';
import UserType from '../model/enums/UserType';

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
      console.error('Error creating user:', error);
      throw error;
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
      console.error('Error linking user:', clientID, 'to tab:', tab.name, error);
      throw error;
    }
  }

  /**
   * Adds modules to a user.
   * @param id - The ID of the user.
   * @param modules - The modules to add.
   * @param token - The authentication token.
   * @throws If an error occurs while adding the modules to the user.
   */
  async addModules(id: string, modules: IModule[], token: IToken | null) {
    for (const module of modules) {
      const moduleID = module.id as string;
      try {
        await APIService.post(`${this.baseRoute}/${id}/modules/${moduleID}`, null, token?.value as string)
      } catch (error) {
        console.log('Error adding module', moduleID, 'to user', id, error);
        throw error;
      }
    }
  }

  
  async removeModuleFromClient(id: string, moduleID: string, token: IToken | null): Promise<IModule[]> {
    try {
      const remaningModules = await APIService.post<IModule[]>(`${this.baseRoute}/${id}/remove/modules/${moduleID}`, null, token?.value as string);
      return remaningModules;
    } catch (error) {
      console.error('Error removing module from client', error);
      throw error;
    }
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
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Retrieves all clients.
   * @returns A promise that resolves to an array of clients.
   * @throws If an error occurs while retrieving the clients.
   */
  async getClients(): Promise<IUser[]> {
    try {
      const token = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
      const castedToken = token as IToken;
      const users = await APIService.get<IUser[]>(this.baseRoute, castedToken.value);
      const clients = users.filter((user) => user.userType !== UserType.Admin && user.userType !== UserType.Employee);
      return clients;
    } catch (error) {
      console.error('Error getting clients', error);
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
      console.error('Error getting user by id:', id, error);
      throw error;
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
      let usedToken = token;
      if (!usedToken) {
        const cachedToken = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
        usedToken = cachedToken as IToken;
      }
      const modules = await APIService.get<IModule[]>(`${this.baseRoute}/${id}/modules`, usedToken?.value);
      return modules;
    } catch (error) {
      console.error('Error getting user\'s modules:', id, error);
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
      console.log('Error getting user\'s technical documentation tabs:', id, error);
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
      console.log('Error getting client employees', error);
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
      console.error('Error updating user:', user, error);
      throw error;
    }
  }

  /**
   * Changes the password of the current user.
   * @param currentPassword - The current password.
   * @param newPassword - The new password.
   * @throws If an error occurs while changing the user's password.
   */
  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const userID = await CacheService.getInstance().retrieveValue<string>(CacheKeys.currentUserID);
      const castedUserID = userID as string;
      const token = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
      const castedToken = token as IToken;
      await APIService.put(`${this.baseRoute}/${castedUserID}/changePassword`, { currentPassword, newPassword }, castedToken.value);
    } catch (error) {
      console.error('Error changing user password', error);
      throw error;
    }
  }

  /**
   * Sets the first connection parameter of the current user to false.
   * @throws If an error occurs while changing the user's first connection parameter.
   */
  async setUserFirstConnectionToFalse() {
    try {
      const userID = await CacheService.getInstance().retrieveValue<string>(CacheKeys.currentUserID);
      const castedUserID = userID as string;
      const token = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
      const castedToken = token as IToken;
      await APIService.put(`${this.baseRoute}/${castedUserID}/setFirstConnectionToFalse`, null, castedToken.value);
    } catch (error) {
      console.log('Error changing user first connection parameter', error);
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
      console.error('Error adding manager to user', error);
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
      console.log('Error blocking client', error);
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
      console.log('Error unblocking client', error);
      throw error;
    }
  }

  // DELETE
}

export default UserService;
