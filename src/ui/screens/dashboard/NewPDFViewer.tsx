import React from 'react';
import { ScrollView, Image, View, StyleSheet } from 'react-native';

// Define props type for the NewPDFViewer component
interface NewPDFViewerProps {
  pdfPages: string[]; // Array of base64 encoded image strings
}

const NewPDFViewer: React.FC<NewPDFViewerProps> = ({ pdfPages }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {pdfPages.map((imagePath, index) => (
        <View key={index} style={styles.imageContainer}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{ uri: `data:image/png;base64,${imagePath}` }} // assuming imagePath contains base64 PNG data
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // Center images horizontally
    paddingVertical: 20,  // Add vertical padding for better spacing
  },
  imageContainer: {
    width: '100%',        // Ensure image takes full width
    alignItems: 'center', // Center images within the container
    marginBottom: 20,     // Space between pages
  },
  image: {
    width: '100%',        // Image takes full width of the screen
    height: undefined,    // Maintain aspect ratio
    aspectRatio: 210 / 297, // Set aspect ratio for A4 size
  },
});

// Example usage
// const pdfPages: string[] = ['base64Image1', 'base64Image2', ...]; // Replace with your base64

export default NewPDFViewer;