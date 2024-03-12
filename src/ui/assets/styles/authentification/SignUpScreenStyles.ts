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
  employeesTitle: {
    fontSize: 14,
    fontFamily: Fonts.poppinsSemiBold
  },
  employeeText: {
    fontSize: 12,
    fontFamily: Fonts.poppinsLight,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginHorizontal: 50,
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});

export default styles;