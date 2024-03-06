import IPotentialEmployee from '../model/IPotentialEmployee';
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
}

export default PotentialEmployeeService;
