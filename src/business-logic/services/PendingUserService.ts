import IModule from '../model/IModule';
import IPendingUser from '../model/IPendingUser';
import IPotentialEmployee from '../model/IPotentialEmployee';
import IToken from '../model/IToken';
import IUser from '../model/IUser';
import { extractValidationErrors } from '../model/ValidationError';
import CacheKeys from '../model/enums/CacheKeys';
import APIService from './APIService';
import CacheService from './CacheService';

class PendingUserService {
  private static instance: PendingUserService | null = null;
  private baseRoute = 'pendingUsers';
  private constructor() {}

  static getInstance(): PendingUserService {
    if (!PendingUserService.instance) {
      PendingUserService.instance = new PendingUserService();
    }
    return PendingUserService.instance;
  }

  // CREATE
  async convertPendingUserToUser(id: string, token: IToken): Promise<IUser> {
    try {
      const newUser = await APIService.post<IUser>(`${this.baseRoute}/${id}/convertToUser`, null, token.value);
      return newUser;
    } catch (error) {
      const errorKeys = extractValidationErrors(error.message)
      console.log('Error converting pending user:', id, 'to user', errorKeys);
      throw errorKeys;
    }
  }

  async askForSignUp(pendingUser: IPendingUser, modules: IModule[]): Promise<IPendingUser> {
    try {
      const userAdded = await APIService.post<IPendingUser>(this.baseRoute, pendingUser);
      await this.addModulesToPendingUser(modules, userAdded);
      return userAdded;
    } catch (error) {
      const errorKeys = extractValidationErrors(error.message)
      console.log('Error asking for sign up for user', pendingUser, errorKeys);
      throw errorKeys;
    }
  }

  private async addModulesToPendingUser(modules: IModule[], pendingUser: IPendingUser) {
    for (const module of modules) {
      const userID = pendingUser.id as string;
      const moduleID = module.id as string;
      try {
        await APIService.post(`${this.baseRoute}/${userID}/modules/${moduleID}`)
      } catch (error) {
        console.log('Error adding module', moduleID, 'to user', userID, error);
        throw error;
      }
    }
  }

  // READ
  async getUsers(token: IToken): Promise<IPendingUser[]> {
    try {
      const pendingUsers = await APIService.get<IPendingUser[]>(this.baseRoute, token.value);
      return pendingUsers;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async getPendingUserByID(id: string): Promise<IPendingUser> {
    try {
      const token = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken);
      const castedToken = token as IToken;
      const pendingUser = await APIService.get<IPendingUser>(`${this.baseRoute}/${id}`, castedToken?.value);
      return pendingUser;
    } catch (error) {
      console.error('Error getting pending user by id:', id, error);
      throw error;
    }
  }

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
      console.error('Error getting pending user\'s modules for id:', id, error);
      throw error;
    }
  }

  async getPotentialEmployees(id: string | undefined, token: IToken | null): Promise<IPotentialEmployee[]> {
    try {
      const employees = await APIService.get<IPotentialEmployee[]>(`${this.baseRoute}/${id}/employees`, token?.value)
      return employees;
    } catch (error) {
      console.error('Error getting pending user\'s employees for id:', id, error);
      throw error;
    }
  }

  // UPDATE
  async updatePendingUserStatus(pendingUser: IPendingUser, token: IToken | null, status: string) {
    try {
      const id = pendingUser.id as string;
      await APIService.put(`${this.baseRoute}/${id}/status`, { "type": status }, token?.value);
    } catch (error) {
      console.error('Error updating pending user status', pendingUser, status, error);
      throw error;
    }
  }

  // DELETE
  async removePendingUser(id: string | undefined, token: IToken | null) {
    try {
      await APIService.delete(`${this.baseRoute}/${id}`, token?.value);
    } catch (error) {
      console.error('Error deleting pending user', id, error);
      throw error;
    }
  }
}

export default PendingUserService;
