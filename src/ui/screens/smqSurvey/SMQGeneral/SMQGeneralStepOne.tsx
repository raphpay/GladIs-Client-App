import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import CacheKeys from '../../../../business-logic/model/enums/CacheKeys';
import CacheService from '../../../../business-logic/services/CacheService';
import { useAppSelector } from '../../../../business-logic/store/hooks';
import { RootState } from '../../../../business-logic/store/store';

import ExpandingTextInput from '../../../components/TextInputs/ExpandingTextInput';
import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

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

  // Async Methods
  async function loadInfos() {
    if (currentClient) {
      setCompanyName(currentClient.companyName);
    }
    try {
      const cachedClientSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
      if (cachedClientSurvey) {
        const generalSection = cachedClientSurvey.survey.generalSection;
        setCompanyHistory(generalSection.companyHistory);
        setManagerName(generalSection.managerName);
        setMedicalDevices(generalSection.medicalDevices);
        setClients(generalSection.clients);
        setArea(generalSection.area);
      }
    } catch (error) {
      console.log('Error retrieving cached client survey value', error);
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
        placeholder={t('smqSurvey.generalInfo.stepOne.companyHistory')}
      />
      <GladisTextInput
        value={managerName}
        onValueChange={setManagerName}
        placeholder={t('smqSurvey.generalInfo.stepOne.managerName')}
        showTitle={true}
      />
      <GladisTextInput
        value={medicalDevices}
        onValueChange={setMedicalDevices}
        placeholder={t('smqSurvey.generalInfo.stepOne.medicalDevices')}
        showTitle={true}
      />
      <GladisTextInput
        value={clients}
        onValueChange={setClients}
        placeholder={t('smqSurvey.generalInfo.stepOne.clients')}
        showTitle={true}
      />
      <GladisTextInput
        value={area}
        onValueChange={setArea}
        placeholder={t('smqSurvey.generalInfo.stepOne.area')}
        showTitle={true}
      />
    </ScrollView>
  );
}

export default SMQGeneralStepOne;
