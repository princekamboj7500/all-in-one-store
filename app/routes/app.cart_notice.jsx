import { ActionList, Banner, BlockStack, Box, Button, ButtonGroup, Frame, ContextualSaveBar, Toast, Card, Checkbox, Collapsible, DatePicker, Form, FormLayout, Grid, Icon, InlineGrid, InlineStack, Layout, LegacyCard, LegacyStack, Link, OptionList, Page, Popover, Scrollable, Select, Tabs, Text, TextContainer, TextField, Tooltip, useBreakpoints } from '@shopify/polaris';
import React, { useCallback, useState,useEffect } from 'react';
import {
    ChevronDownIcon, XIcon, MinusIcon, SearchIcon, ExternalIcon, CalendarIcon, AlertCircleIcon, ArrowRightIcon
} from '@shopify/polaris-icons';
import { useTranslation } from "react-i18next";
import { authenticate } from "../shopify.server";
import { useNavigate, useLoaderData } from "@remix-run/react";
import DeactivatePopover from "./components/DeactivatePopover";
import "./assets/style.css"
import DiscardModal from './components/DiscardModal';
export const loader = async ({ request }) => {
    const { session, admin } = await authenticate.admin(request);
    let storeName = session.shop.split(".")[0];
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
        app_name: "CartNotice",
        app_status: false,
        notice_bg_color: "#000000",
        notice_text_color: "#ffffff",
        cart_notice_title: "An item in your cart is in high demand.",
        cart_notice_secondary: "Complete the order to make sure it’s yours!",
        hide_fire_icon: 0
    };

    const appName =
        metafielData.length > 0
            ? metafielData.filter((item) => item.node.namespace === "CartNotice")
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
   return { data, storeName };
};

