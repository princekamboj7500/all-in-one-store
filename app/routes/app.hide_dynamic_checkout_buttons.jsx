import { BlockStack, Button, ButtonGroup, Card, Text, Page, List, Toast,Grid,   Frame,InlineStack, Link, Popover, ActionList, Icon } from '@shopify/polaris';
import { useState, useCallback , useEffect} from "react";
import {
    ExternalIcon, XIcon
} from '@shopify/polaris-icons';
import { authenticate } from "../shopify.server";
import { useNavigate, useLoaderData } from "@remix-run/react";
import DeactivatePopover from "./components/DeactivatePopover";
import { useTranslation } from "react-i18next";
export const loader = async ({ request }) => {
    const { session,admin } = await authenticate.admin(request);
      const response = await admin.graphql(`query {
          currentAppInstallation {
            id
            metafields(first: 3) {
              edges {
                node {
                  namespace
                  key
                  value
                }
              }
            }
          }
  
        }`)
        const result = await response.json();
      
        const appId = result.data.currentAppInstallation.id;
        const metafielData = result.data.currentAppInstallation.metafields.edges;
        const defaultSettings = {
          app_name: "HideDynamicCheckout",
          app_status: false
        };
       
     const appName =
      metafielData.length > 0
        ? metafielData.filter((item) => item.node.namespace === "HideDynamicCheckout")
        : [];
  
    let appSettings =
      appName.length > 0 ? appName[0].node.value : defaultSettings;
       
        let data;
        if (typeof appSettings === 'string') {
            try {
                data = JSON.parse(appSettings);
            } catch (error) {
                console.error('Error parsing appSettings:', error);
                data = {}; 
            }
        } else {
            data = appSettings;
        }
       return {data};
};

