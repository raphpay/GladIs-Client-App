import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  // Containers
  processusContainer: {
    backgroundColor: Colors.inactive,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 75,
    borderRadius: 10,
    margin: 10,
  },
  // Components
  categoryTitle: {
    fontSize: 12,
    fontFamily: Fonts.poppinsSemiBold
  }
});

export default styles;