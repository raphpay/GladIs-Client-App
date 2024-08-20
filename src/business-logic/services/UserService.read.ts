import IProcessus from "../model/IProcessus";
import IToken from "../model/IToken";
import APIService from "./APIService";
import UserService from "./UserService";

class UserServiceRead extends UserService {
  static baseRoute = 'users';

  static async getSystemQualityFolders(userID: string, token: IToken | null): Promise<IProcessus[]> {
    try {
      const processus = await APIService.get<IProcessus[]>(`${this.baseRoute}/${userID}/processus/systemQuality`, token?.value as string);
      return processus;
    } catch (error) {
      throw error;
    }
  }
}

export default UserServiceRead;