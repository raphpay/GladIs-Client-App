import { StyleSheet } from 'react-native';

import { Fonts } from '../../fonts/fonts';

// TODO: Clean styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row-reverse',
  },
  button: {
    paddingHorizontal: 4,
  },
  status: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%'
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 25,
  },
  textContainer: {
    paddingLeft: 5,
  },
  textName: {
    paddingHorizontal: 2
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    margin: 4
  },
  statusText: {
    fontSize: 12,
    fontFamily: Fonts.poppinsLight
  },
  companyName: {
    fontSize: 18,
    fontFamily: Fonts.bikoBold
  },
  userFullName: {
    fontSize: 16,
    fontFamily: Fonts.poppinsLight
  },
  actionButton: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default styles;