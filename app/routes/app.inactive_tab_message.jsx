import { ButtonGroup,BlockStack, Button, Card, Text, Page, List, Toast,TextField , Grid, ContextualSaveBar ,FormLayout ,Layout, Frame, InlineStack, Popover, ActionList, Icon } from '@shopify/polaris';
import { useState, useCallback, useEffect } from "react";
import { Link } from '@shopify/polaris';
import { authenticate } from "../shopify.server";
import { useTranslation } from "react-i18next";
import { useNavigate, useLoaderData } from "@remix-run/react";
import DeactivatePopover from "./components/DeactivatePopover";
import "./assets/style.css"
import {
    ChevronDownIcon, EditIcon, MinusIcon, SearchIcon, ExternalIcon, CalendarIcon, AlertCircleIcon, ArrowRightIcon
} from '@shopify/polaris-icons';
import DiscardModal from './components/DiscardModal';
export const loader = async ({ request }) => {
    const { session, admin } = await authenticate.admin(request);
    const response = await admin.graphql(`query {
          currentAppInstallation {
            id
            metafields(first: 10) {
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
        app_name: "InactiveTabMessage",
        app_status: false,
        inactivemessage:"☞ Don't forget this..."
    };
    

    const appName =
        metafielData.length > 0
            ? metafielData.filter((item) => item.node.namespace === "InactiveTabMessage")
            : [];

    let appSettings = appName.length > 0 ? appName[0].node.value : defaultSettings;
   

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
   
    return { data };
};

function InactiveTabMessage() {
    const navigate = useNavigate();
    let { t } = useTranslation();
    const { data } = useLoaderData();
    const [formData, setFormData] = useState(data);
    const [status, setStatus] = useState(data.app_status);
    const [active, setActive] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [error, setError] = useState('');
    const [msgData, setMsgData] = useState("");
    const [buttonloading, setButtonLoading] = useState(false);
    const [lastSavedData, setLastSavedData] = useState(data);
    const [activemodal, setActivemodal] = useState(false);
    const toggleModal = useCallback(() => setActivemodal((activemodal) => !activemodal), []);
    const handleChange = (value, property) => {
        setFormData((formData) => ({
            ...formData,
            [property]: value,
        }));
    };

    const handleFocus = (fieldName) => {
        setActiveField(fieldName);
    };
    useEffect(()=>{
        shopify.loading(false);
        },[])
    const handleSave = async () => {
        setButtonLoading(true);
        const dataToSend = {
          actionType: "save",
          data:formData
          };

        const response = await fetch("/api/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });
        const data = await response.json();

        if (data.success) {
          setActive(true);
          setActiveField(false);
          setButtonLoading(false);
          setMsgData("Settings Updated");
        } else {
          setButtonLoading(false)
          setActive(true);
          setActiveField(false);
          setError(true);
          setMsgData("There is some error while update");
     
        }
      };
      
      const handleDiscard = () => {
        setFormData(lastSavedData)
        setActiveField(false);
        toggleModal();
    };



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
    const appName = "Inactive Tab Message"
    const handleClick = () => {
        navigate("/app");
        shopify.loading(true);
      };
    return (
        <div className='Inactivetab-message'>
            <Page
                backAction={{ content: "Back", onAction: handleClick }}
                title={`${t('InactiveTab.appTitle')}`}
                subtitle={`${t('InactiveTab.appdsec')}`}
                primaryAction={
                    status ? (
                        <DeactivatePopover type={appName} handleToggleStatus={handleToggleStatus} buttonLoading={buttonloading} />
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
                <Layout>
                    <Layout.AnnotatedSection
                        id="Settings"
                        title={t('defaultSettings.settings')}
                    > 
                        <Card sectioned>
                                <TextField
                                    label={t('InactiveTab.Message')}
                                    autoComplete="off"
                                    value={formData.inactivemessage}
                                    onFocus={(e)=> handleFocus("field")}
                                    onChange={(e) =>{
                                            handleChange(e, "inactivemessage")
                                           
                                        }   
                                    }
                                />
                                <Text tone='subdue' as='p'>
                                {`${t('InactiveTab.helpText')}`}
                                    <br/><br/>
                                    {`${t('InactiveTab.desc')}`}  <a target="_blank" href="https://getemoji.com/" >
                                    {`${t('InactiveTab.linkText')}`}
                                    </a>.
                                </Text>
                        </Card>
                    </Layout.AnnotatedSection>
                </Layout>
                {/* <div className='lower_section' style={{marginTop:"20px"}}>
            <Grid>
            
             
             
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Card roundedAbove="sm">
                        <BlockStack gap="200">
                            <Text as="h2" variant="headingSm">
                                Check our Help Center
                            </Text>
                            <BlockStack gap="200">
                                <Text as="h3" variant="headingSm" tone='subdue' fontWeight='regular'>
                                    If you need help with setting up the Scroll to Top Button app, please check our exhaustive Help Center for details.
                                </Text>

                            </BlockStack>
                            <InlineStack align="end">
                                <ButtonGroup>
                                    <Button icon={ExternalIcon} onClick={() => { }} accessibilityLabel="Fulfill items">
                                        <Text variant="headingXs" as="h6" fontWeight='regular'>Get help</Text>
                                    </Button>
                                </ButtonGroup>
                            </InlineStack>
                        </BlockStack>
                    </Card>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Card roundedAbove="sm">
                        <BlockStack gap="200">
                            <Text as="h2" variant="headingSm">
                                We're here for you, 24/7
                            </Text>
                            <BlockStack gap="200">
                                <Text as="h3" variant="headingSm"  tone='subdue' fontWeight='regular'>
                                    We know how complex Vitals is - that's why <Link href='#'>we are available 24/7</Link> to support you in setting it up.
                                </Text>

                            </BlockStack>
                            <InlineStack align="end">
                                <ButtonGroup>
                                    <Button onClick={() => { }} accessibilityLabel="Fulfill items">
                                        <Text variant="headingXs" as="h6" fontWeight='regular'>Contact us</Text>
                                    </Button>

                                </ButtonGroup>
                            </InlineStack>
                        </BlockStack>
                    </Card>
                </Grid.Cell>
            </Grid>
        </div> */}
        {activeField && (
                    <Frame
                        logo={{
                            width: 86,
                            contextualSaveBarSource:
                                "https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png",
                        }}
                    >
                        <ContextualSaveBar
                            message="Unsaved changes"
                            saveAction={{
                                loading: buttonloading,
                                onAction: handleSave,
                                disabled: false,
                            }}
                            discardAction={{
                                onAction: handleDiscard,
                            }}
                        />
                        </Frame>
                    )}
                {toastMarkup}
                <DiscardModal toggleModal={toggleModal} handleDiscard={handleDiscard} activemodal={activemodal} />
            </Page>

        </div>
    );
}

export default InactiveTabMessage;