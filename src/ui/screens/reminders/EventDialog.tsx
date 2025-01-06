import React from 'react';
import { useTranslation } from 'react-i18next';

import { IEvent } from '../../../business-logic/model/IEvent';
import EventServiceDelete from '../../../business-logic/services/EventService/EventService.delete';
import EventServicePut from '../../../business-logic/services/EventService/EventService.put';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import DateUtils from '../../../business-logic/utils/DateUtils';

import Dialog from '../../components/Dialogs/Dialog';

type EventDialogProps = {
  selectedEvent: IEvent;
  setShowEventDialog: React.Dispatch<React.SetStateAction<boolean>>;
  displayToast: (message: string, isError: boolean) => void;
  loadAllEvents: () => Promise<void>;
};

function EventDialog(props: EventDialogProps): React.JSX.Element {
  const { selectedEvent, setShowEventDialog, displayToast, loadAllEvents } =
    props;

  // Hooks
  const { t, i18n } = useTranslation();
  const { token } = useAppSelector((state: RootState) => state.tokens);

  // Constants
  const language: 'en' | 'fr' = i18n.language === 'fr' ? 'fr' : 'en';
  const formattedDate = DateUtils.formatDate(
    new Date(selectedEvent.date),
    'DD/MM/YYYY',
    language,
  );
  const isArchived = selectedEvent.deletedAt !== null;

  // Sync Methods
  function closeDialog() {
    setShowEventDialog(false);
  }

  // Async Methods
  async function tappedOnDone() {
    if (isArchived) {
      await deleteEvent();
    } else {
      await archiveEvent();
    }
  }

  async function archiveEvent() {
    if (selectedEvent as IEvent) {
      try {
        await EventServiceDelete.archive(selectedEvent.id, token);
        setShowEventDialog(false);
        await loadAllEvents();
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(errorMessage, true);
      }
    }
  }

  async function deleteEvent() {
    if (selectedEvent as IEvent) {
      try {
        await EventServiceDelete.remove(selectedEvent.id, token);
        setShowEventDialog(false);
        await loadAllEvents();
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(errorMessage, true);
      }
    }
  }

  async function restoreEvent() {
    if (selectedEvent as IEvent) {
      try {
        await EventServicePut.restore(selectedEvent.id, token);
        setShowEventDialog(false);
        await loadAllEvents();
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(errorMessage, true);
      }
    }
  }

  // Components
  return (
    <Dialog
      title={selectedEvent.name}
      description={`${t('calendar.dueDate')} : ${formattedDate}`}
      confirmTitle={t('calendar.dialog.confirmTitle')}
      isConfirmAvailable={true}
      onConfirm={tappedOnDone}
      cancelTitle={t('calendar.dialog.cancelTitle')}
      isCancelAvailable={true}
      onCancel={closeDialog}
      extraConfirmButtonAction={restoreEvent}
      extraConfirmButtonTitle={
        isArchived ? t('calendar.dialog.restore') : undefined
      }
    />
  );
}

export default EventDialog;
