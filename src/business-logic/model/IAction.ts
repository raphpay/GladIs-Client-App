export default interface IAction {
  title: string;
  onPress: () => void;
  isDisabled?: boolean;
  isDestructive?: boolean;
}