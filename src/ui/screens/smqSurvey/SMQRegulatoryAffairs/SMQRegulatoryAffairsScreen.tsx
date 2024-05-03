import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

import SMQManager from '../../../../business-logic/manager/SMQManager';

import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

type SMQRegulatoryAffairsProps = {
  regProcessusPilotName: string;
  setRegProcessusPilotName: React.Dispatch<React.SetStateAction<string>>;
  regSafeguardMeasures: string;
  setRegSafeguardMeasures: React.Dispatch<React.SetStateAction<string>>;
};

function SMQRegulatoryAffairs(props: SMQRegulatoryAffairsProps): React.JSX.Element {

  const { t } = useTranslation();
  const { 
    regProcessusPilotName, setRegProcessusPilotName,
    regSafeguardMeasures, setRegSafeguardMeasures,
   } = props;

  // Async Methods
  async function loadInfos() {
    const currentSurvey = await SMQManager.getInstance().getSurvey();
    if (currentSurvey) {
      const surveyData = JSON.parse(currentSurvey?.value);
      if (surveyData) {
        setRegProcessusPilotName(surveyData['31']);
        setRegSafeguardMeasures(surveyData['32']);
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
      <Text style={styles.sectionTitle}>{t('smqSurvey.prs.regulatoryAffairs.title')}</Text>
      <GladisTextInput
        value={regProcessusPilotName}
        onValueChange={setRegProcessusPilotName}
        placeholder={t('smqSurvey.prs.management.processusPilotName')}
        showTitle={true}
      />
      <GladisTextInput
        value={regSafeguardMeasures}
        onValueChange={setRegSafeguardMeasures}
        placeholder={t('smqSurvey.prs.regulatoryAffairs.safeguardMeasures')}
        showTitle={true}
      />
    </>
  );
}

export default SMQRegulatoryAffairs;
