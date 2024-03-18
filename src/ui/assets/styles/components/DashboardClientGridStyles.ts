import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  moduleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    width: 190,
    borderRadius: 10,
    backgroundColor: Colors.inactive,
    margin: 8
  },
  moduleText: {
    fontSize: 16,
    fontFamily: Fonts.poppinsLight
  }
});

export default styles;