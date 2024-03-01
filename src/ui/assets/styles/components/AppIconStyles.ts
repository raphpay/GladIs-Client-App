import { StyleSheet } from "react-native";
import { Colors } from "../../colors/colors";

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: Colors.light,
  },
  image: {
    width: 150,
    height: 97.61,
    resizeMode: 'contain'
  },
});

export default styles;