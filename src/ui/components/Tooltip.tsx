import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

import styles from '../assets/styles/components/TooltipStyles';

type TooltipProps = {
  action: () => void;
};

function Tooltip(props: TooltipProps ): React.JSX.Element {

  const { action } = props;
  const ellipsisIcon = require('../assets/images/ellipsis.png');

  return (
    <TouchableOpacity style={styles.actionButton} onPress={action}>
      <Image source={ellipsisIcon} style={styles.icon} />
    </TouchableOpacity>
  );
}

export default Tooltip;