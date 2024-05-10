import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '50%',
    shadowColor: Colors.black,
    zIndex: 20,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: Fonts.bold,
    fontFamily: Fonts.bikoBold,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    fontWeight: Fonts.regular,
    fontFamily: Fonts.poppinsLight,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: Fonts.poppinsSemiBold
  },
  extraButton: {
    paddingRight: 25,
  },
  dialogButton: {
    height: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default styles;