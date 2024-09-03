/**
 * Represents a service for managing user-related operations.
 */
class FormService {
  private static instance: FormService | null = null;
  private baseRoute = 'forms';

  constructor() {}

  /**
   * Returns the singleton instance of the FormService class.
   * @returns The singleton instance of the FormService class.
   */
  static getInstance(): FormService {
    if (!FormService.instance) {
      FormService.instance = new FormService();
    }
    return FormService.instance;
  }
}

export default FormService;
