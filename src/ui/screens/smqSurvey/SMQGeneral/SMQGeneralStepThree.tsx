import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import CacheKeys from '../../../../business-logic/model/enums/CacheKeys';
import CacheService from '../../../../business-logic/services/CacheService';
import { useAppSelector } from '../../../../business-logic/store/hooks';
import { RootState } from '../../../../business-logic/store/store';

import GladisTextInput from '../../../components/TextInputs/GladisTextInput';

type SMQGeneralStepThreeProps = {
  website: string;
  setWebsite: React.Dispatch<React.SetStateAction<string>>;
  auditorsName: string;
  setAuditorsName: React.Dispatch<React.SetStateAction<string>>;
  auditorsFunction: string;
  setAuditorsFunction: React.Dispatch<React.SetStateAction<string>>;
  approversName: string;
  setApproversName: React.Dispatch<React.SetStateAction<string>>;
  approversFunction: string;
  setApproversFunction: React.Dispatch<React.SetStateAction<string>>;
};

function SMQGeneralStepThree(props: SMQGeneralStepThreeProps): React.JSX.Element {

  const {
    website, setWebsite,
    auditorsName, setAuditorsName,
    auditorsFunction, setAuditorsFunction,
    approversName, setApproversName,
    approversFunction, setApproversFunction,
  } = props;
  const { t } = useTranslation();
  const { currentSurvey } = useAppSelector((state: RootState) => state.appState);

  // Sync Methods
  function loadFromCurrentSurvey() {
    const surveyValue = JSON.parse(currentSurvey.value);
    const survey = surveyValue?.survey;
    if (survey) {
      setWebsite(survey[14]);
      setAuditorsName(survey[15]);
      setAuditorsFunction(survey[16]);
      setApproversName(survey[17]);
      setApproversFunction(survey[18]);
    }
  }

  // Async Methods
  async function loadInfos() {
    if (currentSurvey) {
      loadFromCurrentSurvey();
    } else {
      await loadFromCache();
    }
  }

  async function loadFromCache() {
    try {
      const cachedClientSurvey = await CacheService.getInstance().retrieveValue(CacheKeys.clientSurvey);
      if (cachedClientSurvey) {
        const generalSection = cachedClientSurvey?.survey?.generalSection;
        if (generalSection) {
          setWebsite(generalSection.website);
          setAuditorsName(generalSection.auditorsName);
          setAuditorsFunction(generalSection.auditorsFunction);
          setApproversName(generalSection.approversName);
          setApproversFunction(generalSection.approversFunction);
        }
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
        value={website}
        onValueChange={setWebsite}
        placeholder={t('smqSurvey.generalInfo.stepThree.website')}
        showTitle={true}
      />
      <GladisTextInput
        value={auditorsName}
        onValueChange={setAuditorsName}
        placeholder={t('smqSurvey.generalInfo.stepThree.auditorsName')}
        showTitle={true}
      />
      <GladisTextInput
        value={auditorsFunction}
        onValueChange={setAuditorsFunction}
        placeholder={t('smqSurvey.generalInfo.stepThree.auditorsFunction')}
        showTitle={true}
      />
      <GladisTextInput
        value={approversName}
        onValueChange={setApproversName}
        placeholder={t('smqSurvey.generalInfo.stepThree.approversName')}
        showTitle={true}
      />
      <GladisTextInput
        value={approversFunction}
        onValueChange={setApproversFunction}
        placeholder={t('smqSurvey.generalInfo.stepThree.approversFunction')}
        showTitle={true}
      />
    </ScrollView>
  );
}

export default SMQGeneralStepThree;
