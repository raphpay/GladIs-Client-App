import { StyleSheet } from 'react-native';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%'
  },
  status: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 25,
  },
  statusText: {
    fontSize: 12,
    fontFamily: Fonts.poppinsLight
  },
  companyName: {
    fontSize: 18,
    fontFamily: Fonts.bikoBold
  },
  userFullName: {
    fontSize: 16,
    fontFamily: Fonts.poppinsLight
  },
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