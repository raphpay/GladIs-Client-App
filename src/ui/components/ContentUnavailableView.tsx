import React from 'react';
import { Image, ImageSourcePropType, Text, View } from 'react-native';

import styles from '../assets/styles/components/ContentUnavailableViewStyles';

type ContentUnavailableViewProps = {
  title: string;
  message: string;
  image: ImageSourcePropType;
};

function ContentUnavailableView(props: ContentUnavailableViewProps): React.JSX.Element {

  const { title, message, image } = props;

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export default ContentUnavailableView;