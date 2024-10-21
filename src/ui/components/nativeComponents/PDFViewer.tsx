import React from 'react';
import { Image, ScrollView, View } from 'react-native';

import styles from '../../assets/styles/components/PDFViewerStyles';

interface PDFViewerProps {
  pdfPages: string[]; // Array of base64 encoded image strings
}

// TODO: Find why it doesn't display on Windows ( works with dummy image from the web )
function PDFViewer(props: PDFViewerProps): React.JSX.Element {
  const { pdfPages } = props;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {pdfPages.map((imageData: string, index: number) => (
        <View key={index} style={styles.imageContainer}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{ uri: `data:image/png;base64,${imageData}` }}
          />
        </View>
      ))}
    </ScrollView>
  );
}

// Example usage
// const pdfPages: string[] = ['base64Image1', 'base64Image2', ...]; // Replace with your base64

export default PDFViewer;
