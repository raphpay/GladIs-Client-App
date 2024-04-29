import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upperContainer: {
    height: 104,
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
  },
  innerContainer: {
    flex: 1,
  },
  innerComponentsContainer: {
    flex: 1,
    marginTop: 91,
    marginHorizontal: 16,
    marginBottom: 16
  },
  searchInputContainer: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  backButtonContainer: {
    width: '100%',
    bottom: 0,
    right: 0,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  settingsButton: {
    paddingHorizontal: 8,
  },
  additionalComponent: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'flex-end',
  },
});

export default styles;