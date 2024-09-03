import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import IAction from '../../../business-logic/model/IAction';
import ITechnicalDocTab from '../../../business-logic/model/ITechnicalDocumentationTab';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import TechnicalDocumentationTabService from '../../../business-logic/services/TechnicalDocumentationTabService';
import UserService from '../../../business-logic/services/UserService/UserService';
import UserServiceGet from '../../../business-logic/services/UserService/UserService.get';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { setDocumentListCount } from '../../../business-logic/store/slices/appStateReducer';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer/AppContainer';
import IconButton from '../../components/Buttons/IconButton';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialogs/Dialog';
import Grid from '../../components/Grid/Grid';
import Toast from '../../components/Toast';

import styles from '../../assets/styles/documentManagement/TechnicalDocumentationScreenStyles';

type TechnicalDocAreaScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.TechnicalDocAreaScreen>;

function TechnicalDocAreaScreen(props: TechnicalDocAreaScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const [technicalTabs, setTechnicalTabs] = useState<ITechnicalDocTab[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [newTabName, setNewTabName] = useState<string>('');
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

  const plusIcon = require('../../assets/images/plus.png');
  const clipboardIcon = require('../../assets/images/list.clipboard.png');

  const { navigation } = props;
  const { area } = props.route.params;

  const { t } = useTranslation();

  const { currentClient, isAdmin } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { documentListCount } = useAppSelector((state: RootState) => state.appState);
  const dispatch = useAppDispatch();

  const navigationHistoryItems: IAction[] = [
    {
      title: t('dashboard.title'),
      onPress: () => navigateToDashboard(),
    },
    {
      title: t('documentManagement.title'),
      onPress: () => navigateBack(),
    },
    {
      title: t('technicalDocumentation.title'),
      onPress: () => navigateToTechnicalDocumentation(),
    }
  ];

  const technicalTabsFiltered = technicalTabs.filter(technicalTab =>
    technicalTab.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  function navigateToTechnicalDocumentation() {
    navigation.navigate(NavigationRoutes.TechnicalDocumentationScreen);
  }

  function navigateToDashboard() {
    navigation.navigate(isAdmin ? NavigationRoutes.ClientDashboardScreenFromAdmin : NavigationRoutes.DashboardScreen);
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

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  // Async Methods
  async function addTab() {
    try {
      const newTab: ITechnicalDocTab = {
        name: newTabName,
        area: area.id
      };
      const createdTab = await TechnicalDocumentationTabService.getInstance().createTab(newTab, token);
      await UserService.getInstance().addTabToUser(currentClient?.id, createdTab, token);
      await loadTabs();
      setShowDialog(false);
      setNewTabName('');
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(t(`errors.api.${errorMessage}`), true);
    }
  }

  async function loadTabs() {
    try {
      const tabs = await UserServiceGet.getUsersTabs(currentClient?.id, token)
      const areaTabs = tabs.filter(tab => {
        return tab.area === area.id.toLowerCase();
      })
      setTechnicalTabs(areaTabs);
    } catch (error) {
      console.log('Error getting tabs', error);
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadTabs();
    }
    init();
  }, []);

  // Components
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

  function ToastContent() {
    return (
      <>
        {
          showToast && (
            <Toast
              message={toastMessage}
              isVisible={showToast}
              setIsVisible={setShowToast}
              isShowingError={toastIsShowingError}
            />
          )
        }
      </>
    )
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
      {ToastContent()}
    </>
  );
}

export default TechnicalDocAreaScreen;