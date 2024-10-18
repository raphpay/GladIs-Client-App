import React from 'react';
import { Image, ScrollView, View } from 'react-native';

import styles from '../../assets/styles/components/PDFViewerStyles';

interface PDFViewerProps {
  pdfPages: string[]; // Array of base64 encoded image strings
}

function PDFViewer(props: PDFViewerProps): React.JSX.Element {
  const { pdfPages } = props;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {pdfPages.map((imagePath: string, index: number) => (
        <View key={index} style={styles.imageContainer}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{ uri: `data:application/pdf;base64,${imagePath}` }}
          />
        </View>
      ))}
    </ScrollView>
  );
}

// Example usage
// const pdfPages: string[] = ['base64Image1', 'base64Image2', ...]; // Replace with your base64

export default PDFViewer;
