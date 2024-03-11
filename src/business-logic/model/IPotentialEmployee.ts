export default interface IPotentialEmployee {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  // Always check if pendingUserID is not null
  pendingUserID?: string
} 