import React from 'react';
import { useTranslation } from 'react-i18next';
import { IEvent } from '../../../business-logic/model/IEvent';
import Utils from '../../../business-logic/utils/Utils';
import Dialog from '../../components/Dialog';

type EventDialogProps = {
  selectedEvent: IEvent;
  showEventDialog: boolean;
  setShowEventDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

function EventDialog(props: EventDialogProps): React.JSX.Element {

  const { selectedEvent, showEventDialog, setShowEventDialog } = props;

  const { t } = useTranslation();

  function closeDialog() {
    setShowEventDialog(false);
  }

  const formattedDate = Utils.formatStringDate(new Date(selectedEvent.date));
  
  return (
    <>
      {
        showEventDialog && (
          <Dialog
            title={selectedEvent?.name}
            description={`${t('calendar.dueDate')} : ${formattedDate}`}
            isConfirmAvailable={true}
            onConfirm={() => { }}
            isCancelAvailable={true}
            onCancel={closeDialog}
          />
        )
      }
    </>
  );
}

export default EventDialog;