import IModule from '../model/IModule';
import IPendingUser from '../model/IPendingUser';
import IToken from '../model/IToken';
import IUser from '../model/IUser';
import CacheKeys from '../model/enums/CacheKeys';
import APIService from './APIService';
import CacheService from './CacheService';

class PendingUserService {
  private static instance: PendingUserService | null = null;

  private constructor() {}

  static getInstance(): PendingUserService {
    if (!PendingUserService.instance) {
      PendingUserService.instance = new PendingUserService();
    }
    return PendingUserService.instance;
  }

  // CREATE
  async convertPendingUserToUser(pendingUser: IPendingUser, token: IToken): Promise<IUser> {
    try {
      const id = pendingUser.id as string;
      const newUser = await APIService.post<IUser>(`pendingUsers/${id}/convertToUser`, {}, token.value);
      return newUser;
    } catch (error) {
      console.log('Error converting pending user:', pendingUser, 'to user', error);
      throw error;
    }
  }

  // READ
  async getUsers(token: IToken): Promise<IPendingUser[]> {
    try {
      const pendingUsers = await APIService.get<IPendingUser[]>('pendingUsers', token.value);
      return pendingUsers;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async getUserByID(id: string): Promise<IUser> {
    try {
      const token = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
      const castedToken = token as IToken;
      const user = await APIService.get<IUser>(`users/${id}`, castedToken?.value);
      return user;
    } catch (error) {
      console.error('Error getting user by id:', id, error);
      throw error;
    }
  }

  async getPendingUsersModulesIDs(id: string): Promise<string[]> {
    try {
      let moduleIDs: string[] = [];
      const modules = await APIService.get<IModule[]>(`pendingUsers/${id}/modules`);
      for (const module of modules) {
        const id = module.id as string;
        moduleIDs.push(id);
      }
      return moduleIDs;
    } catch (error) {
      console.error('Error getting user\'s modules for id:', id, error);
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
      await APIService.put(`users/${castedUserID}/changePassword`, { currentPassword, newPassword }, castedToken.value);
    } catch (error) {
      console.error('Error changing user password', error);
      throw error;
    }
  }

  async updatePendingUserStatus(pendingUser: IPendingUser, token: IToken, status: string) {
    try {
      const id = pendingUser.id as string;
      await APIService.put(`pendingUsers/${id}/status`, { "type": status }, token.value);
    } catch (error) {
      console.error('Error updating pending user status', pendingUser, status, error);
      throw error;
    }
  }

  async setUserFirstConnectionToFalse() {
    try {
      const userID = await CacheService.getInstance().retrieveValue<string>(CacheKeys.currentUserID);
      const castedUserID = userID as string;
      const token = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
      const castedToken = token as IToken;
      await APIService.put(`users/${castedUserID}/setFirstConnectionToFalse`, null, castedToken.value);
    } catch (error) {
      console.log('Error changing user first connection parameter', error);
      throw error;
    }
  }
}

export default PendingUserService;
