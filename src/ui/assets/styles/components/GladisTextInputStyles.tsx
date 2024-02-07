import { StyleSheet } from "react-native";
import { Colors } from "../../colors/colors";
import { Fonts } from "../../fonts/fonts";

const styles = StyleSheet.create({
  container: {
    width: '70%',
    paddingTop: 8,
    paddingBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 10,
    padding: 15,
    width: '100%',
    fontSize: Fonts.p
  },
  placeholder: {
    fontWeight: Fonts.bold,
    fontSize: Fonts.h4,
    fontFamily: Fonts.poppinsLight,
  }
});

export default styles;