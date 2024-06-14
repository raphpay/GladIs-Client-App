import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 2,
  },
  tooltip: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.inactive,
    shadowColor: Colors.black,
    zIndex: 20,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  action: {
    paddingVertical: 5,
  },
  tooltipIconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popoverButton: {
    width: '500%',
    marginVertical: 4,
    marginBottom: 18
  },
  popoverButtonText: {
    fontSize: 14,
    fontFamily: Fonts.poppinsLight,
    color: Colors.primary,
  },
  icon: {
    height: 8,
    width: 30,
  },
  addButton: {
    marginHorizontal: 8,
    marginVertical: 4,
  }
});

export default styles;