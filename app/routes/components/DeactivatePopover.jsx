
import {Button, Popover, ActionList, Card} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import { useTranslation } from "react-i18next";
const DeactivatePopover = ({type,  handleToggleStatus, buttonLoading }) => {
  const [popoverActive, setPopoverActive] = useState(false);
  let { t } = useTranslation();
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
      {`${t('defaultSettings.active')}`}
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
          {`${t('defaultSettings.deactivateBtn')}`} {`${type}`}
        </Button>
      </Card>
    </Popover>
  );
};


  export default DeactivatePopover;