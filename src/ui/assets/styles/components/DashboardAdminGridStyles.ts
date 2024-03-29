import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
  actionSectionContainer: {
    flex: 0.4
  },
  clientSectionContainer: {
    flex: 1.6
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bikoBold,
    paddingVertical: 10,
  },
  separator: {
    width: '100%',
    backgroundColor: Colors.inactive,
     height: 2, 
     borderRadius: 5,
  },
  actionRowContainer: {
    flexDirection: 'row',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  circleNumber: {
    fontFamily: Fonts.poppinsSemiBold
  },
});

export default styles;