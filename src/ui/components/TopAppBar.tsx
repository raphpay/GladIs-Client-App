import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import IAction from '../../business-logic/model/IAction';

import AppIcon from './AppIcon';

import styles from '../assets/styles/components/TopAppBarStyles';

type TopAppBarProps = {
  mainTitle: string;
  navigationHistoryItems?: IAction[];
};

function TopAppBar(props: TopAppBarProps): React.JSX.Element {
  const { mainTitle, navigationHistoryItems } = props;

  function NavigationButton(item: IAction) {
    return (
      <View style={styles.navigationHistoryContainer} key={item.title}>
        <TouchableOpacity onPress={item.onPress}>
          <Text style={styles.navigationHistory}>
            {item.title}
          </Text>
        </TouchableOpacity>
        <Image style={styles.chevron} source={require('../assets/images/chevron.right.png')}/>
      </View>
    );
  }

  return (
    <View style={styles.topContainer}>
      <AppIcon style={styles.appIcon}/>
      <View>
        <View style={styles.navigationButtonContainer}>
          {navigationHistoryItems && navigationHistoryItems.map((item) => {
            return (
              NavigationButton(item)
            );})
          }
        </View>
        <Text style={styles.currentPageTitle}>
          {mainTitle}
        </Text>
      </View>
    </View>
  );
}


export default TopAppBar;