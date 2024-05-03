import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import SMQManager from '../../../../business-logic/manager/SMQManager';

import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

type SMQMeasurementAndImprovementProps = {
  measurementProcessusPilotName: string;
  setMeasurementProcessusPilotName: React.Dispatch<React.SetStateAction<string>>;
};

function SMQMeasurementAndImprovement(props: SMQMeasurementAndImprovementProps): React.JSX.Element {

  const {
    measurementProcessusPilotName,
    setMeasurementProcessusPilotName
  } = props;
  const { t } = useTranslation();

  // Async Methods
  async function loadInfos() {
    const currentSurvey = await SMQManager.getInstance().getSurvey();
    if (currentSurvey) {
      const surveyData = JSON.parse(currentSurvey?.value);
      if (surveyData) {
        setMeasurementProcessusPilotName(surveyData['20']);
      }
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    loadInfos();
  }, []);

  // Component
  return (
    <>
      <Text style={styles.sectionTitle}>{t('smqSurvey.prs.measurement.title')}</Text>
      <GladisTextInput
        value={measurementProcessusPilotName}
        onValueChange={setMeasurementProcessusPilotName}
        placeholder={t('smqSurvey.prs.management.processusPilotName')}
        showTitle={true}
      />
    </>
  );
}

export default SMQMeasurementAndImprovement;
