import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import SMQManager from '../../../../business-logic/manager/SMQManager';

import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';


type SMQManagementScreenProps = {
  managementProcessusPilotName: string;
  setManagementProcessusPilotName: React.Dispatch<React.SetStateAction<string>>;
};

function SMQManagementScreen(props: SMQManagementScreenProps): React.JSX.Element {

  const {
    managementProcessusPilotName,
    setManagementProcessusPilotName
  } = props;
  const { t } = useTranslation();

  async function loadInfos() {
    const currentSurvey = await SMQManager.getInstance().getSurvey();
    if (currentSurvey) {
      const surveyData = JSON.parse(currentSurvey?.value);
      if (surveyData) {
        setManagementProcessusPilotName(surveyData['19']);
      }
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadInfos();
    }
    init();
  }, []);

  // Component
  return (
    <>
      <Text style={styles.sectionTitle}>{t('smqSurvey.prs.management.title')}</Text>
      <GladisTextInput
        value={managementProcessusPilotName}
        onValueChange={setManagementProcessusPilotName}
        placeholder={t('smqSurvey.prs.management.processusPilotName')}
        showTitle={true}
      />
    </>
  );
}

export default SMQManagementScreen;
