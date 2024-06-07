

import {SaveBar} from '@shopify/app-bridge-react';

function SaveBarHeader({ onSave, onDiscard, shopify }){


    return(
        <>
       
      <SaveBar id="my-save-bar">
      <button variant="primary" onClick={ onSave}>Save</button>
        <button onClick={onDiscard}></button>
      </SaveBar>
      </>
    )
}

export default SaveBarHeader;