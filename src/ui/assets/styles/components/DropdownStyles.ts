import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  containerStyle: {
    marginHorizontal: 10,
  },
  dropdownStyle: {
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
    height: 35,
    alignItems: 'center',
    borderColor: Colors.inactive,
    backgroundColor: Colors.light
  },
  dropdownText: {
    fontFamily: Fonts.poppinsLight,
  },
});

export default styles;