export default interface IDocument {
  id: string,
  name: string,
  path: string,
  lastModified: Date,
}

export enum DocumentStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pendingReview',
  UNDER_REVIEW = 'underReview',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
  NONE = 'none'
}