export default interface IModule {
  id: string;
  name: string;
}

export interface ISubCategory {
  id: string;
  title: string;
}

export interface IDocument {
  id?: string,
  name: string,
  path: string
}