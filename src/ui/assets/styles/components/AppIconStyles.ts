import { StyleSheet } from "react-native";
import { Colors } from "../../colors/colors";
import { Fonts } from "../../fonts/fonts";

const styles = StyleSheet.create({
  container: {
    width: 170,
    height: 190,
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 10,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light,
    shadowColor: Colors.black,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderColor: Colors.black,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain'
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  clientName: {
    color: Colors.black,
    fontSize: 14,
    fontFamily: Fonts.poppinsSemiBold,
    marginTop: 5,
  },
  androidLogo: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  }
});

export default styles;