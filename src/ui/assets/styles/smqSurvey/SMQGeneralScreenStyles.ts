import { StyleSheet } from 'react-native';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  sendButtonContainer: {
    width: '30%',
    paddingHorizontal: 10,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    paddingTop: 20,
  },
  selectFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.poppinsLight,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.poppinsSemiBold
  },
  selectedFileText: {
    fontSize: 16,
    fontFamily: Fonts.poppinsLight,
    marginLeft: 10,
  },
  additionalComponent: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default styles;