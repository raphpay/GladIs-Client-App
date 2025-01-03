export default interface IVersionLog {
  id?: string;
  currentVersion: string;
  minimumClientVersion: string;
  supportedClientVersions: string[];
}
