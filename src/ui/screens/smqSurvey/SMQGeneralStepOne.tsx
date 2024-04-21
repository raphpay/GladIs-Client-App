import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import ExpandingTextInput from '../../components/TextInputs/ExpandingTextInput';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';

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
};

function SMQGeneralStepOne(props: SMQGeneralStepOneProps): React.JSX.Element {

  const {
    companyName, setCompanyName,
    companyHistory, setCompanyHistory,
    managerName, setManagerName,
    medicalDevices, setMedicalDevices,
    clients, setClients,
    area, setArea,
  } = props;
  const { t } = useTranslation();
  const { currentClient } = useAppSelector((state: RootState) => state.users);

  // Sync Methods
  function loadInfos() {
    if (currentClient) {
      setCompanyName(currentClient.companyName);
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    loadInfos();
  }, []);

  // Components
  return (
    <ScrollView>
      <GladisTextInput
        value={companyName}
        onValueChange={setCompanyName}
        placeholder={t('quotation.companyName')}
        showTitle={true}
      />
      <ExpandingTextInput
        text={companyHistory}
        setText={setCompanyHistory}
        placeholder={t('smqSurvey.companyHistory')}
      />
      <GladisTextInput
        value={managerName}
        onValueChange={setManagerName}
        placeholder={t('smqSurvey.managerName')}
        showTitle={true}
      />
      <GladisTextInput
        value={medicalDevices}
        onValueChange={setMedicalDevices}
        placeholder={t('smqSurvey.medicalDevices')}
        showTitle={true}
      />
      <GladisTextInput
        value={clients}
        onValueChange={setClients}
        placeholder={t('smqSurvey.clients')}
        showTitle={true}
      />
      <GladisTextInput
        value={area}
        onValueChange={setArea}
        placeholder={t('smqSurvey.area')}
        showTitle={true}
      />
    </ScrollView>
  );
}

export default SMQGeneralStepOne;
