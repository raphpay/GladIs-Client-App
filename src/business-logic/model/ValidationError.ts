export function extractValidationErrors(errorResponse?: string): string[] {
  let validationErrors: string[] = [];
  if (errorResponse) {
    const reasons = errorResponse.split(',');
    validationErrors = reasons.map(reason => reason.trim().split(' ')[1]);
  }
  return validationErrors;
}