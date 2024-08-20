export default interface IProcessus {
  id?: string,
  title: string,
  number: number,
  folder: Folder,
  userID: IUserID | string,
}

export interface IProcessusInput {
  title: string,
  number: number,
  folder: Folder,
  userID: string,
}

export interface IProcessusUpdateInput {
  title?: string,
  number?: number,
}

export interface IProcessusMultipleInput {
  inputs: IProcessus[],
  userID: string,
}

export enum Folder {
  SystemQuality = 'systemQuality',
  Record ='record'
}

interface IUserID {
  id: string
}