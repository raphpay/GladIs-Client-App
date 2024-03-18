import React from 'react';
import {
  StyleProp,
  ViewStyle,
  requireNativeComponent
} from 'react-native';

type PDFViewerProps = {
  dataString: string;
  style?: StyleProp<ViewStyle>;
};

const NativePDFViewer = requireNativeComponent<PDFViewerProps>('PDFViewer');

function PDFViewer(props: PDFViewerProps): React.JSX.Element {

  const { dataString, style } = props;

  return (
    <NativePDFViewer style={style} dataString={dataString} />
  );
}

export default PDFViewer;