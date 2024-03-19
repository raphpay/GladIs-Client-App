import { StyleSheet } from 'react-native';
import { Colors } from '../../colors/colors';
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
    paddingLeft: 8
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
    margin: 4
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
  ellipsisIcon: {
    height: 8,
    width: 30,
  },
  popoverButton: {
    width: '500%',
    marginVertical: 4,
    marginBottom: 18
  },
  popoverButtonText: {
    fontSize: 14,
    fontFamily: Fonts.poppinsLight,
    color: Colors.primary,
  },
});

export default styles;