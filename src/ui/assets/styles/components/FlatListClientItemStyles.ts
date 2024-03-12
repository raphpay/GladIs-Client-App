import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  clientContainer: {
    width: 150,
    height: 150,
    backgroundColor: Colors.primary,
    margin: 8,
    borderRadius: 10,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  clientLogo: {
    height: '75%',
    padding: 4,
  },
  nameContainer: {
    height: '25%',
    backgroundColor: Colors.inactive,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    padding: 4,
  },
  clientNameText: {
    fontSize: 16,
    fontFamily: Fonts.poppinsLight
  },
});

export default styles;