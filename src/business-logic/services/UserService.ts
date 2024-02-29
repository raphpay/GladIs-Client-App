import IModule from '../model/IModule';
import ITechnicalDocTab from '../model/ITechnicalDocumentationTab';
import IToken from '../model/IToken';
import IUser from '../model/IUser';
import CacheKeys from '../model/enums/CacheKeys';
import UserType from '../model/enums/UserType';

import APIService from './APIService';
import CacheService from './CacheService';

class UserService {
  private static instance: UserService | null = null;
  private baseRoute = 'users';

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // CREATE
  async createUser(user: IUser): Promise<IUser> {
    try {
      const createdUser = await APIService.post<IUser>(this.baseRoute, user);
      return createdUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // READ
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

  async getClients(): Promise<IUser[]> {
    try {
      const token = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
      const castedToken = token as IToken;
      const users = await APIService.get<IUser[]>(this.baseRoute, castedToken.value);
      const clients = users.filter((user) => user.userType !== UserType.Admin);
      return clients;
    } catch (error) {
      console.error('Error getting clients', error);
      throw error;
    }
  }

  async getUserByID(id: string | undefined, token: IToken | undefined): Promise<IUser> {
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
      console.error('Error getting user\'s technical documentation tabs:', id, error);
      throw error;
    }
  }

  // UPDATE
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

  // DELETE
}

export default UserService;
