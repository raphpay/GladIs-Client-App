import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import IAction from '../../business-logic/model/IAction';

import AppIcon from './AppIcon';
import GladisTextInput from './GladisTextInput';

import styles from '../assets/styles/components/TopAppBarStyles';

type TopAppBarProps = {
  mainTitle: string;
  navigationHistoryItems?: IAction[];
  extraButton?: JSX.Element;
  searchText?: string;
  setSearchText?: React.Dispatch<React.SetStateAction<string>>;
  showSearchText: boolean;
  searchTextPlaceholder?: string;
};

function TopAppBar(props: TopAppBarProps): React.JSX.Element {
  const {
    mainTitle,
    navigationHistoryItems,
    extraButton,
    searchText, setSearchText, showSearchText, searchTextPlaceholder
  } = props;

  const { t } = useTranslation();

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
      <View style={styles.navigationMainContainer}>
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
      <View style={styles.rightContainer}>
        <GladisTextInput
          value={searchText}
          onValueChange={setSearchText}
          placeholder={searchTextPlaceholder ?? t('components.searchTextInput.placeholder')}
          width={200}
        />
        <View style={{paddingLeft: 20, paddingBottom: 8}}>
          {extraButton && extraButton}
        </View>
      </View>
    </View>
  );
}


export default TopAppBar;