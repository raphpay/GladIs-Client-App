import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  table: {
    marginTop: 20,
  },
  rowHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 4,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'center',
    height: 40,
  },
  cell: {
    flex: 1, // Adjusted below for specific cells
    textAlign: 'left',
  },
  narrowCell: {
    flex: 0.5, // Make the index cell narrower
    textAlign: 'center',
  },
  wideCell: {
    flex: 3, // Give more space to the title, date, and user mail cells
  },
  iconCell: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    fontFamily: Fonts.bikoBold
  },
  messageCellText: {
    fontFamily: Fonts.poppinsLight
  },
  arrowIcon: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    margin: 4,
    zIndex: -10
  },
  charactersCount: {
    width: '100%',
    flexDirection: 'row-reverse',
    marginBottom: 16,
  },
  charactersCountText: {
    fontFamily: Fonts.poppinsSemiBold,
    color: Colors.inactive
  },
  messageTitle: {
    fontFamily: Fonts.poppinsSemiBold,
    marginBottom: 16,
  },
  messageContent: {
    fontFamily: Fonts.poppinsLight,
    marginBottom: 16,
  },
  scrollView: {
    marginBottom: 60,
  },
});

export default styles;