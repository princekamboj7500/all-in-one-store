import {SaveBar} from '@shopify/app-bridge-react';
import { useTranslation } from "react-i18next";
function SaveBarHeader({ onSave, onDiscard, shopify }){
  let { t } = useTranslation();

    return(
        <>
       
      <SaveBar id="my-save-bar">
      <button variant="primary" onClick={ onSave}>{t("BarHeader.Save")}</button>
        <button onClick={onDiscard}></button>
      </SaveBar>
      </>
    )
}

export default SaveBarHeader;