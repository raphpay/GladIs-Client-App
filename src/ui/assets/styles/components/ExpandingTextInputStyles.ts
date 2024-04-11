import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    padding: 2,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
});

export default styles;