function CartNotice(props) {
    let { t } = useTranslation();
    const navigate = useNavigate();
    const { data, storeName } = useLoaderData();
    const [formData, setFormData] = useState(data);
    const [status, setStatus] = useState(data.app_status);
    const [active, setActive] = useState(false);
    const [error, setError] = useState('');
    const [msgData, setMsgData] = useState("");
    const [buttonloading, setButtonLoading] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [isDismissed, setIsDismissed] = useState(false);
    const [lastSavedData, setLastSavedData] = useState(data);
    const [activemodal, setActivemodal] = useState(false);
    const toggleModal = useCallback(() => setActivemodal((activemodal) => !activemodal), []);
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
    useEffect(()=>{
        shopify.loading(false);
        },[])
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
    const [showBanner, setShowBanner] = useState(true);

    const SettingsDataTab = (
            <div className='Cart_notice_page_SettingsDataTab_container'>
                <BlockStack gap="400">
                   
                    <InlineGrid columns={['oneThird', 'twoThirds']}>
                        <Text variant="headingMd" as="h6">
                        {`${t('defaultSettings.settings')}`}
                        </Text>
                        <Layout>
                            <Layout.Section>
                                <Card roundedAbove="sm">
                                    <BlockStack gap="300">

                                        <div className='checkbox_section'>
                                            <BlockStack gap="300">
                                                <div className='color_section'>
                                                    <TextField
                                                        label={`${t('StickyCart.look.bgColor')}`}
                                                        type="text"
                                                        value={formData.notice_bg_color}
                                                        onChange={(e) => {
                                                            handleFocus("notice_bg_color")
                                                            handleChange(e, "notice_bg_color")
                                                        }
                                                        }
                                                        autoComplete="off"
                                                        connectedLeft={
                                                            <input
                                                                type="color"
                                                                onFocus={() => handleFocus("notice_bg_color")}
                                                                value={formData.notice_bg_color}
                                                                onChange={(e) => {
                                                                    handleFocus("notice_bg_color")
                                                                    handleColorChange(e, "notice_bg_color")
                                                                }}
                                                                style={{
                                                                    boxShadow: formData.notice_bg_color === '#ffffff' ? 'inset 0 0 0 1px rgba(0, 0, 0, .19)' : 'none',
                                                                    width:formData.notice_bg_color === '#ffffff' ? '34px':'38px',
                                                                       height:formData.notice_bg_color === '#ffffff' ? '34px':'38px'
                                                                  }}
                                                            />
                                                        }
                                                    />
                                                </div>
                                                <div className='color_section'>
                                                    <TextField
                                                        label={`${t('StickyCart.look.textColor')}`}
                                                        type="text"
                                                        value={formData.notice_text_color}
                                                        onChange={(e) => {
                                                            handleFocus("notice_text_color")
                                                            handleChange(e, "notice_text_color")
                                                        }
                                                        }
                                                        autoComplete="off"
                                                        connectedLeft={
                                                            <input
                                                                type="color"
                                                                value={formData.notice_text_color}
                                                                onChange={(e) => {
                                                                    handleFocus("notice_text_color")
                                                                    handleColorChange(e, "notice_text_color")
                                                                }
                                                                }
                                                                style={{
                                                                    boxShadow: formData.notice_text_color === '#ffffff' ? 'inset 0 0 0 1px rgba(0, 0, 0, .19)' : 'none',
                                                                    width:formData.notice_text_color === '#ffffff' ? '34px':'38px',
                                                                       height:formData.notice_text_color === '#ffffff' ? '34px':'38px'
                                                                  }}
                                                            />
                                                        }
                                                    />
                                                </div>
                                                <TextField
                                                    label={`${t('CartNotice.cartTitle')}`}
                                                    value={formData.cart_notice_title}
                                                    autoComplete="off"
                                                    onChange={(e) => {
                                                        handleChange(e, "cart_notice_title")
                                                        handleFocus("cart_notice_title")
                                                    }
                                                    }
                                                    placeholder="An item in your cart is in high demand."
                                                />

                                                <TextField
                                                    label={`${t('CartNotice.secondaryText')}`}
                                                    value={formData.cart_notice_secondary}
                                                    autoComplete="off"
                                                    onChange={(e) => {
                                                        handleFocus("cart_notice_secondary")
                                                        handleChange(e, "cart_notice_secondary")
                                                    }
                                                    }
                                                    helpText="You can use a countdown timer if you include the {{ counter }} variable in the text."
                                                    placeholder={`${t('CartNotice.complet')}`}
                                                />

                                                <Checkbox
                                                    label={`${t('CartNotice.hide')}`}
                                                    checked={formData.hide_fire_icon}
                                                    onChange={(e) => {
                                                        handleFocus("hide_fire_icon")
                                                        handleChange(e, "hide_fire_icon")
                                                    }
                                                    }
                                                />
                                            </BlockStack>
                                        </div>

                                    </BlockStack>
                                </Card>
                            </Layout.Section>
                        </Layout>
                    </InlineGrid>

                   

                </BlockStack>
            </div>
     );
     const url = `https://admin.shopify.com/store/${storeName.replace('.myshopify.com', '')}/admin/themes/current/editor?template=cart&addAppBlockId=8177ef1b-fb1c-4ebb-a686-d743f22ea714/cartnotice&target=newAppsSection`;
     const appName = t('CartNotice.appTitle');
     const handleClick = () => {
         navigate("/app");
         shopify.loading(true);
       };
         const handleDismiss = () => {
    setIsDismissed(true);
  };
    return (
        <div className='Cart_notice_page_page'>
            <Page
                backAction={{ content: "Back", onAction: handleClick }}
                title={`${t('CartNotice.appTitle')}`}
                subtitle={`${t('CartNotice.appdsec')}`}
                primaryAction={
                    status ? (
                        <DeactivatePopover  type={appName}handleToggleStatus={handleToggleStatus} buttonLoading={buttonloading} />
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
                { !isDismissed  && (
          <Banner
            title={t('CartNotice.title')}
            tone="warning"
            onDismiss={handleDismiss}
          >
            <p>{`${t('CartNotice.desc')}`} <a href={url} target="_blank">{`${t('CartNotice.link')}`}</a>
            </p>
          </Banner>
        )}
                    <div className='intant_search_TabsField'>
                        <BlockStack gap='200'>
                            {SettingsDataTab}
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

export default CartNotice;
