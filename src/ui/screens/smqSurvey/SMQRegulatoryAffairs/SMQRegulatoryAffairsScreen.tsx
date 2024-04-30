import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import IAction from '../../../../business-logic/model/IAction';
import { ISurveyInput } from '../../../../business-logic/model/ISurvey';
import CacheKeys from '../../../../business-logic/model/enums/CacheKeys';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import CacheService from '../../../../business-logic/services/CacheService';
import SurveyService from '../../../../business-logic/services/SurveyService';
import { useAppDispatch, useAppSelector } from '../../../../business-logic/store/hooks';
import { resetCurrentSurvey, setSMQSurveysListCount } from '../../../../business-logic/store/slices/smqReducer';
import { RootState } from '../../../../business-logic/store/store';
import { ISMQSurveyParams } from '../../../../navigation/Routes';

import AppContainer from '../../../components/AppContainer/AppContainer';
import TextButton from '../../../components/Buttons/TextButton';
import Dialog from '../../../components/Dialogs/Dialog';
import SurveyPageCounter from '../../../components/SurveyPageCounter';
import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';


type SMQRegulatoryAffairsProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQRegulatoryAffairsScreen>;

function SMQRegulatoryAffairs(props: SMQRegulatoryAffairsProps): React.JSX.Element {

  const { t } = useTranslation();
  const { navigation } = props;
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const { currentSurvey, smqScreenSource, smqSurveysListCount } = useAppSelector((state: RootState) => state.smq);
  const dispatch = useAppDispatch();
  // States
  const [processusPilotName, setProcessusPilotName] = React.useState<string>('');
  const [safeguardMeasures, setSafeguardMeasures] = React.useState<string>('');
  // Dialog
  const [showWarningDialog, setShowWarningDialog] = React.useState<boolean>(false);

  const navigationHistoryItems: IAction[] = [
    {
      title: t('smqSurvey.prs.resourcesManagement.title'),
      onPress: () => navigateBack(),
    }
  ];

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  function isFormFilled() {
    let isFilled = false;
    isFilled = processusPilotName.length > 0;
    return isFilled;
  }

  // Async Methods
  async function tappedContinue() {
    if (smqScreenSource === NavigationRoutes.SurveysScreen) {
      navigation.navigate(NavigationRoutes.SurveysScreen);
    } else {
      const clientSurvey = await buildClientSurvey();
      const isFormFilledCached = await CacheService.getInstance().retrieveValue(CacheKeys.isSMQFormFilled);
      if (isFormFilled() && isFormFilledCached) {
        await sendClientSurvey(clientSurvey, currentClient?.id as string);
      } else {
        setShowWarningDialog(true);
      }
    }
  }

  // TODO: Save this correctly like the other screens
  async function buildClientSurvey(): Promise<any> {
    let currentClientID: string;
    if (currentSurvey) {
      currentClientID = currentSurvey.client.id as string;
    } else {
      currentClientID = currentClient?.id as string;
    }
    const clientSurvey = {
      "currentClientID": currentClientID,
      "survey": {
        "31": processusPilotName,
        "32": safeguardMeasures
      }
    };

    // Retrieve existing client survey data
    let cachedSurvey: any;
    try {
      cachedSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
    } catch (error) {
      console.log('Error retrieving cached survey', error);
    }

    if (cachedSurvey.survey) {
      const concatenetedJSON = Object.assign(cachedSurvey.survey, clientSurvey.survey);
      const survey = {
        "currentClientID": currentClient?.id,
        "survey": concatenetedJSON,
      };
      cachedSurvey = survey;
    } else {
      cachedSurvey = clientSurvey;
    }

    return cachedSurvey;
  }

  async function sendClientSurvey(clientSurvey: any, clientID: string) {
    try {
      const apiSurvey: ISurveyInput = {
        value: JSON.stringify(clientSurvey),
        clientID
      };
      await SurveyService.getInstance().createSurvey(apiSurvey, token);
    } catch (error) {
      console.log('Error saving survey', error);
    }
    await removeCachedSurvey();
    dispatch(resetCurrentSurvey());
    dispatch(setSMQSurveysListCount(smqSurveysListCount + 1));
    setShowWarningDialog(false);
    navigation.navigate(NavigationRoutes.SystemQualityScreen);
  }

  async function sendWithoutFilledForm() {
    const clientSurvey = await buildClientSurvey();
    await sendClientSurvey(clientSurvey, currentClient?.id as string);
  }

  async function removeCachedSurvey() {
    try {
      await CacheService.getInstance().removeValueAt(CacheKeys.clientSurvey);
    } catch (error) {
      console.log('Error caching client survey', error);
    }
  }

  async function loadInfos() {
    if (currentSurvey) {
      loadFromCurrentSurvey();
    } else {
      await loadFromCache();
    }
  }

  async function loadFromCurrentSurvey() {
    const surveyValue = JSON.parse(currentSurvey.value);
    const regulatoryAffairs = surveyValue?.survey;
    if (regulatoryAffairs) {
      setProcessusPilotName(regulatoryAffairs[31]);
      setSafeguardMeasures(regulatoryAffairs[32]);
    }
  }

  async function loadFromCache() {
    try {
      const cachedSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
      const regulatoryAffairs = cachedSurvey?.survey?.prs?.regulatoryAffairs;
      if (regulatoryAffairs) {
        setProcessusPilotName(regulatoryAffairs.processusPilotName);
        setSafeguardMeasures(regulatoryAffairs.safeguardMeasures);
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

  // Components
  function FinishButton() {
    return (
      <View style={styles.sendButtonContainer}>
        <TextButton
          width={'100%'}
          title={t('smqSurvey.finish')}
          onPress={tappedContinue}
        />
      </View>
    );
  }

  function AdditionnalComponent() {
    return (
      <View style={styles.additionalComponent}>
        <SurveyPageCounter page={10}/>
        {FinishButton()}
      </View>
    );
  }

  function WarningDialogContent() {
    return (
      <Dialog
        title={t('smqSurvey.dialog.warning.title')}
        description={t('smqSurvey.dialog.warning.description')}
        confirmTitle={t('smqSurvey.dialog.warning.confirm')}
        cancelTitle={t('smqSurvey.dialog.warning.cancel')}
        isConfirmAvailable={true}
        isCancelAvailable={true}
        onConfirm={() => sendWithoutFilledForm()}
        onCancel={() => setShowWarningDialog(false)}
      />
    );
  }

  return (
    <>
      <AppContainer
        mainTitle={t('smqSurvey.prs.regulatoryAffairs.title')}
        showSearchText={false}
        showSettings={false}
        showBackButton={true}
        navigateBack={navigateBack}
        navigationHistoryItems={navigationHistoryItems}
        additionalComponent={AdditionnalComponent()}
      >
        <ScrollView>
          <GladisTextInput
            value={processusPilotName}
            onValueChange={setProcessusPilotName}
            placeholder={t('smqSurvey.prs.management.processusPilotName')}
            showTitle={true}
          />
          <GladisTextInput
            value={safeguardMeasures}
            onValueChange={setSafeguardMeasures}
            placeholder={t('smqSurvey.prs.regulatoryAffairs.safeguardMeasures')}
            showTitle={true}
          />
        </ScrollView>
      </AppContainer>
      {showWarningDialog && WarningDialogContent()}
    </>
  );
}

export default SMQRegulatoryAffairs;
