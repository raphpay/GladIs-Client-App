import React from 'react';
import { View } from 'react-native';
import Pdf from 'react-native-pdf';

import styles from '../../assets/styles/components/PDFViewerStyles';

interface PDFViewerProps {
  pageData: string;
}

function PDFViewer(props: PDFViewerProps): React.JSX.Element {
  const { pageData } = props;

  const source = { uri: `data:application/pdf;base64,${pageData}` };

  return (
    <View style={styles.container}>
      <Pdf source={source} style={styles.pdf} />
    </View>
  );
}

export default PDFViewer;
