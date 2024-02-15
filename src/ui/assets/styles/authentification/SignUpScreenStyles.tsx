import { StyleSheet } from 'react-native';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.poppinsBold,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: Fonts.semiBold
  },
  buttonContainer: {
    flexDirection: 'row-reverse'
  }
});

export default styles;