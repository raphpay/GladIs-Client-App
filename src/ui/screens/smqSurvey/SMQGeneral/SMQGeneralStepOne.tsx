import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import SMQManager from '../../../../business-logic/manager/SMQManager';

import ExpandingTextInput from '../../../components/TextInputs/ExpandingTextInput';
import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

import styles from '../../../assets/styles/smqSurvey/SMQGeneralScreenStyles';

type SMQGeneralStepOneProps = {
  companyName: string;
  setCompanyName: React.Dispatch<React.SetStateAction<string>>;
  companyHistory: string;
  setCompanyHistory: React.Dispatch<React.SetStateAction<string>>;
  managerName: string;
  setManagerName: React.Dispatch<React.SetStateAction<string>>;
  medicalDevices: string;
  setMedicalDevices: React.Dispatch<React.SetStateAction<string>>;
  clients: string;
  setClients: React.Dispatch<React.SetStateAction<string>>;
  area: string;
  setArea: React.Dispatch<React.SetStateAction<string>>;
  editable: boolean;
};

function SMQGeneralStepOne(props: SMQGeneralStepOneProps): React.JSX.Element {

  const {
    companyName, setCompanyName,
    companyHistory, setCompanyHistory,
    managerName, setManagerName,
    medicalDevices, setMedicalDevices,
    clients, setClients,
    area, setArea,
    editable
  } = props;

  const { t } = useTranslation();

  // Async Methods
  async function loadInfos() {
    const currentSurvey = await SMQManager.getInstance().getSurvey();
    if (currentSurvey && currentSurvey.value) {
      const surveyData = JSON.parse(currentSurvey.value);
      if (surveyData) {
        setCompanyName(surveyData['2']);
        setCompanyHistory(surveyData['3']);
        setManagerName(surveyData['4']);
        setMedicalDevices(surveyData['5']);
        setClients(surveyData['6']);
        setArea(surveyData['7']);
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

  // Components
  return (
    <>
      <Text style={styles.sectionTitle}>{t('smqSurvey.generalInfo.title')}</Text>
      <GladisTextInput
        value={companyName}
        onValueChange={setCompanyName}
        placeholder={t('quotation.companyName')}
        showTitle={true}
        editable={editable}
      />
      <ExpandingTextInput
        text={companyHistory}
        setText={setCompanyHistory}
        placeholder={t('smqSurvey.generalInfo.stepOne.companyHistory')}
      />
      <GladisTextInput
        value={managerName}
        onValueChange={setManagerName}
        placeholder={t('smqSurvey.generalInfo.stepOne.managerName')}
        showTitle={true}
        editable={editable}
      />
      <GladisTextInput
        value={medicalDevices}
        onValueChange={setMedicalDevices}
        placeholder={t('smqSurvey.generalInfo.stepOne.medicalDevices')}
        showTitle={true}
        editable={editable}
      />
      <GladisTextInput
        value={clients}
        onValueChange={setClients}
        placeholder={t('smqSurvey.generalInfo.stepOne.clients')}
        showTitle={true}
        editable={editable}
      />
      <GladisTextInput
        value={area}
        onValueChange={setArea}
        placeholder={t('smqSurvey.generalInfo.stepOne.area')}
        showTitle={true}
        editable={editable}
      />
    </>
  );
}

export default SMQGeneralStepOne;
