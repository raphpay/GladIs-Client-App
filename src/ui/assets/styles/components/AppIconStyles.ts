import { StyleSheet } from "react-native";
import { Colors } from "../../colors/colors";

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light,
    shadowColor: Colors.black,
    zIndex: 20,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderColor: Colors.black,
    borderWidth: 1,
  },
  image: {
    width: 150,
    height: 97.61,
    resizeMode: 'contain'
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    borderRadius: 10,
  },
});

export default styles;