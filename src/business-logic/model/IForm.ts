export default interface IForm {
  id?: string;
  title: string;
  clientID: string;
  value: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  approvedByAdmin: boolean;
  approvedByClient: boolean;
  path?: string;
}

export interface IFormInput {
  title: string;
  createdBy: string;
  value: string;
  path: string;
  clientID: string;
}

export interface IFormUpdateInput {
  updatedBy: string;
  value: string;
  // title: string;
  // createdBy: string;
}


export interface IFormCell {
  id: string;
  value: string;
  isTitle: boolean;
}