import React from 'react'
import { Button, Modal, Frame } from '@shopify/polaris';
import { useTranslation } from "react-i18next";
const DiscardModal = ({ toggleModal, handleDiscard, activemodal }) => {
  let { t } = useTranslation();
  return (
      <div className='discard-modal'>
        <Modal
          open={activemodal}
          onClose={toggleModal}
          title= {t('discardModal.title')}
          primaryAction={{
            destructive: true,
            content: t('discardModal.content'),
            onAction: handleDiscard,
          }}
          secondaryActions={[
            {
              content: t('discardModal.btn'),
              onAction: toggleModal,
            },
          ]}
        >
          <Modal.Section>
           {t('discardModal.text')}
          </Modal.Section>
        </Modal>
      </div>
  )
}

export default DiscardModal