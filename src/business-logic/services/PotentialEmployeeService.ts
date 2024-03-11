import IPotentialEmployee from '../model/IPotentialEmployee';
import IToken from '../model/IToken';
import IUser from '../model/IUser';
import APIService from './APIService';

/**
 * Service class for managing potential employees.
 */
class PotentialEmployeeService {
  private static instance: PotentialEmployeeService | null = null;
  private baseRoute = 'potentialEmployees';

  private constructor() {}

  /**
   * Returns the singleton instance of the PotentialEmployeeService class.
   * @returns The singleton instance of the PotentialEmployeeService class.
   */
  static getInstance(): PotentialEmployeeService {
    if (!PotentialEmployeeService.instance) {
      PotentialEmployeeService.instance = new PotentialEmployeeService();
    }
    return PotentialEmployeeService.instance;
  }

  /**
   * Creates a new potential employee.
   * @param employee - The potential employee object to create.
   */
  async create(employee: IPotentialEmployee) {
    try {
      await APIService.post<IPotentialEmployee>(this.baseRoute, employee);
    } catch (error) {
      console.log('Error creating potential employee:', employee);
      throw error;
    }
  }

  /**
   * Converts a potential employee to a user.
   * @param id - The ID of the potential employee to convert.
   * @param token - The authentication token for the request.
   * @returns The created user object.
   */
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
