export default interface ISurvey {
  id?: string,
  value: string,
  client: IClientID,
  createdAt?: Date,
  updatedAt?: Date
}

interface IClientID {
  id: string;
}

export interface ISurveyInput {
  value: string;
  clientID: string;
}