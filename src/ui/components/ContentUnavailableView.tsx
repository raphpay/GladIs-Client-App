import React from 'react';
import { Text, View } from 'react-native';

import styles from '../assets/styles/components/ContentUnavailableViewStyles';

type ContentUnavailableViewProps = {
  title: string;
  message: string;
  image?: JSX.Element;
};

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