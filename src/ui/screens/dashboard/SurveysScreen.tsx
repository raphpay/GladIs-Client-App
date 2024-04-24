import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ISurvey from '../../../business-logic/model/ISurvey';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import SurveyService from '../../../business-logic/services/SurveyService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IRootStackParams } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Grid from '../../components/Grid/Grid';
import Toast from '../../components/Toast';
import SurveyRow from './SurveyRow';

type SurveysScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.SurveysScreen>;

function SurveysScreen(props: SurveysScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { t } = useTranslation();
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const clipboardIcon = require('../../assets/images/list.clipboard.png');
  // States
  const [surveys, setSurveys] = useState<ISurvey[]>([]);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

  // Synchronous Methods
  function navigateBack() {
    navigation.goBack();
  }

  // Async Methods
  async function loadSurveys() {
    try {
      const surveys = await SurveyService.getInstance().getAll(token);
      setSurveys(surveys);
    } catch (error) {
      
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
              renderItem={({ item }) => <SurveyRow survey={item} />}
            />
          )
        }
      </AppContainer>
      {ToastContent()}
    </>
  );
}

export default SurveysScreen;
