import { BlockStack, Button, ButtonGroup, Card, Text, Page, Tabs, List, Box, InlineGrid, ContextualSaveBar,Layout, Checkbox, TextField, Toast, Grid, Frame, InlineStack, Link, Popover, ActionList, Icon } from '@shopify/polaris';
import { useState, useCallback , useEffect} from "react";

import {
    ExternalIcon, XIcon
} from '@shopify/polaris-icons';
import { authenticate } from "../shopify.server";
import { useNavigate, useLoaderData } from "@remix-run/react";
import DeactivatePopover from "./components/DeactivatePopover";
import "./assets/style.css"
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
        app_name: "InstantSearch",
        app_status: false,
        show_popular_search: 1,
        product_bg_color: "#000000",
        include_out_stock: 0,
        show_reviews_snippet: 0,
        see_more_results: "See more results",
        popular_searches: "Popular searches",
        here_results: "Here are your results",
        no_results: "No results found.",
        looking_for: "What are you looking for?",
        collections_translation: "Collections"
    };

    const appName =
        metafielData.length > 0
            ? metafielData.filter((item) => item.node.namespace === "InstantSearch")
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
    return { data };
};

function Instantsearchapp(props) {
    const navigate = useNavigate();
    const { data } = useLoaderData();
    const [formData, setFormData] = useState(data);
    const [status, setStatus] = useState(data.app_status);
    const [active, setActive] = useState(false);
    const [error, setError] = useState('');
    const [msgData, setMsgData] = useState("");
    const [buttonloading, setButtonLoading] = useState(false);
    const [activeField, setActiveField] = useState(null);

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

    const handleSave = async () => {
        setButtonLoading(true);
        const dataToSend = {
            actionType: "save",
            data: formData
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
            setButtonLoading(false)
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

    const handleChange = (value, property) => {
        setFormData((formData) => ({
            ...formData,
            [property]: value,
        }));
    };
    const handleColorChange = useCallback((e, fieldName) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: e.target.value,
        }));
    }, []);

    const handleFocus = (fieldName) => {
        setActiveField(fieldName);
    };

    const [selected, setSelected] = useState(0);
    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );
    const [lastSavedData, setLastSavedData] = useState(data);
    const [activemodal, setActivemodal] = useState(false);
    const toggleModal = useCallback(() => setActivemodal((activemodal) => !activemodal), []);
    const SettingsDataTab = (
        <div style={{ padding: "10px" }} className='instant_search_SettingsDataTab_container'>
            <BlockStack gap="400">
                <InlineGrid columns={['oneThird', 'twoThirds']}>
                    <Text variant="headingMd" as="h6">
                        Settings
                    </Text>
                    <Layout>
                        <Layout.Section>
                            <Card roundedAbove="sm">
                                <BlockStack gap="300">

                                    <Box paddingBlockStart="200">
                                        <div className='checkbox_section'>
                                            <BlockStack gap="400">
                                                <Checkbox
                                                    label="Show popular searches"
                                                    checked={formData.show_popular_search}
                                                    onFocus={() => handleFocus("show_popular_search")}
                                                    onChange={(e) =>
                                                        handleChange(e, "show_popular_search")
                                                    }
                                                />

                                                <div className='color_section'>
                                                    <TextField
                                                        label="Product Background Color"
                                                        type="text"
                                                        onFocus={() => handleFocus("product_bg_color")}
                                                        value={formData.product_bg_color}
                                                        onChange={(e) =>
                                                            handleChange(e, "product_bg_color")
                                                        }
                                                        autoComplete="off"
                                                        connectedLeft={
                                                            <input
                                                                type="color"
                                                                onFocus={() => handleFocus("product_bg_color")}
                                                                value={formData.product_bg_color}
                                                                onChange={(e) =>
                                                                    handleColorChange(e, "product_bg_color")
                                                                }
                                                            />
                                                        }
                                                    />
                                                </div>

                                                {/* <Checkbox
                                                    label="Include Out of Stock Products"
                                                    onFocus={() => handleFocus("include_out_stock")}
                                                    checked={formData.include_out_stock}
                                                    onChange={(e) =>
                                                        handleChange(e, "include_out_stock")
                                                    }
                                                />

                                                <Checkbox
                                                    label="Show reviews snippet"
                                                    onFocus={() => handleFocus("show_reviews_snippet")}
                                                    checked={formData.show_reviews_snippet}
                                                    onChange={(e) =>
                                                        handleChange(e, "show_reviews_snippet")
                                                    }
                                                /> */}
                                            </BlockStack>
                                        </div>
                                    </Box>
                                </BlockStack>
                            </Card>
                        </Layout.Section>
                    </Layout>
                </InlineGrid>

                <InlineGrid columns={['oneThird', 'twoThirds']}>
                    <Text variant="headingMd" as="h6">

                    </Text>
                    <Layout>
                        <Layout.Section>
                            <Card roundedAbove="sm">
                                <BlockStack gap="300">
                                    <Box>
                                        <BlockStack gap="100">
                                            <Text variant="headingMd" as="h6">
                                                Translations
                                            </Text>
                                           
                                        </BlockStack>
                                    </Box>

                                    <Box paddingBlockStart="200">
                                        <div className='checkbox_section'>
                                            <BlockStack gap="300">
                                                <TextField
                                                    label="See more results"
                                                    onFocus={() => handleFocus("see_more_results")}
                                                    value={formData.see_more_results}
                                                    onChange={(e) =>
                                                        handleChange(e, "see_more_results")
                                                    }
                                                    placeholder="See more results"
                                                    autoComplete="off"
                                                />
                                                <TextField
                                                    label="Popular searches"
                                                    placeholder="Popular searches"
                                                    onFocus={() => handleFocus("popular_searches")}
                                                    value={formData.popular_searches}
                                                    onChange={(e) =>
                                                        handleChange(e, "popular_searches")
                                                    }
                                                    autoComplete="off"
                                                />
                                                <TextField
                                                    label="Here are your results"
                                                    placeholder="Here are your results"
                                                    onFocus={() => handleFocus("here_results")}
                                                    value={formData.here_results}
                                                    onChange={(e) =>
                                                        handleChange(e, "here_results")
                                                    }
                                                    autoComplete="off"
                                                />
                                                <TextField
                                                    label="No results found."
                                                    placeholder="No results found."
                                                    onFocus={() => handleFocus("no_results")}
                                                    value={formData.no_results}
                                                    onChange={(e) =>
                                                        handleChange(e, "no_results")
                                                    }
                                                    autoComplete="off"
                                                />
                                                <TextField
                                                    label="What are you looking for?"
                                                    placeholder="What are you looking for?"
                                                    onFocus={() => handleFocus("looking_for")}
                                                    value={formData.looking_for}
                                                    onChange={(e) =>
                                                        handleChange(e, "looking_for")
                                                    }
                                                    autoComplete="off"
                                                />
                                                <TextField
                                                    label="Collections"
                                                    placeholder="Collections"
                                                    onFocus={() => handleFocus("collections_translation")}
                                                    value={formData.collections_translation}
                                                    onChange={(e) =>
                                                        handleChange(e, "collections_translation")
                                                    }
                                                    autoComplete="off"
                                                />
                                            </BlockStack>
                                        </div>
                                    </Box>
                                </BlockStack>

                            </Card>
                        </Layout.Section>
                    </Layout>
                </InlineGrid>

                <div className='lower_section'>
                    <Grid>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                            <Card roundedAbove="sm">
                                <BlockStack gap="200">
                                    <Text as="h2" variant="headingSm">
                                        Localization
                                    </Text>
                                    <BlockStack gap="200">
                                        <Text as="p" fontWeight="reguler">
                                            Translate all the strings from the Instant Search app to all the languages enabled on your store.
                                        </Text>

                                    </BlockStack>
                                    <InlineStack align="end">
                                        <ButtonGroup>
                                            <Button onClick={() => { }} accessibilityLabel="Fulfill items">
                                                <Text variant="headingSm" as="h6">Translate</Text>
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
                                        Check our Help Center
                                    </Text>
                                    <BlockStack gap="200">
                                        <Text as="p" fontWeight="reguler">
                                            If you need help with setting up the Instant Search app, please check our exhaustive Help Center for details.
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
    );
    useEffect(()=>{
        shopify.loading(false);
        },[])

    // const AnalyticsPaymentsTab = () => {
    //     return (
    //         <div style={{ padding: "10px" }} className='AnalyticsPaymentsTab_container'>
    //             <BlockStack gap='600'>
    //                 <div><DateRangePicker /></div>
    //                 <Box>
    //                     <GraphCard />
    //                 </Box>
    //             </BlockStack>
    //         </div>
    //     )
    // }

    const tabs = [
        {
            id: 'Settings-customers-1',
            content: 'Settings',
            accessibilityLabel: 'Settings customers',
            panelID: 'Settings-customers-content-1',
            component: <>{SettingsDataTab}</>,
            dummy: ''
        }
       

    ];

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
    const appName = "Instant Search"
    const handleClick = () => {
        navigate("/app");
        shopify.loading(true);
      };
    return (
        <div className='Hide_Dynamic_Checkout_Buttons'>
            <Page
                backAction={{ content: "Back", onAction: handleClick }}
                title="Instant Search"
                subtitle="Help visitors instantly find the products they're looking for by using predictive search and displaying frequent searches."
                primaryAction={
                    status ? (
                        <DeactivatePopover type={appName} handleToggleStatus={handleToggleStatus} buttonLoading={buttonloading} />
                    ) : (
                        {
                            content: "Activate App",
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
                            <div className='intant_search_tab_container'>
                                <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                                    <Box >{tabs[selected].dummy}</Box>
                                    <div>
                                        {tabs[selected].component}
                                    </div>
                                </Tabs>
                            </div>
                        </BlockStack>
                    </div>
                </div>
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
                                onAction: handleSave,
                                loading: buttonloading,
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

export default Instantsearchapp;
