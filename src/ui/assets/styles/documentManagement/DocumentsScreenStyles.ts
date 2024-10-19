import { StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Fonts } from '../../fonts/fonts';

const styles = StyleSheet.create({
  // Containers
  documentLineContainer: {
    height: 55,
    width: '100%',
  },
  documentLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  documentTextContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  // Components
  documentButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    margin: 4,
  },
  actionButton: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  documentText: {
    fontFamily: Fonts.poppinsLight,
    fontWeight: Fonts.regular,
  },
  smqButton: {
    marginHorizontal: 8,
    marginVertical: 4,
  },
  uploadActivityIndicator: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.inactive,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 10000,
  },
});

export default styles;
