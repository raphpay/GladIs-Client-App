import { StyleSheet } from "react-native";
import { Colors } from "../../colors/colors";
import { Fonts } from "../../fonts/fonts";

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textButton: {
    fontSize: 14,
    fontFamily: Fonts.poppinsLight,
    padding: 4,
    color: Colors.primary,
  },
});

export default styles;