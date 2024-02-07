import { StyleSheet } from 'react-native';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: Fonts.h4,
    fontWeight: Fonts.semiBold
  },
  message: {
    fontSize: Fonts.p,
    fontWeight: Fonts.regular,
    paddingBottom: 24
  }
});

export default styles;