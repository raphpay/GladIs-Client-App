import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: Colors.white,
    fontFamily: Fonts.poppinsLight,
  },
});

export default styles;