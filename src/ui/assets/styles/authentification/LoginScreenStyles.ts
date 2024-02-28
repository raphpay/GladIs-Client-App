import { StyleSheet } from "react-native";
import { Colors } from "../../colors/colors";
import { Fonts } from "../../fonts/fonts";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.bikoBold
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 10,
    width: '70%',
    padding: 10,
    margin: 8
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: 50,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600'
  },
  textButtonText: {
    fontSize: 14,
  },
  dialogInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});

export default styles;