import React from 'react';
import {
  StyleProp,
  ViewStyle,
  requireNativeComponent
} from 'react-native';

type PDFViewerProps = {
  pdfURL: string;
  style?: StyleProp<ViewStyle>;
};

const NativePDFViewer = requireNativeComponent('PDFViewer');

function PDFViewer(props: PDFViewerProps): React.JSX.Element {

  const { pdfURL, style } = props;

  return (
    <NativePDFViewer style={style} url={pdfURL} />
  );
}

export default PDFViewer;