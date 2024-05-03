import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import SMQManager from '../../../../business-logic/manager/SMQManager';
import IAction from '../../../../business-logic/model/IAction';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import { useAppDispatch, useAppSelector } from '../../../../business-logic/store/hooks';
import { resetCurrentSurvey, setSMQSurveysListCount } from '../../../../business-logic/store/slices/smqReducer';
import { RootState } from '../../../../business-logic/store/store';

import { ISMQSurveyParams } from '../../../../navigation/Routes';

import AppContainer from '../../../components/AppContainer/AppContainer';
import TextButton from '../../../components/Buttons/TextButton';
import Dialog from '../../../components/Dialogs/Dialog';
import SurveyPageCounter from '../../../components/SurveyPageCounter';
import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

import CacheKeys from '../../../../business-logic/model/enums/CacheKeys';
import CacheService from '../../../../business-logic/services/CacheService';
import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

type SMQRegulatoryAffairsProps = NativeStackScreenProps<ISMQSurveyParams, NavigationRoutes.SMQRegulatoryAffairsScreen>;

function SMQRegulatoryAffairs(props: SMQRegulatoryAffairsProps): React.JSX.Element {

  const { t } = useTranslation();
  const { navigation } = props;
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { smqScreenSource, smqSurveysListCount } = useAppSelector((state: RootState) => state.smq);
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
    if (smqScreenSource === NavigationRoutes.SurveysScreen) {
      console.log('sour', smqScreenSource );
    } else {
      // navigation.goBack();
      console.log('sour', smqScreenSource );
    }
  }

  async function loadInfos() {
    const currentSurvey = await SMQManager.getInstance().getSurvey();
    if (currentSurvey) {
      const surveyData = JSON.parse(currentSurvey?.value);
      if (surveyData) {
        setProcessusPilotName(surveyData['31']);
        setSafeguardMeasures(surveyData['32']);
      }
    }
  }

  // Async Methods
  async function tappedContinue() {
    if (smqScreenSource === NavigationRoutes.SurveysScreen) {
      navigation.navigate(NavigationRoutes.SurveysScreen);
    } else {
      const isFormFilled = SMQManager.getInstance().getHasFilledForm();
      if (isFormFilled) {
        await sendSurveyToAPI();
      } else {
        setShowWarningDialog(true);
      }
    }
  }

  async function sendSurveyToAPI() {
    await SMQManager.getInstance().continueAfterRegulatoryAffairsScreen(processusPilotName, safeguardMeasures);
    try {
      await SMQManager.getInstance().sendToAPI(token);
    } catch (error) {
      console.log('Show error', error);
    }
    dispatch(resetCurrentSurvey());
    dispatch(setSMQSurveysListCount(smqSurveysListCount + 1));
    navigation.navigate(NavigationRoutes.SystemQualityScreen);
  }

  async function sendWithoutFilledForm() {
    setShowWarningDialog(false);
    await sendSurveyToAPI();
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadInfos();
    }
    init();
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

  async function print() {
    const cache = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
    const survey = await SMQManager.getInstance().getSurvey();
  }

  function AdditionnalComponent() {
    return (
      <View style={styles.additionalComponent}>
        <SurveyPageCounter page={10}/>
        {FinishButton()}
        <TouchableOpacity onPress={print}>
          <Text>Hello</Text>
        </TouchableOpacity>
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
