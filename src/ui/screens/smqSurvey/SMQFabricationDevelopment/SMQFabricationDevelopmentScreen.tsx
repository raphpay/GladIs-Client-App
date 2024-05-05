import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';



import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

import SMQManager from '../../../../business-logic/manager/SMQManager';
import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

type SMQFabricationDevelopmentScreenProps = {
  fabProcessusPilotName: string,
  setFabProcessusPilotName: React.Dispatch<React.SetStateAction<string>>;
  fabProductionFlux: string,
  setFabProductionFlux: React.Dispatch<React.SetStateAction<string>>;
  fabProductIdentifications: string,
  setFabProductIdentifications: React.Dispatch<React.SetStateAction<string>>;
  fabProductPreservation: string,
  setFabProductPreservation: React.Dispatch<React.SetStateAction<string>>;
  fabProductTracking: string,
  setFabProductTracking: React.Dispatch<React.SetStateAction<string>>;
  editable: boolean;
};

function SMQFabricationDevelopmentScreen(props: SMQFabricationDevelopmentScreenProps): React.JSX.Element {

  const { 
    fabProcessusPilotName, setFabProcessusPilotName,
    fabProductionFlux, setFabProductionFlux,
    fabProductIdentifications, setFabProductIdentifications,
    fabProductPreservation, setFabProductPreservation,
    fabProductTracking, setFabProductTracking,
    editable
  } = props;
  const { t } = useTranslation();

  // Async Methods
  async function loadInfos() {
    const currentSurvey = await SMQManager.getInstance().getSurvey();
    if (currentSurvey) {
      const surveyData = JSON.parse(currentSurvey?.value);
      if (surveyData) {
        setFabProcessusPilotName(surveyData['21']);
        setFabProductionFlux(surveyData['22']);
        setFabProductIdentifications(surveyData['23']);
        setFabProductTracking(surveyData['24']);
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
      <Text style={styles.sectionTitle}>{t('smqSurvey.prs.fabricationDevelopment.title')}</Text>
      <GladisTextInput
        value={fabProcessusPilotName}
        onValueChange={setFabProcessusPilotName}
        placeholder={t('smqSurvey.prs.management.processusPilotName')}
        showTitle={true}
        editable={editable}
      />
      <GladisTextInput
        value={fabProductionFlux}
        onValueChange={setFabProductionFlux}
        placeholder={t('smqSurvey.prs.fabricationDevelopment.productionFlux')}
        showTitle={true}
        editable={editable}
      />
      <GladisTextInput
        value={fabProductIdentifications}
        onValueChange={setFabProductIdentifications}
        placeholder={t('smqSurvey.prs.fabricationDevelopment.productIdentifications')}
        showTitle={true}
        editable={editable}
      />
      <GladisTextInput
        value={fabProductPreservation}
        onValueChange={setFabProductPreservation}
        placeholder={t('smqSurvey.prs.fabricationDevelopment.productPreservation')}
        showTitle={true}
        editable={editable}
      />
      <GladisTextInput
        value={fabProductTracking}
        onValueChange={setFabProductTracking}
        placeholder={t('smqSurvey.prs.fabricationDevelopment.productTracking')}
        showTitle={true}
        editable={editable}
      />
    </>
  );
}

export default SMQFabricationDevelopmentScreen;
