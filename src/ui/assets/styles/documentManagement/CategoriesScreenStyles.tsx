import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';

const styles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: Colors.primary
  },
  topContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'flex-end',
  },
  innerContainer: {
    flex: 1,
    marginTop: 104,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.light,
  },
  innerComponentsContainer: {
    flex: 1,
    marginTop: 91,
    marginHorizontal: 16,
    marginBottom: 16
  },
  searchInputContainer: {
    width: '100%',
    flexDirection: 'row-reverse'
  },
  moduleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    width: 190,
    borderRadius: 10
  },
  backButtonContainer: {
    width: '100%',
    flexDirection: 'row-reverse',
    padding: 16
  },
  navigationHistoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    borderRadius: 10,
    width: 148,
    height: 228,
    borderWidth: 1,
    borderColor: 'black'
  },
  categoryImageContainer: {
    height: '75%'
  },
  categoryTextsContainer: {
    height: '25%',
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    padding: 4,
  },
  // Components
  appIcon: {
    marginLeft: 60,
    marginTop: 16,
  },
  navigationHistory: {
    paddingLeft: 8,
    fontSize: 12,
    fontWeight: '400',
    paddingRight: 4
  },
  currentPageTitle: {
    paddingLeft: 8,
    fontSize: 20,
    fontWeight: '600'
  },
  categoryTitle: {
    fontSize: 12
  },
  categoryDescription: {
    fontSize: 10
  },
});

export default styles;