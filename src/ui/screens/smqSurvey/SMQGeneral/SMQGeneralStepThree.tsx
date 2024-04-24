import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import CacheKeys from '../../../../business-logic/model/enums/CacheKeys';
import CacheService from '../../../../business-logic/services/CacheService';

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

  async function loadInfos() {
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

  useEffect(() => {
    async function init() {
      await loadInfos();
    }
    init();
  }, []);

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
