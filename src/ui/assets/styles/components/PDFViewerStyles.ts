import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  imageContainer: {
    width: '100%', // Ensure image takes full width
    alignItems: 'center', // Center images within the container
    marginBottom: 20,
  },
  image: {
    width: '100%', // Image takes full width of the screen
    height: undefined, // Maintain aspect ratio
    aspectRatio: 210 / 297, // Set aspect ratio for A4 size
  },
});

export default styles;
