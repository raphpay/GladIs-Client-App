export default interface IPotentialEmployee {
  id?: string;
  firstName: string;
  lastName: string;
  companyName: string;
  // Always check if pendingUserID is not null
  pendingUserID?: string
}