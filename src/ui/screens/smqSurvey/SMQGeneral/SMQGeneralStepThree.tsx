import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import SMQManager from '../../../../business-logic/manager/SMQManager';

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
  editable: boolean;
};

function SMQGeneralStepThree(props: SMQGeneralStepThreeProps): React.JSX.Element {

  const {
    website, setWebsite,
    auditorsName, setAuditorsName,
    auditorsFunction, setAuditorsFunction,
    approversName, setApproversName,
    approversFunction, setApproversFunction,
    editable,
  } = props;
  const { t } = useTranslation();

  // Async Methods
  async function loadInfos() {
    const currentSurvey = await SMQManager.getInstance().getSurvey();
    if (currentSurvey && currentSurvey.value) {
      const surveyData = JSON.parse(currentSurvey.value);
      if (surveyData) {
        setWebsite(surveyData['14']);
        setAuditorsName(surveyData['15']);
        setAuditorsFunction(surveyData['16']);
        setApproversName(surveyData['17']);
        setApproversFunction(surveyData['18']);
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
      <GladisTextInput
        value={website}
        onValueChange={setWebsite}
        placeholder={t('smqSurvey.generalInfo.stepThree.website')}
        showTitle={true}
        editable={editable}
      />
      <GladisTextInput
        value={auditorsName}
        onValueChange={setAuditorsName}
        placeholder={t('smqSurvey.generalInfo.stepThree.auditorsName')}
        showTitle={true}
        editable={editable}
      />
      <GladisTextInput
        value={auditorsFunction}
        onValueChange={setAuditorsFunction}
        placeholder={t('smqSurvey.generalInfo.stepThree.auditorsFunction')}
        showTitle={true}
        editable={editable}
      />
      <GladisTextInput
        value={approversName}
        onValueChange={setApproversName}
        placeholder={t('smqSurvey.generalInfo.stepThree.approversName')}
        showTitle={true}
        editable={editable}
      />
      <GladisTextInput
        value={approversFunction}
        onValueChange={setApproversFunction}
        placeholder={t('smqSurvey.generalInfo.stepThree.approversFunction')}
        showTitle={true}
        editable={editable}
      />
    </>
  );
}

export default SMQGeneralStepThree;
