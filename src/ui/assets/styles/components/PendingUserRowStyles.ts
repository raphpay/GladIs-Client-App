import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.inactive,
    marginTop: 10,
  },
  leftContainer: {
    flexDirection: 'row',
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: Colors.warning
  },
  nameContainer: {
    flexDirection: 'row',
  },
  textContainer: {
    paddingLeft: 5,
  },
  textName: {
    paddingHorizontal: 2
  },
});

export default styles;