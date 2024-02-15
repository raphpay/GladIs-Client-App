import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  clientContainer: {
    width: 190,
    height: 150,
    backgroundColor: Colors.primary,
    margin: 8,
    borderRadius: 10,
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