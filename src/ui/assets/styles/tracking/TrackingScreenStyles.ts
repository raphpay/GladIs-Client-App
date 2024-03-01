import { StyleSheet } from "react-native";
import { Colors } from "../../colors/colors";
import { Fonts } from "../../fonts/fonts";

const styles = StyleSheet.create({
  logContainer: {
    width: '100%',
    paddingVertical: 10,
    marginHorizontal: 4
  },
  dateContainer: {
    flexDirection: 'row'
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    margin: 4
  },
  logName: {
    fontSize: 12,
    fontFamily: Fonts.poppinsSemiBold,
    color: Colors.primary
  },
  actor: {
    fontSize: 14,
    fontFamily: Fonts.poppinsSemiBold,
  },
  date: {
    fontSize: 12,
    fontFamily: Fonts.poppinsLight
  }
});

export default styles;