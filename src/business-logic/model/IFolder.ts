export default interface IFolder {
  id?: string,
  title: string,
  number: number,
  sleeve: Sleeve,
  userID: IUserID | string,
}

export interface IFolderInput {
  title: string,
  number: number,
  sleeve: Sleeve,
  userID: string,
}

export interface IFolderUpdateInput {
  title?: string,
  number?: number,
}

export interface IFolderMultipleInput {
  inputs: IFolder[],
  userID: string,
}

export enum Sleeve {
  SystemQuality = 'systemQuality',
  Record ='record'
}

interface IUserID {
  id: string
}