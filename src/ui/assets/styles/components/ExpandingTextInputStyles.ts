import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginTop: 16,
  },
  input: {
    textAlignVertical: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 10,
    padding: 15,
    fontSize: Fonts.p
  },
});

export default styles;