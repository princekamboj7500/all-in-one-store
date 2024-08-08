import { BlockStack, Button, ButtonGroup, Card, Text, Page, List, Toast,Grid,   Frame,InlineStack, Link, Popover, ActionList, Icon } from '@shopify/polaris';
import { useState, useCallback , useEffect} from "react";
import {
    ExternalIcon, XIcon
} from '@shopify/polaris-icons';
import { authenticate } from "../shopify.server";
import { useNavigate, useLoaderData } from "@remix-run/react";
import DeactivatePopover from "./components/DeactivatePopover";

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
                                Resources
                            </Text>
                            <Text as="p" fontWeight="regular">
                                There are at least 5 reasons to hide the Dynamic Checkout buttons:
                            </Text>
                            <div style={{ padding: "5px" }} className='checkbox_section'>
                                <List type="number">
                                    <List.Item>
                                        The button takes the customers to the payment gateway (PayPal, Apple Pay, Google Pay, Amazon Pay) to authorize an amount that does not include shipping. Eventually the customer will return to Shopify for shipping options but this creates an unnecessary friction.
                                    </List.Item>
                                    <List.Item>
                                        The same for coupon codes: if your customers have a coupon code, they will not be able to enter it in the payment gateway, only when they return to continue the normal checkout flow. This might hurt the conversion rate as well.
                                    </List.Item>
                                    <List.Item>
                                        Discount apps (such as the Product Bundle and Volume Discount apps in Vitals and other discount apps) will not work on a checkout flow that started from Dynamic Checkout buttons.
                                    </List.Item>
                                    <List.Item>
                                        If PayPal / Apple Pay / Google Pay / Amazon Pay is not your only payment method, do not let your customers think so. This, as well, might hurt your conversion rate.
                                    </List.Item>
                                    <List.Item>
                                        Last but not least, the buttons might not fit the design of your theme.
                                    </List.Item>
                                </List>
                            </div>
                            <div>
                                <Text as="p" fontWeight="regular">
                                    Hiding the third party payment buttons creates a smooth checkout workflow. Rest assured:<span><b>
                                        customers will still be able to pay using the same payment methods on the checkout page.</b>
                                    </span>
                                </Text>
                            </div>
                        </BlockStack>
                    </Card>

                    <div className='lower_section'>
                        <Grid>

                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                                <Card roundedAbove="sm">
                                    <BlockStack gap="200">
                                        <Text as="h2" variant="headingSm">
                                            Check our Help Center
                                        </Text>
                                        <BlockStack gap="200">
                                            <Text as="p" fontWeight="reguler">
                                                If you need help with setting up the Hide Dynamic Checkout Buttons app, please check our exhaustive Help Center for details.
                                            </Text>

                                        </BlockStack>
                                        <InlineStack align="end">
                                            <ButtonGroup>
                                                <Button icon={ExternalIcon} onClick={() => { }} accessibilityLabel="Fulfill items">
                                                    <Text variant="headingSm" as="h6">Get help</Text>
                                                </Button>

                                            </ButtonGroup>
                                        </InlineStack>
                                    </BlockStack>
                                </Card>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                                <Card roundedAbove="sm">
                                    <BlockStack gap="200">
                                        <Text as="h2" variant="headingSm">
                                            We're here for you, 24/7
                                        </Text>
                                        <BlockStack gap="200">
                                            <Text as="p" fontWeight="reguler">
                                                We know how complex Vitals is - that's why <Link href='#'>we are available 24/7</Link> to support you in setting it up.
                                            </Text>

                                        </BlockStack>
                                        <InlineStack align="end">
                                            <ButtonGroup>
                                                <Button onClick={() => { }} accessibilityLabel="Fulfill items">
                                                    <Text variant="headingSm" as="h6">Contact us</Text>
                                                </Button>

                                            </ButtonGroup>
                                        </InlineStack>
                                    </BlockStack>
                                </Card>
                            </Grid.Cell>
                        </Grid>
                    </div>

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
                        Active
                    </Button>
                ) : (

                    <Button className="activate_button" tone="success" onClick={handleActivateClickAgain}>
                        Activate
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
                                <Button onClick={handleActivateClick} tone="critical">Deactivate Sticky Add to Cart</Button>
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
                                    <InlineStack><Text alignment='center' as="p" fontWeight="regular" variant="headingMd">What went wrong? </Text>
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
                title="Hide Dynamic Checkout Buttons"
                subtitle="Create a smooth checkout flow by hiding the dynamic checkout buttons (PayPal, Apple Pay) from your cart and product pages."

                primaryAction={
                    status ? (
                      <DeactivatePopover handleToggleStatus={handleToggleStatus} buttonLoading={buttonloading} />
                    ) : (
                      {
                        content: "Activate App",
                        tone: "success",
                        onAction: handleToggleStatus,
                        loading: buttonloading,
                      }
                    )
                  }
                secondaryActions={[
                    {
                        content: 'Tutorial',
                    },
                ]}

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