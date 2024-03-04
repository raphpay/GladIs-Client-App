export function extractValidationErrors(errorResponse: string): string[] {
  const reasons = errorResponse.split(',');
  const validationErrors = reasons.map(reason => reason.trim().split(' ')[1]);
  return validationErrors;
}