import React from 'react';
import { Dimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';

type PDFViewerProps = {
  pageData: string;
};

const PDFViewer = (props: PDFViewerProps) => {
  const { pageData } = props;
  const screenHeight = Dimensions.get('window').height;

  const htmlContent = `
    <html>
    <body>
        <iframe 
        width="100%" 
        height="90%" 
        src="data:application/pdf;base64,${pageData}#toolbar=0">
        </iframe>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1, height: screenHeight }}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
        useWebView2={true}
      />
    </View>
  );
};

export default PDFViewer;
