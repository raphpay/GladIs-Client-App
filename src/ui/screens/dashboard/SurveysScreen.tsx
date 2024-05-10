import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import SMQManager from '../../../business-logic/manager/SMQManager';
import IAction from '../../../business-logic/model/IAction';
import ISurvey from '../../../business-logic/model/ISurvey';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import SurveyService from '../../../business-logic/services/SurveyService';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { setSMQSurveysListCount } from '../../../business-logic/store/slices/smqReducer';
import { RootState } from '../../../business-logic/store/store';

import { IRootStackParams } from '../../../navigation/Routes';

import Clipboard from '@react-native-clipboard/clipboard';
import { setIsUpdatingSurvey, setSMQScreenSource } from '../../../business-logic/store/slices/smqReducer';
import Utils from '../../../business-logic/utils/Utils';
import AppContainer from '../../components/AppContainer/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialogs/Dialog';
import Grid from '../../components/Grid/Grid';
import Toast from '../../components/Toast';
import TooltipAction from '../../components/TooltipAction';
import SurveyRow from './SurveyRow';

type SurveysScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.SurveysScreen>;

function SurveysScreen(props: SurveysScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { t } = useTranslation();
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const dispatch = useAppDispatch();
  const clipboardIcon = require('../../assets/images/list.clipboard.png');
  // States
  const [surveys, setSurveys] = useState<ISurvey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<ISurvey>();
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);
  // Tooltip Action
  const [showActionDialog, setShowActionDialog] = useState<boolean>(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState<boolean>(false);

  const popoverActions: IAction[] = [
    {
      title: t('smqSurvey.tooltip.open'),
      onPress: () => navigateToSurvey(selectedSurvey as ISurvey),
    },
    {
      title: t('smqSurvey.tooltip.export'),
      onPress: () => exportToCSV(selectedSurvey as ISurvey),
    },
    {
      title: t('smqSurvey.tooltip.delete'),
      onPress: () => displayRemoveDialog(),
      isDestructive: true,
    }
  ];
  // Synchronous Methods
  function navigateBack() {
    dispatch(setSMQSurveysListCount(surveys.length));
    navigation.goBack();
  }

  function navigateToSurvey(survey: ISurvey) {
    SMQManager.getInstance().set(survey);
    SMQManager.getInstance().setClientID(survey.client.id);
    dispatch(setSMQScreenSource(NavigationRoutes.SurveysScreen));
    dispatch(setIsUpdatingSurvey(true));
    setShowActionDialog(false);
    navigation.navigate(NavigationRoutes.SMQSurveyStack);
  }

  function openActionDialog(survey: ISurvey) {
    setSelectedSurvey(survey);
    setShowActionDialog(true);
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  function exportToCSV(survey: ISurvey) {
    // export to csv
    const surveyValue = JSON.parse(survey.value);
    const csv = Utils.convertJSONToCSV(surveyValue);
    Clipboard.setString(csv);
    // Display toast
    displayToast(t('smqSurvey.toast.csvCopied'));
    // Hide alert
    setShowActionDialog(false);
  }
  
  // Async Methods
  async function loadSurveys() {
    try {
      const surveys = await SurveyService.getInstance().getAll(token);
      setSurveys(surveys);
    } catch (error) {
      console.log('Error loading surveys', error);
    }
  }

  function displayRemoveDialog() {
    setShowActionDialog(false);
    setShowRemoveDialog(true);
  }

  async function remove(survey: ISurvey) {
    try {
      await SurveyService.getInstance().delete(survey?.id as string, token);
      displayToast(t('smqSurvey.toast.deleted'));
      await loadSurveys();
      setShowActionDialog(false);
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(errorMessage, true);
    }
    setShowRemoveDialog(false);
  } 

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadSurveys();
    }
    init();
  }, []);

  // Components
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
    );
  }

  function TooltipActionContent() {
    return (
      <TooltipAction
        showDialog={showActionDialog}
        title={t('dashboard.sections.actions.surveys')}
        onConfirm={() => setShowActionDialog(false)}
        onCancel={() => setShowActionDialog(false)}
        popoverActions={popoverActions}
      />
    );
  }

  function RemoveDialog() {
    return (
      <Dialog
        title={t('smqSurvey.dialog.delete.title')}
        description={t('smqSurvey.dialog.delete.description')}
        confirmTitle={t('smqSurvey.dialog.delete.confirm')}
        isConfirmAvailable={true}
        onConfirm={() => remove(selectedSurvey as ISurvey)}
        cancelTitle={t('smqSurvey.dialog.delete.cancel')}
        isCancelAvailable={true}
        onCancel={() => setShowRemoveDialog(false)}
      />
    )
  }
   
  return (
    <>
      <AppContainer
        mainTitle={t('dashboard.sections.actions.surveys')}
        showBackButton={true}
        showSearchText={false}
        showSettings={true}
        navigateBack={navigateBack}
      >
        {
          surveys.length === 0 ? (
            <ContentUnavailableView
              title={t('passwordsToReset.noTokens.title')}
              message={t('passwordsToReset.noTokens.message')}
              image={clipboardIcon}
            />
          ) : (
            <Grid
              data={surveys}
              renderItem={({ item }) => <SurveyRow survey={item} openActionDialog={openActionDialog} />}
            />
          )
        }
      </AppContainer>
      {ToastContent()}
      {TooltipActionContent()}
      { showRemoveDialog && RemoveDialog() }
    </>
  );
}

export default SurveysScreen;
