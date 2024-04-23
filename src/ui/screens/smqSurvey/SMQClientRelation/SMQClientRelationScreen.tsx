import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  View
} from 'react-native';
import IAction from '../../../../business-logic/model/IAction';
import CacheKeys from '../../../../business-logic/model/enums/CacheKeys';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import CacheService from '../../../../business-logic/services/CacheService';
import { useAppSelector } from '../../../../business-logic/store/hooks';
import { RootState } from '../../../../business-logic/store/store';
import { ISMQSurveyParams } from '../../../../navigation/Routes';
import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';
import AppContainer from '../../../components/AppContainer/AppContainer';
import TextButton from '../../../components/Buttons/TextButton';
import GladisTextInput from '../../../components/TextInputs/GladisTextInput';


type SMQClientRelationScreenProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQClientRelationScreen>;

function SMQClientRelationScreen(props: SMQClientRelationScreenProps): React.JSX.Element {

  const { t } = useTranslation();
  const { navigation } = props;
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  // States
  const [processusPilotName, setProcessusPilotName] = React.useState<string>('');
  const [orderDeliveryNote, setOrderDeliveryNote] = React.useState<string>('');
  const [productsSold, setProductsSold] = React.useState<string>('');

  const navigationHistoryItems: IAction[] = [
    {
      title: t('smqSurvey.prs.fabricationDevelopment.title'),
      onPress: () => navigateBack(),
    }
  ];

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  function isFormFilled() {
    let isFilled = false;
    isFilled = processusPilotName.length > 0 &&
      orderDeliveryNote.length > 0 &&
      productsSold.length > 0;
    return isFilled;
  }

  // Async Methods
  async function tappedContinue() {
    const clientSurvey = {
      "currentClientID": currentClient?.id,
      "survey": {
        "prs": {
          "clientRelation": {
            processusPilotName,
            orderDeliveryNote,
            productsSold
          }
        }
      }
    };
  
    // Retrieve existing client survey data
    let existingClientSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
    if (existingClientSurvey && typeof existingClientSurvey === 'object') {
      // Update management sub-section with new data
      existingClientSurvey.survey.prs.clientRelation = clientSurvey.survey.prs.clientRelation;
      await saveClientSurvey(existingClientSurvey);
    } else {
      // No existing client survey data, save the new client survey data
      await saveClientSurvey(clientSurvey);
    }
  }

  async function saveClientSurvey(clientSurvey: any) {
    try {
      await CacheService.getInstance().removeValueAt(CacheKeys.clientSurvey);
      await CacheService.getInstance().storeValue(CacheKeys.clientSurvey, clientSurvey);
      navigation.navigate(NavigationRoutes.SMQBuyScreen);
    } catch (error) {
      console.log('Error caching client survey', error);
    }
  }

  // Components
  function ContinueButton() {
    return (
      <View style={styles.sendButtonContainer}>
        <TextButton
          width={'100%'}
          title={t('smqSurvey.continue')}
          onPress={tappedContinue}
          disabled={!isFormFilled()}
        />
      </View>
    )
  }

  async function loadInfos() {
    try {
      const cachedSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
      if (cachedSurvey.survey.prs.clientRelation) {
        setProcessusPilotName(cachedSurvey.survey.prs.clientRelation.processusPilotName);
      }
    } catch (error) {
      console.log('Error retrieving cached value', error);
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadInfos();
    }
    init()
  }, []);

  return (
    <AppContainer
      mainTitle={t('smqSurvey.prs.fabricationDevelopment.title')}
      showSearchText={false}
      showSettings={false}
      showBackButton={true}
      navigateBack={navigateBack}
      navigationHistoryItems={navigationHistoryItems}
      additionalComponent={ContinueButton()}
    >
      <ScrollView>
        <GladisTextInput
          value={processusPilotName}
          onValueChange={setProcessusPilotName}
          placeholder={t('smqSurvey.prs.management.processusPilotName')}
          showTitle={true}
        />
        <GladisTextInput
          value={orderDeliveryNote}
          onValueChange={setOrderDeliveryNote}
          placeholder={t('smqSurvey.prs.clientRelation.orderDeliveryNote')}
          showTitle={true}
        />
        <GladisTextInput
          value={productsSold}
          onValueChange={setProductsSold}
          placeholder={t('smqSurvey.prs.clientRelation.productsSold')}
          showTitle={true}
        />
      </ScrollView>
    </AppContainer>
  );
}

export default SMQClientRelationScreen;
