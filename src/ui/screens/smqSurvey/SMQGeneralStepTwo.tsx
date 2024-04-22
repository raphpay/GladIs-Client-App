import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import ExpandingTextInput from '../../components/TextInputs/ExpandingTextInput';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';

type SMQGeneralStepTwoProps = {
  activity: string;
  setActivity: React.Dispatch<React.SetStateAction<string>>;
  qualityGoals: string;
  setQualityGoals: React.Dispatch<React.SetStateAction<string>>;
  hasOrganizationalChart: boolean;
  setHasOrganizationalChart: React.Dispatch<React.SetStateAction<boolean>>;
  headquartersAddress: string;
  setHeadquartersAddress: React.Dispatch<React.SetStateAction<string>>;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  website: string;
  setWebsite: React.Dispatch<React.SetStateAction<string>>;
};

function SMQGeneralStepTwo(props: SMQGeneralStepTwoProps): React.JSX.Element {

  const {
    activity, setActivity,
    qualityGoals, setQualityGoals,
    hasOrganizationalChart, setHasOrganizationalChart,
    headquartersAddress, setHeadquartersAddress,
    phoneNumber, setPhoneNumber,
    email, setEmail,
    website, setWebsite,
  } = props;
  const { t } = useTranslation();

  // Sync Methods
  function loadInfos() {
    // if (currentClient) {
    //   setCompanyName(currentClient.companyName);
    // }
  }

  // Lifecycle Methods
  useEffect(() => {
    loadInfos();
  }, []);

  // TODO: Implement check boxes for hasOrganizationalChart
  // Components
  return (
    <ScrollView>
      <GladisTextInput
        value={activity}
        onValueChange={setActivity}
        placeholder={t('smqSurvey.generalInfo.stepTwo.qualityGoals')}
        showTitle={true}
      />
      <ExpandingTextInput
        text={qualityGoals}
        setText={setQualityGoals}
        placeholder={t('smqSurvey.generalInfo.stepTwo.qualityGoals')}
      />
      {/* <GladisTextInput
        value={hasOrganizationalChart}
        onValueChange={setHasOrganizationalChart}
        placeholder={t('smqSurvey.generalInfo.stepTwo.hasOrganizationalChart')}
        showTitle={true}
      /> */}
      <GladisTextInput
        value={headquartersAddress}
        onValueChange={setHeadquartersAddress}
        placeholder={t('smqSurvey.generalInfo.stepTwo.headquartersAddress')}
        showTitle={true}
      />
      <GladisTextInput
        value={phoneNumber}
        onValueChange={setPhoneNumber}
        placeholder={t('smqSurvey.generalInfo.stepTwo.phoneNumber')}
        showTitle={true}
      />
      <GladisTextInput
        value={email}
        onValueChange={setEmail}
        placeholder={t('smqSurvey.generalInfo.stepTwo.email')}
        showTitle={true}
      />
      <GladisTextInput
        value={website}
        onValueChange={setWebsite}
        placeholder={t('smqSurvey.generalInfo.stepTwo.website')}
        showTitle={true}
      />
    </ScrollView>
  );
}

export default SMQGeneralStepTwo;
