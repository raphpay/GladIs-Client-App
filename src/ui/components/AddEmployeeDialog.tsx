import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import IPotentialEmployee from '../../business-logic/model/IPotentialEmployee';
import Utils from '../../business-logic/utils/Utils';

import Dialog from './Dialogs/Dialog';
import GladisTextInput from './GladisTextInput';


type AddEmployeeDialogProps = {
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  potentialEmployees: IPotentialEmployee[];
  setPotentialEmployees: React.Dispatch<React.SetStateAction<IPotentialEmployee[]>>;
  companyName: string;
};

function AddEmployeeDialog(props: AddEmployeeDialogProps): React.JSX.Element {
  const {
    showDialog,
    setShowDialog,
    potentialEmployees,
    setPotentialEmployees,
    companyName,
  } = props;
  const { t } = useTranslation();

  const [dialogDescription, setDialogDescription] = useState<string>('');
  const [potentialEmployeeFirstName, setPotentialEmployeeFirstName] = useState<string>('');
  const [potentialEmployeeLastName, setPotentialEmployeeLastName] = useState<string>('');
  const [potentialEmployeeEmail, setPotentialEmployeeEmail] = useState<string>('');
  const [potentialEmployeePhoneNumber, setPotentialEmployeePhoneNumber] = useState<string>('');

  // Sync Methods
  function isContactDetailsValid(): boolean {
    let isValid: boolean = true;
    const isPhoneValid = Utils.isPhoneValid(potentialEmployeePhoneNumber);
    const isEmailValid = Utils.isEmailValid(potentialEmployeeEmail);
    if (!isPhoneValid && !isEmailValid) {
      setDialogDescription(t('components.dialog.addEmployee.errors.invalidPhoneAndEmail'));
      isValid = false;
    } else if (!isPhoneValid) {
      setDialogDescription(t('components.dialog.addEmployee.errors.invalidPhone'));
      isValid = false;
    } else if (!isEmailValid) {
      setDialogDescription(t('components.dialog.addEmployee.errors.invalidEmail'));
      isValid = false;
    }
    return isValid;
  }

  function isFormFilled(): boolean {
    let isFilled: boolean = false;
    if (potentialEmployeeEmail.length !== 0 && potentialEmployeeLastName.length !== 0 &&
      potentialEmployeeEmail.length !== 0 && potentialEmployeePhoneNumber.length !== 0) {
        isFilled = true;
    }
    return isFilled;
  }

  // Async Methods
  async function addEmployee() {
    if (isFormFilled() && isContactDetailsValid()) {
      const newArray: IPotentialEmployee[] = potentialEmployees;
      const newEmployee: IPotentialEmployee = {
        firstName: potentialEmployeeFirstName,
        lastName: potentialEmployeeLastName,
        email: potentialEmployeeEmail,
        phoneNumber: potentialEmployeePhoneNumber,
        companyName: companyName
      };
      newArray.push(newEmployee);
      setPotentialEmployeeFirstName('');
      setPotentialEmployeeLastName('');
      setPotentialEmployeeEmail('');
      setPotentialEmployeePhoneNumber('');
      setPotentialEmployees(newArray);
      setShowDialog(false);
    }
  }

  return (
    <>
      {showDialog  && (
        <Dialog
          title={t('components.dialog.addEmployee.title')}
          description={dialogDescription}
          onConfirm={addEmployee}
          isCancelAvailable={true}
          onCancel={() => setShowDialog(false)}
        >
          <>
            <GladisTextInput
              value={potentialEmployeeFirstName}
              onValueChange={setPotentialEmployeeFirstName}
              placeholder={t('quotation.firstName')}
            />
            <GladisTextInput 
              value={potentialEmployeeLastName}
              onValueChange={setPotentialEmployeeLastName}
              placeholder={t('quotation.lastName')}
            />
            <GladisTextInput 
              value={potentialEmployeeEmail}
              onValueChange={setPotentialEmployeeEmail}
              placeholder={t('quotation.email')}
            />
            <GladisTextInput 
              value={potentialEmployeePhoneNumber}
              onValueChange={setPotentialEmployeePhoneNumber}
              placeholder={t('quotation.phone')}
            />
          </>
        </Dialog>
      )}
    </>
  );
}

export default AddEmployeeDialog;