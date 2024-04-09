import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    width: '100%',
    height: '100%',
  },
  upperContainer: {
    height: 104,
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.primary
  },
  settingsButton: {
    paddingHorizontal: 8,
  },
  children: {
    flex: 1,
    backgroundColor: Colors.light,
    paddingTop: 80,
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  }
});

export default styles;