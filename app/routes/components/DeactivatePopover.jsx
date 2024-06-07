
import {Button, Popover, ActionList, Card} from '@shopify/polaris';
import {useState, useCallback} from 'react';

const DeactivatePopover = ({ handleToggleStatus, buttonLoading }) => {
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const handleDeactivateClick = useCallback(async () => {
    await handleToggleStatus();
    setPopoverActive(false);
  }, [handleToggleStatus]);

  const activator = (
    <Button onClick={togglePopoverActive} disclosure>
      Active
    </Button>
  );

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      autofocusTarget="first-node"
      onClose={togglePopoverActive}
    >
      <Card>
        <Button onClick={handleDeactivateClick} tone="critical" loading={buttonLoading}>
          Deactivate Scroll To Top Button
        </Button>
      </Card>
    </Popover>
  );
};


  export default DeactivatePopover;