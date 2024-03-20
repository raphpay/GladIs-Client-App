import { StyleSheet } from 'react-native';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  // Containers
  employeeLineContainer: {
    height: 55,
    width: '100%',
  },
  employeeLineRow: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  employeeTextContainer: {
    flex: 1,
    paddingLeft: 8
  },
  // Components
  employeeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    margin: 4,
    zIndex: -10
  },
  actionButton: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  employeeText: {
    fontFamily: Fonts.poppinsLight,
    fontWeight: Fonts.regular,
  },
});

export default styles;