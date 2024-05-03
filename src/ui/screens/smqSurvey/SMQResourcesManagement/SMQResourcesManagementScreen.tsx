import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import SMQManager from '../../../../business-logic/manager/SMQManager';

import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

type SMQResourcesManagementProps = {
  resProcessusPilotName: string;
  setResProcessusPilotName: React.Dispatch<React.SetStateAction<string>>;
  editable: boolean;
};

function SMQResourcesManagementScreen(props: SMQResourcesManagementProps): React.JSX.Element {

  const { t } = useTranslation();
  const {
    resProcessusPilotName,
    setResProcessusPilotName,
    editable
  } = props;

  // Async Methods
  async function loadInfos() {
    const currentSurvey = await SMQManager.getInstance().getSurvey();
    if (currentSurvey) {
      const surveyData = JSON.parse(currentSurvey?.value);
      if (surveyData) {
        setResProcessusPilotName(surveyData['30']);
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
      <Text style={styles.sectionTitle}>{t('smqSurvey.prs.resourcesManagement.title')}</Text>
      <GladisTextInput
        value={resProcessusPilotName}
        onValueChange={setResProcessusPilotName}
        placeholder={t('smqSurvey.prs.management.processusPilotName')}
        showTitle={true}
        editable={editable}
      />
    </>
  );
}

export default SMQResourcesManagementScreen;
