import { StyleSheet } from "react-native";
import { Colors } from "../../colors/colors";
import { Fonts } from "../../fonts/fonts";

const styles = StyleSheet.create({
  container: {
    width: '70%',
    paddingTop: 8,
    paddingBottom: 8,
  },
  textInputContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 10,
    padding: 15,
    fontSize: Fonts.p
  },
  placeholder: {
    fontWeight: Fonts.bold,
    fontSize: Fonts.h4,
    fontFamily: Fonts.poppinsLight,
  },
  visibilityButtonContainer: {
    position: 'absolute',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    right: 8,
  },
});

export default styles;