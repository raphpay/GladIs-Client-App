import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import INavigationHistoryItem from '../../business-logic/model/INavigationHistoryItem';

import AppIcon from './AppIcon';

import styles from '../assets/styles/components/TopAppBarStyles';

type TopAppBarProps = {
  mainTitle: string;
  navigationHistoryItems?: INavigationHistoryItem[];
};

function TopAppBar(props: TopAppBarProps): React.JSX.Element {
  const { mainTitle, navigationHistoryItems } = props;

  function NavigationButton(item: INavigationHistoryItem) {
    return (
      <View style={styles.navigationHistoryContainer}>
        <TouchableOpacity onPress={item.action}>
          <Text style={styles.navigationHistory}>
            {item.title}
          </Text>
        </TouchableOpacity>
        <Image source={require('../assets/images/chevron.right.png')}/>
      </View>
    );
  }

  return (
    <View style={styles.topContainer}>
      <AppIcon style={styles.appIcon}/>
      <View>
        {navigationHistoryItems && navigationHistoryItems.map((item) => {
          return (
            NavigationButton(item)
          );})
        }
        <Text style={styles.currentPageTitle}>
          {mainTitle}
        </Text>
      </View>
    </View>
  );
}


export default TopAppBar;