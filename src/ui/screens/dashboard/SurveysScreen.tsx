import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import IAction from '../../../business-logic/model/IAction';
import ISurvey from '../../../business-logic/model/ISurvey';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import SurveyService from '../../../business-logic/services/SurveyService';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { setCurrentSurvey, setSMQScreenSource, setSMQSurveysListCount } from '../../../business-logic/store/slices/appStateReducer';
import { RootState } from '../../../business-logic/store/store';

import { IRootStackParams } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
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
      onPress: () => remove(selectedSurvey as ISurvey),
    }
  ];
  // Synchronous Methods
  function navigateBack() {
    dispatch(setSMQSurveysListCount(surveys.length));
    navigation.goBack();
  }

  function navigateToSurvey(survey: ISurvey) {
    dispatch(setCurrentSurvey(survey));
    dispatch(setSMQScreenSource(t('dashboard.sections.actions.surveys')));
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

  // Async Methods
  async function loadSurveys() {
    try {
      const surveys = await SurveyService.getInstance().getAll(token);
      setSurveys(surveys);
    } catch (error) {
      console.log('Error loading surveys', error);
    }
  }

  async function exportToCSV(survey: ISurvey) {
    // export to csv
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
    </>
  );
}

export default SurveysScreen;
