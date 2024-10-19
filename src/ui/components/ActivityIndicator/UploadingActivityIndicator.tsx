import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/components/ActivityIndicator/UploadingActivityIndicatorStyles';

type UploadingActivityIndicatorProps = {
  isUploading: boolean;
};

function UploadingActivityIndicator(
  props: UploadingActivityIndicatorProps,
): React.JSX.Element {
  const { isUploading } = props;

  return (
    <>
      {isUploading && (
        <View style={styles.uploadActivityIndicator}>
          <ActivityIndicator size={'large'} color={Colors.primary} />
        </View>
      )}
    </>
  );
}

export default UploadingActivityIndicator;
