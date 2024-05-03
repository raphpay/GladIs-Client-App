import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import SMQManager from '../../../../business-logic/manager/SMQManager';

import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

type SMQBuyScreenProps = {
  buyProcessusPilotName: string;
  setBuyProcessusPilotName: React.Dispatch<React.SetStateAction<string>>;
};

function SMQBuyScreen(props: SMQBuyScreenProps): React.JSX.Element {

  const { t } = useTranslation();
  const { buyProcessusPilotName, setBuyProcessusPilotName } = props;

  // Async Methods
  async function loadInfos() {
    const currentSurvey = await SMQManager.getInstance().getSurvey();
    if (currentSurvey) {
      const surveyData = JSON.parse(currentSurvey?.value);
      if (surveyData) {
        setBuyProcessusPilotName(surveyData['29']);
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
      <Text style={styles.sectionTitle}>{t('smqSurvey.prs.buy.title')}</Text>
      <GladisTextInput
        value={buyProcessusPilotName}
        onValueChange={setBuyProcessusPilotName}
        placeholder={t('smqSurvey.prs.management.processusPilotName')}
        showTitle={true}
      />
    </>
  );
}

export default SMQBuyScreen;
