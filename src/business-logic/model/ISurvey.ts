export default interface ISurvey {
  id?: string,
  value: string,
  client: IClientID
}

interface IClientID {
  id: string;
}

export interface ISurveyInput {
  value: string;
  clientID: string;
}