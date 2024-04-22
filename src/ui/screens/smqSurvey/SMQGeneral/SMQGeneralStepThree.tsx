import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
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
