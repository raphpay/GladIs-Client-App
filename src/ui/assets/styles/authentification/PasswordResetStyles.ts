import { StyleSheet } from 'react-native';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: Fonts.h4,
    fontWeight: Fonts.semiBold,
    fontFamily: Fonts.poppinsSemiBold
  },
  message: {
    fontSize: Fonts.p,
    fontWeight: Fonts.regular,
    fontFamily: Fonts.poppinsLight,
    paddingBottom: 24
  },
  backButtonContainer: {
    width: '100%',
    flexDirection: 'row-reverse',
    padding: 16,
  }
});

export default styles;