function Hide_Dynamic_Checkout_Buttons(props) {
    let { t } = useTranslation();
    const navigate= useNavigate();
    const { data } = useLoaderData();
    const [formData, setFormData] = useState(data);
    const [status, setStatus] = useState(data.app_status); 
    const [active, setActive] = useState(false);
    const[error, setError] =useState('');
    const [msgData, setMsgData] = useState("");
    const[buttonloading,setButtonLoading] = useState(false);

    const handleToggleStatus = async () => {
        setButtonLoading(true);
        const updatedFormData = {
          ...formData,
          app_status: !formData.app_status,
        };
        const actionType = formData.app_status ? "Deactivate" : "Activate";
        const dataToSend = {
          actionType: actionType,
          data: updatedFormData,
        };
    
        try {
          const response = await fetch("/api/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
          });
          const data = await response.json();
    
          if (data.success) {
            setButtonLoading(false);
            setFormData(updatedFormData);
            setStatus(updatedFormData.app_status);
            setMsgData(`${actionType}d App  successfully`);
          } else {
            setError(true);
            setButtonLoading(false);
            setMsgData("There is some error");
            console.error("API request failed:", data.message);
          }
        } catch (error) {
          setError(true);
          setButtonLoading(false);
          setMsgData("There is some error");
          console.error("API request failed:", error);
        } finally {
          setButtonLoading(false);
          setActive(true);
        //   setActiveField(false);
        }
     };
     
    const toggleActive = useCallback(
        () => setActive((prevActive) => !prevActive),
        [],
    );

    const toastMarkup = active ? (
        <Frame>
          <Toast content={msgData} onDismiss={toggleActive} error={error} />
        </Frame>
    ) : null;

    const SettingsDataTab = () => {
        return (
            <div className='Cart_notice_page_SettingsDataTab_container'>
                <BlockStack gap="400">
                    <Card roundedAbove="sm">
                        <BlockStack gap="200">
                            <Text variant="headingSm" as="h6">
                            {`${t('HideButton.title')}`}
                            </Text>
                            <Text as="p" fontWeight="regular">
                            {`${t('HideButton.desc')}`}
                            </Text>
                            <div style={{ padding: "5px" }} className='checkbox_section'>
                                <List type="number">
                                    <List.Item>
                                    {`${t('HideButton.first')}`} 
                                    </List.Item>
                                    <List.Item>
                                    {`${t('HideButton.second')}`} 
                                    </List.Item>
                                    <List.Item>
                                    {`${t('HideButton.third')}`}   
                                    </List.Item>
                                    <List.Item>
                                    {`${t('HideButton.fourth')}`}  
                                    </List.Item>
                                    <List.Item>
                                    {`${t('HideButton.fifth')}`} 
                                    </List.Item>
                                </List>
                            </div>
                            <div>
                                <Text as="p" fontWeight="regular">
                                {`${t('HideButton.notice')}`} 
                                    <span> <b>
                                     {`${t('HideButton.boldText')}`} </b>
                                    </span>
                                </Text>
                            </div>
                        </BlockStack>
                    </Card>

                </BlockStack>
            </div>
        )
    };

    function PopoverContentExample() {
        const [popoverActive, setPopoverActive] = useState(false);
        const [isActivated, setIsActivated] = useState(false);

        const togglePopoverActive = useCallback(
            () => setPopoverActive((popoverActive) => !popoverActive),
            [],
        );

        const handleActivateClick = useCallback(() => {
            setIsActivated(false);
            setPopoverActive(true);
        }, []);

        const handleActivateClickAgain = useCallback(() => {
            setIsActivated(true);
            setPopoverActive(false);
        }, []);

        const activator = (
            <>
                {isActivated ? (
                    <Button onClick={togglePopoverActive} disclosure>
                    {`${t('defaultSettings.active')}`} 
                    </Button>
                ) : (

                    <Button className="activate_button" tone="success" onClick={handleActivateClickAgain}>
                        {`${t('defaultSettings.Activate')}`}
                    </Button>
                )}
            </>
        );

        return (
            <div>
                {
                    isActivated ? <>
                        <Popover
                            active={popoverActive}
                            activator={activator}
                            autofocusTarget="first-node"
                            onClose={togglePopoverActive}
                        >
                            <Card>
                                <Button onClick={handleActivateClick} tone="critical">{`${t('defaultSettings.DeactivateSAC')}`}</Button>
                            </Card>
                        </Popover>
                    </> : <>

                        <Popover
                            active={popoverActive}
                            activator={activator}
                            autofocusTarget="first-node"
                            onClose={togglePopoverActive}
                        >
                            <Popover.Pane fixed>
                                <Popover.Section>
                                    <InlineStack><Text alignment='center' as="p" fontWeight="regular" variant="headingMd">{`${t('defaultSettings.wentwrong')}`} </Text>
                                        <div><Icon source={XIcon}></Icon></div></InlineStack>
                                </Popover.Section>
                            </Popover.Pane>
                            <Popover.Pane>
                                <ActionList
                                    actionRole="menuitem"
                                    items={[
                                        { content: `Submit a bug: the app doesn't work as expected` },
                                        { content: 'Some features are missing' },
                                        { content: `Design doesn't match my theme` },
                                        { content: `It conflicts with another app` },
                                        { content: `I don't need it anymore` },
                                        { content: `Other` },
                                    ]}
                                />
                            </Popover.Pane>
                        </Popover>
                    </>
                }
            </div>
        );
    }
    useEffect(()=>{
        shopify.loading(false)
       },[])
     
       const handleClick = () => {
         navigate("/app");
         shopify.loading(true);
       };

    return (
        <div className='Hide_Dynamic_Checkout_Buttons'>
            <Page
                backAction={{ content: "Back", onAction: handleClick }}
                title={`${t('HideButton.appTitle')}`}
                subtitle={`${t('HideButton.appdsec')}`}

                primaryAction={
                    status ? (
                      <DeactivatePopover handleToggleStatus={handleToggleStatus} buttonLoading={buttonloading} />
                    ) : (
                      {
                       content:t('defaultSettings.activateBtn'),
                        tone: "success",
                        onAction: handleToggleStatus,
                        loading: buttonloading,
                      }
                    )
                  }
                
               

            >
                <div className='intant_search'>
                    <div className='intant_search_TabsField'>
                        <BlockStack gap='200'>
                            <SettingsDataTab />
                        </BlockStack>
                    </div>
                </div>
                {toastMarkup}
            </Page>
        </div>
    );
}

export default Hide_Dynamic_Checkout_Buttons;