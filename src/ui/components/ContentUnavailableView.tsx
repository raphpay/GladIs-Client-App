import React from 'react';
import { Text, View } from 'react-native';

import styles from '../assets/styles/components/ContentUnavailableViewStyles';

type ContentUnavailableViewProps = {
  title: string;
  message: string;
  image?: JSX.Element;
};

// TODO: Don't pass image as JSX.Element, instead pass the image source and create the JSX.Element inside the component
function ContentUnavailableView(props: ContentUnavailableViewProps): React.JSX.Element {

  const { title, message, image } = props;

  return (
    <View style={styles.container}>
      { image }
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export default ContentUnavailableView;