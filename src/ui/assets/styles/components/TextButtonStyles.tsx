import { StyleSheet } from "react-native";
import { Colors } from "../../colors/colors";
import { Fonts } from "../../fonts/fonts";

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  textButton: {
    fontSize: Fonts.p,
    fontWeight: Fonts.bold,
    fontFamily: Fonts.bikoBold,
    color: Colors.white
  },
});

export default styles;