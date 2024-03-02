import { StyleSheet } from 'react-native';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontFamily: Fonts.poppinsBold,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: Fonts.semiBold
  },
  sendButtonContainer: {
    width: '30%',
    paddingHorizontal: 10,
  }
});

export default styles;