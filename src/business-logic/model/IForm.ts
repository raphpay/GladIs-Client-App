export default interface IForm {
  id?: string;
  title: string;
  clientID: string;
  value: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export interface IFormInput {
  title: string;
  clientID: string;
  value: string;
}