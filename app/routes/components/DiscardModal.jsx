import React from 'react'
import { Button, Modal, Frame } from '@shopify/polaris';

const DiscardModal = ({ toggleModal, handleDiscard, activemodal }) => {
  return (
      <div className='discard-modal'>
        <Modal
          open={activemodal}
          onClose={toggleModal}
          title="Discard all unsaved changes"
          primaryAction={{
            destructive: true,
            content: 'Discard changes',
            onAction: handleDiscard,
          }}
          secondaryActions={[
            {
              content: 'Continue editing',
              onAction: toggleModal,
            },
          ]}
        >
          <Modal.Section>
            If you discard changes, you’ll delete any edits you made since you
            last saved.
          </Modal.Section>
        </Modal>
      </div>
  )
}

export default DiscardModal