import {
  ActionList,
  Banner,
  Toast,
  BlockStack,
  Box,
  ContextualSaveBar,
  Button,
  Frame,
  ColorPicker,
  ButtonGroup,
  Card,
  Checkbox,
  Collapsible,
  DatePicker,
  Form,
  FormLayout,
  Grid,
  Icon,
  InlineGrid,
  InlineStack,
  Layout,
  LegacyCard,
  LegacyStack,
  Link,
  OptionList,
  Page,
  Popover,
  Scrollable,
  Select,
  Tabs,
  Text,
  TextContainer,
  TextField,
  Tooltip,
  useBreakpoints,
} from "@shopify/polaris";
import React, {
  Component,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import "./assets/style.css";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import DeactivatePopover from "./components/DeactivatePopover";
import DiscardModal from './components/DiscardModal';
export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
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

      }`);
  const result = await response.json();
  let storeName = session.shop.split(".")[0];
  const appId = result.data.currentAppInstallation.id;
  const metafielData = result.data.currentAppInstallation.metafields.edges;
  const defaultSettings = {
    app_name: "CartFavicon",
    app_status: false,
    // shape: "Circle",
    // location: "Bottom Left",

    badge_color: "#000000",
    text_color: "#ffffff",
  };
  const appName =
    metafielData.length > 0
      ? metafielData.filter((item) => item.node.namespace === "CartFavicon")
      : [];

  let appSettings =
    appName.length > 0 ? appName[0].node.value : defaultSettings;

  let data;
  if (typeof appSettings === "string") {
    try {
      data = JSON.parse(appSettings);
    } catch (error) {
      console.error("Error parsing appSettings:", error);
      data = {};
    }
  } else {
    data = appSettings;
  }

  return { data , storeName};
};
import { useNavigate } from "@remix-run/react";
function Favicon_cart_count(props) {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const { data, storeName } = useLoaderData();
  const [status, setStatus] = useState(data.app_status);
  const [active, setActive] = useState(false);
  const [buttonloading, setButtonLoading] = useState(false);
  const [msgData, setMsgData] = useState("");
  const [lastSavedData, setLastSavedData] = useState(data);
  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };
  const [isDismissed, setIsDismissed] = useState(false);
  const [activemodal, setActivemodal] = useState(false);
  const toggleModal = useCallback(() => setActivemodal((activemodal) => !activemodal), []);
  const [formData, setFormData] = useState(data);

  const [activeField, setActiveField] = useState(null);
  const handleSelectChange = useCallback(
    (value, property) => {
      setFormData({
        ...formData,
        [property]: value,
      });
    },
    [formData],
  );
  const handleInputChange = (value, property) => {
    setFormData((formData) => ({
      ...formData,
      [property]: value,
    }));
  };
  const handleColorChange = (value, field) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };




  const toggleActive = useCallback(
    () => setActive((prevActive) => !prevActive),
    [],
  );
 

  const handleSave = async () => {
    setButtonLoading(true);
    const dataToSend = {
      actionType: "save",
      data: formData,
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
      setButtonLoading(false);
      setActive(true);
      setActiveField(false);
      setError(true);
      setMsgData("There is some error while update");
    }
  };
  const toastMarkup = active ? (
    <Frame>
      <Toast content={msgData} onDismiss={toggleActive} error={error} />
    </Frame>
  ) : null;

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
      }
    } catch (error) {
      setError(true);
      setButtonLoading(false);
      setMsgData("There is some error");
      console.error("API request failed:", error);
    } finally {
      setButtonLoading(false);
      setActive(true);
      setActiveField(false);
    }
  };
  const handleDiscard = () => {
    setFormData(lastSavedData)
    setActiveField(false);
    toggleModal();
};
 

  useEffect(() => {
    shopify.loading(false);
  }, []);
  const handleClick = () => {
    navigate("/app");
    shopify.loading(true);
  };
  const handleDismiss = () => {
    setIsDismissed(true);
  };
   const url = `https://admin.shopify.com/store/${storeName.replace('.myshopify.com', '')}/admin/themes/current/editor?context=theme`;
    const appName = "Favicon Cart Count"
  return (
    <div className="Favicon_cart_count_page">
      <Page
        backAction={{ content: "Back", onAction:  handleClick  }}
        title="Favicon Cart Count"
        subtitle="Make sure your store's browser tab stands out by displaying the number of items in cart on the favicon."
        primaryAction={
          status ? (
            <DeactivatePopover
            type={appName}
              handleToggleStatus={handleToggleStatus}
              buttonLoading={buttonloading}
            />
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
        <div className="Favicon_cart_count">
        {!isDismissed &&(
        <Banner   onDismiss={handleDismiss}>
          <p>
          Please make sure you have added a favicon image to view this app.
          <a href={url} target="_blank">Click Here</a>
          </p>
        </Banner>)}
          <div className="SettingsDataTab_container">
            <BlockStack gap="400">
              <InlineGrid columns={["oneThird", "twoThirds"]}>
                <Text variant="headingMd" as="h6">
                  Settings
                </Text>
                <Layout>
                  <Layout.Section>
                    <Card roundedAbove="sm">
                      <BlockStack gap="300">
                        <div className="checkbox_section">
                          <BlockStack gap="400">
                            
                            <div className="color_section">
                              <TextField
                                label="Badge color"
                                type="text"
                                onFocus={() => handleFocus("field4")}
                                value={formData.badge_color}
                                onChange={(e) =>
                                  handleInputChange(e, "badge_color")
                                }
                                autoComplete="off"
                                connectedLeft={
                                  <input
                                  type="color"
                                  onChange={(e) =>{
                                    handleFocus("field1")
                                    handleColorChange(
                                      e.target.value,
                                      "badge_color",
                                    )
                                  }}
                                  style={{
                                    boxShadow:
                                      formData.badge_color === "#ffffff"
                                        ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                                        : "none",
                                    width:
                                      formData.badge_color === "#ffffff"
                                        ? "34px"
                                        : "38px",
                                    height:
                                      formData.badge_color === "#ffffff"
                                        ? "34px"
                                        : "38px",
                                  }}
                                  value={formData.badge_color}
                                />
                                }
                              />
                            </div>

                            <div className="color_section">
                              <TextField
                                label="Text color"
                                onFocus={() => handleFocus("field1")}
                                type="text"
                                value={formData.text_color}
                                onChange={(e) =>
                                  handleInputChange(e, "text_color")
                                }
                                autoComplete="off"
                                connectedLeft={
                                  <input
                                    type="color"
                                    onChange={(e) =>
                                      {
                                        handleFocus("field2")
                                      handleColorChange(
                                        e.target.value,
                                        "text_color",
                                      )
                                    }}
                                    style={{
                                      boxShadow:
                                        formData.text_color === "#ffffff"
                                          ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                                          : "none",
                                      width:
                                        formData.text_color === "#ffffff"
                                          ? "34px"
                                          : "38px",
                                      height:
                                        formData.text_color === "#ffffff"
                                          ? "34px"
                                          : "38px",
                                    }}
                                    value={formData.text_color}
                                  />
                                }
                              />
                            </div>

                            {/* <Select
                          label="Animation repetition interval"
                          options={Button_Size_options}
                          onChange={(value) =>
                            handleSelectChange(value, "animation_repeat")
                          }
                          value={formData.animation_repeat}
                          onFocus={() => handleFocus("field6")}
                        /> */}
                          </BlockStack>
                        </div>
                      </BlockStack>
                    </Card>
                  </Layout.Section>
                </Layout>
              </InlineGrid>

              {/* <div className="lower_section">
                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                    <Card roundedAbove="sm">
                      <BlockStack gap="200">
                        <Text as="h2" variant="headingSm">
                          Check our Help Center
                        </Text>
                        <BlockStack gap="200">
                          <Text as="p" fontWeight="reguler">
                            If you need help with setting up the Favicon Cart
                            Count app, please check our exhaustive Help Center
                            for details.
                          </Text>
                        </BlockStack>
                        <InlineStack align="end">
                          <ButtonGroup>
                            <Button
                              icon={ExternalIcon}
                              onClick={() => {}}
                              accessibilityLabel="Fulfill items"
                            >
                              <Text variant="headingSm" as="h6">
                                Get help
                              </Text>
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
                            We know how complex Vitals is - that's why{" "}
                            <Link href="#">we are available 24/7</Link> to
                            support you in setting it up.
                          </Text>
                        </BlockStack>
                        <InlineStack align="end">
                          <ButtonGroup>
                            <Button
                              onClick={() => {}}
                              accessibilityLabel="Fulfill items"
                            >
                              <Text variant="headingSm" as="h6">
                                Contact us
                              </Text>
                            </Button>
                          </ButtonGroup>
                        </InlineStack>
                      </BlockStack>
                    </Card>
                  </Grid.Cell>
                </Grid>
              </div> */}
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

export default Favicon_cart_count;
