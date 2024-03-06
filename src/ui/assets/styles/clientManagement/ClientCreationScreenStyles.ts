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
  backButtonContainer: {
    flexDirection: 'row-reverse',
  },
  sendButtonContainer: {
    width: '30%',
    paddingHorizontal: 10,
  },
  employeeText: {
    fontSize: 12,
    fontFamily: Fonts.poppinsLight
  }
});

export default styles;