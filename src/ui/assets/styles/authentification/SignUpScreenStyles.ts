import { StyleSheet } from 'react-native';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 20,
    fontFamily: Fonts.semiBold
  },
  sendButtonContainer: {
    width: '30%',
    paddingHorizontal: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoButton: {
    width: '25%',
    marginRight: 20,
  },
  logo: {
    width: 100,
    height: 100,
  }
});

export default styles;