
export default interface IPotentialEmployee {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  pendingUser?: IPendingUserID; // Used once the employee is created
  // Always check if pendingUserID is not null
  pendingUserID?: string;
} 

interface IPendingUserID {
  id: string
}