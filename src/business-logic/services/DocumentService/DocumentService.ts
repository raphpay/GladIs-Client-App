/**
 * Represents a service for managing documents.
 */
class DocumentService {
  private static instance: DocumentService | null = null;
  private baseRoute = 'documents';

  constructor() {}

  /**
   * Gets the singleton instance of the DocumentService class.
   * @returns The singleton instance of the DocumentService class.
   */
  static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }
}

export default DocumentService;
