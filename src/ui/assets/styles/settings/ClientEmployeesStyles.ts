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
    margin: 4
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
  // tooltip
  tooltipIconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popover: {
    justifyContent: 'space-between',
    width: '500%',
    marginHorizontal: 4,
  },
  popoverButton: {
    marginVertical: 4
  },
  tooltipButtonText: {
    fontSize: 12,
    fontFamily: Fonts.poppinsLight
  }
});

export default styles;