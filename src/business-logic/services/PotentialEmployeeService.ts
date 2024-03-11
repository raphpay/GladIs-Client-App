import IPotentialEmployee from '../model/IPotentialEmployee';
import IToken from '../model/IToken';
import IUser from '../model/IUser';
import APIService from './APIService';

class PotentialEmployeeService {
  private static instance: PotentialEmployeeService | null = null;
  private baseRoute = 'potentialEmployees';
  private constructor() {}

  static getInstance(): PotentialEmployeeService {
    if (!PotentialEmployeeService.instance) {
      PotentialEmployeeService.instance = new PotentialEmployeeService();
    }
    return PotentialEmployeeService.instance;
  }

  // CREATE
  async create(employee: IPotentialEmployee) {
    try {
      await APIService.post<IPotentialEmployee>(this.baseRoute, employee);
    } catch (error) {
      console.log('Error creating potential employee:', employee);
      throw error;
    }
  }

  async convertToUser(id: string, token: IToken | null): Promise<IUser> {
    try {
      const createdUser = await APIService.post<IUser>(`${this.baseRoute}/${id}/convertToUser`, null, token.value as string);
      return createdUser;
    } catch (error) {
      console.log('Error converting potential employee to user:', id);
      throw error;
    }
  }
}

export default PotentialEmployeeService;
