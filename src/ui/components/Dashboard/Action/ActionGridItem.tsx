import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { IActionItem } from '../../../../business-logic/model/IAction';

import { Colors } from '../../../assets/colors/colors';
import styles from '../../../assets/styles/components/DashboardAdminGridStyles';

type ActionGridItemProps = {
  item: IActionItem;
};

function ActionGridItem(props: ActionGridItemProps): React.JSX.Element {
  const { item } = props;

  const navigation = useNavigation();

  function navigateTo() {
    if (item?.screenDestination) {
      navigation.navigate(item.screenDestination);
    }
  }

  return (
    <>
      {
        item && (
          <TouchableOpacity onPress={navigateTo}>
            <View style={styles.actionRow}>
              <View style={{...styles.circle, borderColor: item.color ? item.color : Colors.primary }}>
                <Text style={styles.circleNumber}>{item.number}</Text>
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )
      }
    </>
  )
}

export default ActionGridItem;