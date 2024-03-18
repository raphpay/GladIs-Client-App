import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import INavigationHistoryItem from '../../../business-logic/model/INavigationHistoryItem';
import ITechnicalDocTab from '../../../business-logic/model/ITechnicalDocumentationTab';
import CacheKeys from '../../../business-logic/model/enums/CacheKeys';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import CacheService from '../../../business-logic/services/CacheService';
import TechnicalDocumentationTabService from '../../../business-logic/services/TechnicalDocumentationTabService';
import UserService from '../../../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { setDocumentListCount } from '../../../business-logic/store/slices/appStateReducer';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialog';
import Grid from '../../components/Grid';
import IconButton from '../../components/IconButton';

import styles from '../../assets/styles/documentManagement/TechnicalDocumentationScreenStyles';

type TechnicalDocAreaScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.TechnicalDocAreaScreen>;

function TechnicalDocAreaScreen(props: TechnicalDocAreaScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const [technicalTabs, setTechnicalTabs] = useState<ITechnicalDocTab[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [newTabName, setNewTabName] = useState<string>('');

  const plusIcon = require('../../assets/images/plus.png');
  const clipboardIcon = require('../../assets/images/list.clipboard.png');

  const { navigation } = props;
  const { area } = props.route.params;
  const { t } = useTranslation();
  const { currentUser, currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { documentListCount } = useAppSelector((state: RootState) => state.appState);
  const dispatch = useAppDispatch();

  const navigationHistoryItems: INavigationHistoryItem[] = [
    {
      title: t('dashboard.title'),
      action: () => navigateToDashboard(),
    },
    {
      title: t('documentManagement.title'),
      action: () => navigateBack(),
    },
    {
      title: t('technicalDocumentation.title'),
      action: () => navigateToTechnicalDocumentation(),
    }
  ];
  const technicalTabsFiltered = technicalTabs.filter(technicalTab =>
    technicalTab.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  function navigateBack() {
    navigation.goBack();
  }

  function navigateToTechnicalDocumentation() {
    navigation.navigate(NavigationRoutes.TechnicalDocumentationScreen);
  }

  function navigateToDashboard() {
    navigation.navigate(currentUser?.userType == UserType.Admin ? NavigationRoutes.ClientDashboardScreenFromAdmin : NavigationRoutes.DashboardScreen);
  }

  function navigateTo(item: ITechnicalDocTab) {
    dispatch(setDocumentListCount(documentListCount + 1));
    navigation.navigate(NavigationRoutes.DocumentsScreen, {
      previousScreen: area.name,
      currentScreen: item.name,
      processNumber: undefined,
      documentsPath: `technicalDocumentation/${area.name}/${item.name}`
    });
  }

  async function addTab() {
    const newTab: ITechnicalDocTab = {
      name: newTabName,
      area: area.id
    };
    const createdTab = await TechnicalDocumentationTabService.getInstance().createTab(newTab, token);
    await UserService.getInstance().addTabToUser(currentClient?.id, createdTab, token);
    setShowDialog(false);
  }

  async function getUser() {
    const userID = await CacheService.getInstance().retrieveValue(CacheKeys.currentUserID) as string;
    const user = await UserService.getInstance().getUserByID(userID);
    setIsAdmin(user.userType == UserType.Admin);
  }

  async function getTabs() {
    const tabs = await UserService.getInstance().getUsersTabs(currentClient?.id, token)
    const areaTabs = tabs.filter(tab => {
      return tab.area === area.id.toLowerCase();
    })
    setTechnicalTabs(areaTabs);
  }

  useEffect(() => {
    async function init() {
      await getUser();
      await getTabs();
    }
    init();
  }, []);

  function TabGridItem(item: ITechnicalDocTab) {
    return (
      <TouchableOpacity onPress={() => navigateTo(item)}>
        <View style={styles.processusContainer}>
          <Text style={styles.categoryTitle}>{t(`technicalDocumentation.tab.${item.name}`)}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  function appContainerChildren() {
    return (
      <>
        {
          technicalTabsFiltered.length === 0 ? (
            <ContentUnavailableView
              title={t('technicalDocumentation.noTabs.title')}
              message={
                isAdmin ?
                  t('technicalDocumentation.noTabs.admin') :
                  t('technicalDocumentation.noTabs.client')
              }
              image={clipboardIcon}
            />
          ) : (
            <Grid
              data={technicalTabsFiltered}
              renderItem={(renderItem) => TabGridItem(renderItem.item)}
            />
          )
        }
      </>
    );
  }

  return (
    <>
      <AppContainer 
        mainTitle={area.name}
        searchText={searchText}
        setSearchText={setSearchText}
        showBackButton={true}
        showSearchText={true}
        showSettings={true}
        navigateBack={navigateBack}
        navigationHistoryItems={navigationHistoryItems}
        adminButton={(
          isAdmin ? (
            <IconButton
              title={t('components.buttons.addTab')}
              icon={plusIcon}
              onPress={() => setShowDialog(true)}
            />
          ) : undefined
        )}
        children={appContainerChildren()}
      />
      {
        showDialog && (
          <Dialog
            title={t('components.dialog.technicalDocTab.title')}
            confirmTitle={t('components.dialog.technicalDocTab.confirmButton')}
            isConfirmDisabled={newTabName.length == 0}
            onConfirm={addTab}
            isCancelAvailable={true}
            onCancel={() => setShowDialog(false)}
          >
            <TextInput
              value={newTabName}
              onChangeText={setNewTabName}
              placeholder={t('components.dialog.technicalDocTab.placeholder')}
              style={styles.dialogInput}
            />
          </Dialog>
        )
      }
    </>
  );
}

export default TechnicalDocAreaScreen;