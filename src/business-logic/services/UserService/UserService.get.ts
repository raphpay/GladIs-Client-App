import CacheKeys from "../../model/enums/CacheKeys";
import IFolder from "../../model/IFolder";
import IModule from "../../model/IModule";
import IPasswordResetToken from "../../model/IPasswordResetToken";
import ITechnicalDocTab from "../../model/ITechnicalDocumentationTab";
import IToken from "../../model/IToken";
import IUser from "../../model/IUser";
import APIService from "../APIService";
import CacheService from "../CacheService";
import UserService from "./UserService";

class UserServiceGet extends UserService {
  static baseRoute = 'users';

  /**
   * Retrieves all users.
   * @returns A promise that resolves to an array of users.
   * @throws If an error occurs while retrieving the users.
   */
  static async getUsers(): Promise<IUser[]> {
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
  static async getClients(token: IToken | null): Promise<IUser[]> {
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
  static async getUserByID(id: string | undefined, token: IToken | null): Promise<IUser> {
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
   * Retrieves the modules of a user.
   * @param id - The ID of the user.
   * @param token - The authentication token.
   * @returns A promise that resolves to an array of modules.
   * @throws If an error occurs while retrieving the user's modules.
   */
  static async getUsersModules(id: string | undefined, token: IToken | null): Promise<IModule[]> {
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
  static async getUsersTabs(id: string | undefined, token: IToken | null): Promise<ITechnicalDocTab[]> {
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
  static async getClientEmployees(clientID: string, token: IToken | null): Promise<IUser[]> {
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
  static async getResetTokenValue(userID: string, token: IToken | null): Promise<string> {
    try {
      const resetToken = await APIService.get<IPasswordResetToken>(`${this.baseRoute}/${userID}/resetToken`, token?.value as string);
      const value = resetToken.token as string;
      return value;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the system quality folders for the user
   * @param userID The user ID
   * @param token The token
   * @returns The system quality folders
   * @throws Error
   */
  static async getSystemQualityFolders(userID: string, token: IToken | null): Promise<IFolder[]> {
    try {
      const folder = await APIService.get<IFolder[]>(`${this.baseRoute}/${userID}/folders/systemQuality`, token?.value as string);
      return folder;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the records folders for the user
   * @param userID The user ID
   * @param token The token
   * @returns The records folders
   * @throws Error
   */
  static async getRecordsFolders(userID: string, token: IToken | null): Promise<IFolder[]> {
    try {
      const folder = await APIService.get<IFolder[]>(`${this.baseRoute}/${userID}/folders/records`, token?.value as string);
      return folder;
    } catch (error) {
      throw error;
    }
  }
}

export default UserServiceGet;