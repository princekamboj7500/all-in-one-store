import {
  ActionList,
  Badge,
  Banner,
  BlockStack,
  Box,
  ContextualSaveBar,
  Button,
  ButtonGroup,
  Card,
  Toast,
  Frame,
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
import React, { useCallback, useState, useEffect } from "react";
import {
  ChevronDownIcon,
  BookOpenIcon,
  ExternalIcon,
  XIcon,
  AlertCircleIcon,
  ArrowRightIcon,
} from "@shopify/polaris-icons";
import { useTranslation } from "react-i18next";
import DateRangePicker from "./components/DateRangePicker";
import { authenticate } from "../shopify.server";
import { useNavigate, useLoaderData } from "@remix-run/react";
import "./assets/style.css";
import DeactivatePopover from "./components/DeactivatePopover";
import DiscardModal from "./components/DiscardModal";
import { product, bogoproduct, bogoproduct2 } from "./assets";
export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  let storeName = session.shop.split(".")[0];
  const response = await admin.graphql(`query {
          currentAppInstallation {
            id
            metafields(first: 20) {
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

  const appId = result.data.currentAppInstallation.id;
  const metafielData = result.data.currentAppInstallation.metafields.edges;

  const defaultSettings = {
    app_name: "cookiebanner",
    app_status: false,
    cookie_banner_theme: "Floating",
    cookie_banner_bg: "#000000",
    cookie_banner_color: "#ffffff",
    acceptbtn_bg: "#dddddd",
    acceptbtn_color: "#222222",
    learnmore_text: "Learn more",
    learnmore_pivacylink: "",
    learnmore_color: "#aeaeae",

    cookie_consent_status: "Inactive",
    cookie_consent_text:
      "We use cookies to improve your experience and track website usage.",
    cookie_consent_accept_text: "Accept",
    cookie_consent_reject_text: "Decline",
    reject_btn_style: "Outline",
    reject_btn_border: "#aeaeae",
    reject_text_color: "#f2f2f2",
    reject_btn_bg: "#dddddd",

    informative_banner_status: "Active",
    // only_show_europe: "0",
    informative_banner_text:
      "We use cookies to improve your experience and track website usage.",
    informative_accept_text: "I understand",
  };

  const appName =
    metafielData.length > 0
      ? metafielData.filter((item) => item.node.namespace === "cookiebanner")
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
  return { data, storeName };
};

function CookieBanner(props) {
  const navigate = useNavigate();
  let { t } = useTranslation();
  const { data, storeName } = useLoaderData();
  const [formData, setFormData] = useState(data);
  const [status, setStatus] = useState(data.app_status);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const [msgData, setMsgData] = useState("");
  const [buttonloading, setButtonLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [lastSavedData, setLastSavedData] = useState(data);

  const [activemodal, setActivemodal] = useState(false);
  const toggleModal = useCallback(
    () => setActivemodal((activemodal) => !activemodal),
    [],
  );

  const [openStates, setOpenStates] = useState({
    generalDesignSettings: false,
    cookiesettings: false,
    informativeCookieBanner: false,
  });

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
  const handleNavigate = () => {

    window.open(
      `https://admin.shopify.com/store/${storeName.replace(".myshopify.com", "")}/settings/privacy/consent-banner`,
      "__blank",
    );
  };

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
      setLastSavedData(formData);
    } else {
      setButtonLoading(false);
      setActive(true);
      setActiveField(false);
      setError(true);
      setMsgData("There is some error while update");
    }
  };

  const handleDiscard = () => {
    setFormData(lastSavedData);
    setActiveField(false);
    toggleModal();
  };

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

  const handleToggle = (section) => {
    setOpenStates((prevOpenStates) => ({
      ...prevOpenStates,
      [section]: !prevOpenStates[section],
    }));
  };

  useEffect(() => {
    shopify.loading(false);
  }, []);

  const handleClick = () => {
    navigate("/app");
    shopify.loading(true);
  };

  const theme_options = [
    { label: "Select an option", value: "Select an option", disabled: "true" },
    { label: "Fixed Bottom", value: "Fixed Bottom" },
    { label: "Floating", value: "Floating" },
  ];
  const Status_options = [
    { label: "Select an option", value: "Select an option" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];
  const Reject_Button_options = [
    { label: "Select an option", value: "Select an option" },
    { label: "Fill", value: "Fill" },
    { label: "Outline", value: "Outline" },
    { label: "Text only", value: "Text only" },
  ];
  const informative_Status_options = [
    { label: "Select an option", value: "Select an option" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const General_Design_Settings = (
    <div>
      <Card sectioned>
        <BlockStack gap="400">
          <div className="arrow-sign">
            <BlockStack gap={200}>
              <div
                onClick={() => handleToggle("generalDesignSettings")}
                style={{ display: "inline-block", cursor: "pointer" }}
              >
                <div style={{ float: "left" }}>
                  <Text variant="headingSm" as="h6">
                  {`${t('CookieBanner.general.title')}`}
                  </Text>
                </div>
                <div style={{ float: "right" }}>
                  <InlineStack>
                    {openStates.generalDesignSettings ? (
                      <></>
                    ) : (
                      <div style={{ marginTop: "2px" }}>
                        <Text variant="bodySm" as="p">
                        {`${t('CookieBanner.displaySettings')}`} 
                        </Text>
                      </div>
                    )}
                    <Icon source={ChevronDownIcon} tone="base" />
                  </InlineStack>
                </div>
              </div>
              <Text variant="bodySm" as="p">
              {`${t('CookieBanner.general.subTitle')}`} 
              </Text>
            </BlockStack>
          </div>
          <Collapsible
            open={openStates.generalDesignSettings}
            id="basic-collapsible"
            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
            expandOnPrint
          >
            <BlockStack gap="300">
              <Select
                label={`${t('CookieBanner.general.label')}`} 
                options={theme_options}
                onChange={(e) => {
                  handleFocus("cookie_banner_theme");
                  handleChange(e, "cookie_banner_theme");
                }}
                value={formData.cookie_banner_theme}
              />
              <div className="color_section">
                <TextField
                  label={`${t('CookieBanner.general.bannerBgColor')}`} 
                  type="text"
                  onChange={(e) => {
                    handleFocus("cookie_banner_bg");
                    handleChange(e, "cookie_banner_bg ");
                  }}
                  value={formData.cookie_banner_bg}
                  autoComplete="off"
                  connectedLeft={
                    <input
                      type="color"
                      value={formData.cookie_banner_bg}
                      onChange={(e) => {
                        handleFocus("cookie_banner_bg");
                        handleColorChange(e, "cookie_banner_bg");
                      }}
                      style={{
                        boxShadow:
                          formData.cookie_banner_bg === "#ffffff"
                            ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                            : "none",
                        width:
                          formData.cookie_banner_bg === "#ffffff"
                            ? "34px"
                            : "38px",
                        height:
                          formData.cookie_banner_bg === "#ffffff"
                            ? "34px"
                            : "38px",
                      }}
                    />
                  }
                />
              </div>
              <div className="color_section">
                <TextField
                  label={`${t('CookieBanner.general.bannerTextColor')}`} 
                  type="text"
                  onChange={(e) => {
                    handleFocus("cookie_banner_color");
                    handleChange(e, "cookie_banner_color ");
                  }}
                  value={formData.cookie_banner_color}
                  autoComplete="off"
                  connectedLeft={
                    <input
                      type="color"
                      value={formData.cookie_banner_color}
                      onChange={(e) => {
                        handleFocus("cookie_banner_color");
                        handleColorChange(e, "cookie_banner_color");
                      }}
                      style={{
                        boxShadow:
                          formData.cookie_banner_color === "#ffffff"
                            ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                            : "none",
                        width:
                          formData.cookie_banner_color === "#ffffff"
                            ? "34px"
                            : "38px",
                        height:
                          formData.cookie_banner_color === "#ffffff"
                            ? "34px"
                            : "38px",
                      }}
                    />
                  }
                />
              </div>
              <div className="color_section">
                <TextField
                  label={`${t('CookieBanner.general.acceptBtn')}`} 
                  type="text"
                  onChange={(e) => {
                    handleChange(e, "acceptbtn_bg ");
                    handleFocus("acceptbtn_bg");
                  }}
                  value={formData.acceptbtn_bg}
                  autoComplete="off"
                  connectedLeft={
                    <input
                      type="color"
                      value={formData.acceptbtn_bg}
                      onChange={(e) => {
                        handleFocus("acceptbtn_bg");
                        handleColorChange(e, "acceptbtn_bg");
                      }}
                      style={{
                        boxShadow:
                          formData.acceptbtn_bg === "#ffffff"
                            ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                            : "none",
                        width:
                          formData.acceptbtn_bg === "#ffffff" ? "34px" : "38px",
                        height:
                          formData.acceptbtn_bg === "#ffffff" ? "34px" : "38px",
                      }}
                    />
                  }
                />
              </div>
              <div className="color_section">
                <TextField
                  label={`${t('CookieBanner.general.accpetTextColor')}`} 
                  type="text"
                  onChange={(e) => {
                    handleFocus("acceptbtn_color");
                    handleChange(e, "acceptbtn_color ");
                  }}
                  value={formData.acceptbtn_color}
                  autoComplete="off"
                  connectedLeft={
                    <input
                      type="color"
                      value={formData.acceptbtn_color}
                      onChange={(e) => {
                        handleFocus("acceptbtn_color");
                        handleColorChange(e, "acceptbtn_color");
                      }}
                      style={{
                        boxShadow:
                          formData.acceptbtn_color === "#ffffff"
                            ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                            : "none",
                        width:
                          formData.acceptbtn_color === "#ffffff"
                            ? "34px"
                            : "38px",
                        height:
                          formData.acceptbtn_color === "#ffffff"
                            ? "34px"
                            : "38px",
                      }}
                    />
                  }
                />
              </div>

              <TextField
                label={`${t('CookieBanner.general.learnMore')}`}
                value={formData.learnmore_text}
                onChange={(e) => {
                  handleFocus("learnmore_text");
                  handleChange(e, "learnmore_text");
                }}
                autoComplete="off"
                placeholder={`${t('CookieBanner.general.learnMore')}`}
              />

              <TextField
                label={`${t('CookieBanner.general.url')}`}
                value={formData.learnmore_pivacylink}
                onChange={(e) => {
                  handleFocus("learnmore_pivacylink");
                  handleChange(e, "learnmore_pivacylink");
                }}
                autoComplete="off"
                helpText={
                  <Text as="p" variant="bodySm">
                    {`${t('CookieBanner.general.Every')}`}{" "}
                    <a
                      target="_blank"
                      href="https://www.shopify.com/tools/policy-generator?_gl=1*1l5buzj*_ga*MzI4MTA0NjUxLjE3MTk1NjA0MDU.*_ga_JPZEV67G7G*MTcyMjkyMTE2MC4xMjguMS4xNzIyOTIxMTcxLjQ5LjAuMA.."
                    >
                      {`${t('CookieBanner.general.link')}`}
                    </a>{" "}
                    {`${t('CookieBanner.general.quicklyget')}`}{" "}
                    
                  </Text>
                }
              />

              <div className="color_section">
                <TextField
                  label={`${t('CookieBanner.general.linkColor')}`}
                  type="text"
                  onChange={(e) => {
                    handleFocus("learnmore_color");
                    handleChange(e, "learnmore_color ");
                  }}
                  value={formData.learnmore_color}
                  autoComplete="off"
                  connectedLeft={
                    <input
                      type="color"
                      value={formData.learnmore_color}
                      onChange={(e) => {
                        handleFocus("learnmore_color");
                        handleColorChange(e, "learnmore_color");
                      }}
                      style={{
                        boxShadow:
                          formData.learnmore_color === "#ffffff"
                            ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                            : "none",
                        width:
                          formData.learnmore_color === "#ffffff"
                            ? "34px"
                            : "38px",
                        height:
                          formData.learnmore_color === "#ffffff"
                            ? "34px"
                            : "38px",
                      }}
                    />
                  }
                />
              </div>
            </BlockStack>
          </Collapsible>
        </BlockStack>
      </Card>
    </div>
  );

  const Cookie_Consent_Banner = (
    <div>
      <Card sectioned>
        <BlockStack gap="500">
          <div className="arrow-sign">
            <BlockStack gap={200}>
              <div
                onClick={() => handleToggle("cookiesettings")}
                style={{ display: "inline-block", cursor: "pointer" }}
              >
                <div style={{ float: "left" }}>
                  <Text variant="headingSm" as="h6">
                    <InlineStack gap={300}>
                      {" "}
                      {`${t('CookieBanner.Cookie.title')}`}
                      {formData.cookie_consent_status === "Active" ? (
                        <Badge tone="success">{`${t('CookieBanner.Cookie.statusOptions')}`}</Badge>
                      ) : (
                        <Badge>{`${t('CookieBanner.Cookie.inactive')}`}</Badge>
                      )}
                    </InlineStack>
                  </Text>
                </div>
                <div style={{ float: "right" }}>
                  <InlineStack>
                    {openStates.cookiesettings ? (
                      <></>
                    ) : (
                      <div style={{ marginTop: "2px" }}>
                        <Text variant="bodySm" as="p">
                        {`${t('CookieBanner.displaySettings')}`}
                        </Text>
                      </div>
                    )}
                    <Icon source={ChevronDownIcon} tone="base" />
                  </InlineStack>
                </div>
              </div>
              <Text variant="bodySm" as="p">
              {`${t('CookieBanner.Cookie.subTitle')}`}
                {/* <Link href="#">
                                        <Text variant="headingSm" as="h5">Preview</Text>
                                    </Link> */}
              </Text>
            </BlockStack>
          </div>

          <Collapsible
            open={openStates.cookiesettings}
            id="cookiesettings"
            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
            expandOnPrint
          >
            <BlockStack gap="400">
              <div className="cookies_banner_secondary_Color_card">
                <Card>
                  <BlockStack gap={500}>
                    <InlineStack>
                      <div>
                        <Icon source={BookOpenIcon} tone="base" />
                      </div>
                      <div>
                        <Text variant="headingSm" as="h6">
                        {`${t('CookieBanner.enableds')}`}
                        </Text>
                        <Text variant="bodySm" as="p">
                        {`${t('CookieBanner.ecternal')}`}
                        </Text>
                      </div>
                    </InlineStack>

                    <Text variant="bodyMd" as="p">
                      {`${t('CookieBanner.enabeltext')}`}
                    </Text>

                    <Text variant="bodyMd" as="p">
                    {`${t('CookieBanner.cookiecostent')}`}
                    </Text>

                    <ButtonGroup>
                      <Button onClick={handleNavigate}>
                        <Text as="h6" variant="headingXs">
                          {" "}
                          {`${t('CookieBanner.bannertext')}`}
                        </Text>
                      </Button>

                      <Button variant="plain">{`${t('CookieBanner.readmore')}`}</Button>
                    </ButtonGroup>
                  </BlockStack>
                </Card>
              </div>

              <Select
                label={`${t('CookieBanner.Cookie.status')}`}
                options={Status_options}
                onChange={(e) => {
                  handleFocus("cookie_consent_status");
                  handleChange(e, "cookie_consent_status");
                }}
                value={formData.cookie_consent_status}
              />

              <TextField
                label={`${t('CookieBanner.Cookie.title')}`}
                autoComplete="off"
                placeholder="We use cookies to improve your experience and track website usage."
                onChange={(e) => {
                  handleFocus("cookie_consent_text");
                  handleChange(e, "cookie_consent_text");
                }}
                value={formData.cookie_consent_text}
              />

              <TextField
                label={`${t('CookieBanner.Cookie.acceptBtn')}`}
                autoComplete="off"
                placeholder="Accept."
                onChange={(e) => {
                  handleFocus("cookie_consent_accept_text");
                  handleChange(e, "cookie_consent_accept_text");
                }}
                value={formData.cookie_consent_accept_text}
              />

              <TextField
                label={`${t('CookieBanner.Cookie.rejectBtn')}`}
                autoComplete="off"
                onChange={(e) => {
                  handleFocus("cookie_consent_reject_text");
                  handleChange(e, "cookie_consent_reject_text");
                }}
                value={formData.cookie_consent_reject_text}
              />

              <Select
                label={`${t('CookieBanner.Cookie.btnStyle')}`} 
                options={Reject_Button_options}
                onChange={(e) => {
                  handleFocus("reject_btn_style");
                  handleChange(e, "reject_btn_style");
                }}
                value={formData.reject_btn_style}
              />
              {formData.reject_btn_style === "Outline" && (
                <div className="color_section">
                  <TextField
                    label={`${t('CookieBanner.Cookie.borderColor')}`} 
                    type="text"
                    onChange={(e) => {
                      handleFocus("reject_btn_border");
                      handleChange(e, "reject_btn_border");
                    }}
                    value={formData.reject_btn_border}
                    autoComplete="off"
                    connectedLeft={
                      <input
                        type="color"
                        value={formData.reject_btn_border}
                        onChange={(e) => {
                          handleFocus("reject_btn_border");
                          handleColorChange(e, "reject_btn_border");
                        }}
                        style={{
                          boxShadow:
                            formData.reject_btn_border === "#ffffff"
                              ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                              : "none",
                          width:
                            formData.reject_btn_border === "#ffffff"
                              ? "34px"
                              : "38px",
                          height:
                            formData.reject_btn_border === "#ffffff"
                              ? "34px"
                              : "38px",
                        }}
                      />
                    }
                  />
                </div>
              )}
              {formData.reject_btn_style === "Fill" && (
                <div className="color_section">
                  <TextField
                    label={`${t('CookieBanner.Cookie.rejectbackcolor')}`} 
                    type="text"
                    onChange={(e) => {
                      handleFocus("reject_btn_bg");
                      handleChange(e, "reject_btn_bg");
                    }}
                    value={formData.reject_btn_bg}
                    autoComplete="off"
                    connectedLeft={
                      <input
                        type="color"
                        value={formData.reject_btn_bg}
                        onChange={(e) => {
                          handleFocus("reject_btn_bg");
                          handleColorChange(e, "reject_btn_bg");
                        }}
                        style={{
                          boxShadow:
                            formData.reject_btn_bg === "#ffffff"
                              ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                              : "none",
                          width:
                            formData.reject_btn_bg === "#ffffff"
                              ? "34px"
                              : "38px",
                          height:
                            formData.reject_btn_bg === "#ffffff"
                              ? "34px"
                              : "38px",
                        }}
                      />
                    }
                  />
                </div>
              )}

              <div className="color_section">
                <TextField
                  label={`${t('CookieBanner.Cookie.textColor')}`} 
                  type="text"
                  onChange={(e) => {
                    handleFocus("reject_text_color");
                    handleChange(e, "reject_text_color");
                  }}
                  value={formData.reject_text_color}
                  autoComplete="off"
                  connectedLeft={
                    <input
                      type="color"
                      value={formData.reject_text_color}
                      onChange={(e) => {
                        handleFocus("reject_text_color");
                        handleColorChange(e, "reject_text_color");
                      }}
                      style={{
                        boxShadow:
                          formData.reject_text_color === "#ffffff"
                            ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                            : "none",
                        width:
                          formData.reject_text_color === "#ffffff"
                            ? "34px"
                            : "38px",
                        height:
                          formData.reject_text_color === "#ffffff"
                            ? "34px"
                            : "38px",
                      }}
                    />
                  }
                />
              </div>

              <div>
                <Text variant="headingSm" as="h6">
                {`${t('CookieBanner.Cookie.ResetConsent')}`} 
                </Text>
                <Text variant="bodyMd" as="p">
                {`${t('CookieBanner.Cookie.visitor')}`}  <Link>{`${t('CookieBanner.Cookie.guid')}`}</Link>
                  .
                </Text>
              </div>
            </BlockStack>
          </Collapsible>
        </BlockStack>
      </Card>
    </div>
  );

  const Informative_Cookie_Banner = (
    <div>
      <Card sectioned>
        <BlockStack gap="500">
          <div className="arrow-sign">
            <BlockStack gap={200}>
              <div
                onClick={() => handleToggle("informativeCookieBanner")}
                style={{ display: "inline-block", cursor: "pointer" }}
              >
                <div style={{ float: "left" }}>
                  <Text variant="headingSm" as="h6">
                    <InlineStack gap={300}>
                    {`${t('CookieBanner.Informative.Bannertitle')}`}
                      {formData.informative_banner_status === "Active" ? (
                        <Badge tone="success">{`${t('CookieBanner.Cookie.statusOptions')}`} </Badge>
                      ) : (
                        <Badge>{`${t('CookieBanner.Cookie.inactive')}`}</Badge>
                      )}
                    </InlineStack>
                  </Text>
                </div>
                <div style={{ float: "right" }}>
                  <InlineStack>
                    {openStates.informativeCookieBanner ? (
                      <> </>
                    ) : (
                      <div style={{ marginTop: "2px" }}>
                        <Text variant="bodySm" as="p">
                          {`${t('CookieBanner.displaySettings')}`}
                        </Text>
                      </div>
                    )}
                    <Icon source={ChevronDownIcon} tone="base" />
                  </InlineStack>
                </div>
              </div>
              <Text variant="bodySm" as="p">
              {`${t('CookieBanner.description')}`}
                <Link href="#">
                  <Text variant="headingSm" as="h5">
                  {`${t('CookieBanner.Preview')}`}
                  </Text>
                </Link>
              </Text>
            </BlockStack>
          </div>

          <Collapsible
            open={openStates.informativeCookieBanner}
            id="basic-collapsible"
            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
            expandOnPrint
          >
            <BlockStack gap="400">
              <Select
                label={`${t('CookieBanner.Cookie.status')}`}
                options={informative_Status_options}
                onChange={(e) => {
                  handleFocus("informative_banner_status");
                  handleChange(e, "informative_banner_status");
                }}
                value={formData.informative_banner_status}
              />
              <TextField
                label={`${t('CookieBanner.Cookie.text')}`}
                onChange={(e) => {
                  handleFocus("informative_banner_text");
                  handleChange(e, "informative_banner_text");
                }}
                value={formData.informative_banner_text}
                autoComplete="off"
                placeholder={`${t('CookieBanner.Informative.improve')}`}
              />

              <TextField
                label={`${t('CookieBanner.Informative.accept')}`}
                onChange={(e) => {
                  handleFocus("informative_accept_text");
                  handleChange(e, "informative_accept_text");
                }}
                value={formData.informative_accept_text}
                autoComplete="off"
                placeholder={`${t('CookieBanner.Informative.understand')}`}
              />
            </BlockStack>
          </Collapsible>
        </BlockStack>
      </Card>
    </div>
  );

  const SettingsDataTab = (
    <div style={{ padding: "10px" }} className="SettingsDataTab_container">
      <BlockStack gap={500}>
        <div className="upper_section">
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
              <Layout>
                <Layout.Section variant="oneThird">
                  {General_Design_Settings}
                </Layout.Section>
                <Layout.Section variant="oneThird">
                  {Cookie_Consent_Banner}
                </Layout.Section>
                <Layout.Section variant="oneThird">
                  {Informative_Cookie_Banner}
                </Layout.Section>
              </Layout>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
              <div
                className="all_in_one_preview_layout"
                style={{ position: "sticky", top: "-5%" }}
              >
                <div className="grid_2nd_card_conatiner">
                  <div className="grid_2nd_inner_card_conatiner">
                    <div className="all_preview_header">
                      {`${t('ScrollTop.examplecom')}`}
                    </div>
                    <div className="all_preview_image">
                      <img
                        className="preview_image"
                        src={bogoproduct}
                        width="200"
                       height="200"
                      />
                    </div>
                    <div className="all_preview_body">
                      <h1>{`${t('ScrollTop.example')}`}</h1>
                    </div>
                    <div className="price_section_grid_2nd">
                      <h1>
                        <del>300 INR</del> <span>200 INR</span>
                      </h1>
                    </div>
                    <div className="product_preview_quantity">
                      <input
                        className="product_input"
                        type="number"
                        value="1"
                      />
                    </div>
                    <div className="add_cart_button">Add to cart</div>
                    <div className="product_description">
                    {`${t('ScrollTop.description')}`}
                      <br></br>
                      <br></br>
                      {`${t('ScrollTop.lorem')}`}                      
                    </div>

                    {openStates.cookiesettings ? (
                      <div
                        className={
                          formData.cookie_banner_theme === "Floating"
                            ? "cookie-bottom"
                            : "cookie-bottom fixed-cookie"
                        }
                        style={{ backgroundColor: formData.cookie_banner_bg }}
                      >
                        <p style={{ color: formData.cookie_banner_color }}>
                          {formData.cookie_consent_text}{" "}
                          {formData.learnmore_pivacylink ? (
                            <a
                              href={formData.learnmore_pivacylink}
                              style={{ color: formData.learnmore_color }}
                            >
                              {formData.learnmore_text}
                            </a>
                          ) : (
                            ""
                          )}
                        </p>
                        <button
                          className="cookie-btn"
                          style={{
                            backgroundColor: formData.acceptbtn_bg,
                            color: formData.acceptbtn_color,
                          }}
                        >
                          {formData.cookie_consent_accept_text}
                        </button>
                        {formData.cookie_consent_reject_text && (
                          <>
                            {formData.reject_btn_style === "Outline" && (
                              <button
                                className="cookie-btn-reject"
                                style={{
                                  borderColor: formData.reject_btn_border,
                                  color: formData.reject_text_color,
                                }}
                              >
                                {formData.cookie_consent_reject_text}
                              </button>
                            )}
                            {formData.reject_btn_style === "Fill" && (
                              <button
                                className="cookie-btn-reject"
                                style={{
                                  backgroundColor: formData.reject_btn_bg,
                                  borderColor: "transparent",
                                  color: formData.reject_text_color,
                                }}
                              >
                                {formData.cookie_consent_reject_text}
                              </button>
                            )}
                            {formData.reject_btn_style === "Text only" && (
                              <button
                                className="cookie-btn-reject text-onlybtn-reject"
                                style={{
                                  color: formData.reject_text_color,
                                  borderColor: "transparent",
                                }}
                              >
                                {formData.cookie_consent_reject_text}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <div
                        className={
                          formData.cookie_banner_theme === "Floating"
                            ? "cookie-bottom"
                            : "cookie-bottom fixed-cookie"
                        }
                        style={{ backgroundColor: formData.cookie_banner_bg }}
                      >
                        <p style={{ color: formData.cookie_banner_color }}>
                          {formData.informative_banner_text}{" "}
                          {formData.learnmore_pivacylink ? (
                            <a
                              href={formData.learnmore_pivacylink}
                              style={{ color: formData.learnmore_color }}
                            >
                              {formData.learnmore_text}
                            </a>
                          ) : (
                            ""
                          )}
                        </p>
                        <button
                          className="cookie-btn"
                          style={{
                            backgroundColor: formData.acceptbtn_bg,
                            color: formData.acceptbtn_color,
                          }}
                        >
                          {formData.informative_accept_text}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Grid.Cell>
          </Grid>
        </div>
      </BlockStack>
    </div>
  );

  function GraphCard(props) {
    return (
      <div className="Cookie_Banner_graph_card_ui">
        <InlineGrid columns={4}>
          <div className="graph_card_1">
            <BlockStack gap={300}>
              <Text fontWeight="bold" variant="headingMd" as="h6">
              {`${t('ScrollTop.Impressions')}`}
              </Text>
              <Text fontWeight="bold" variant="headingLg" as="h5">
                8
              </Text>
              <Text as="p" fontWeight="medium">
              {`${t('ScrollTop.Nochange')}`}
              </Text>
            </BlockStack>
          </div>

          <div className="graph_card_2">
            <BlockStack gap={300}>
              <Text fontWeight="bold" variant="headingMd" as="h6">
              {`${t('ScrollTop.Acceptrate')}`}
              </Text>
              <Text fontWeight="bold" variant="headingLg" as="h5">
                0 %
              </Text>
              <Text as="p" fontWeight="medium">
              {`${t('ScrollTop.Nochange')}`}
              </Text>
            </BlockStack>
          </div>
          <div></div>
          <div></div>
        </InlineGrid>
      </div>
    );
  }

  const AnalyticsPaymentsTab = () => {
    return (
      <div
        style={{ padding: "10px" }}
        className="Cookies_Banner_page_AnalyticsPaymentsTab_container"
      >
        <BlockStack gap="600">
          <div>
            <DateRangePicker />
          </div>
          <Card>
            <BlockStack gap={800}>
              <GraphCard />
              <div
                className="analytic_card_icon_only"
                style={{ textAlign: "center" }}
              >
                <BlockStack gap={100}>
                  <Icon source={BookOpenIcon}> </Icon>

                  <Text as="h6" variant="headingMd">
                    {`${t('CookieBanner.Informative.analytics')}`}
                  </Text>
                  <Text as="p" variant="bodyXs">
                  {`${t('CookieBanner.Informative.nodata')}`}
                  </Text>
                </BlockStack>
              </div>
            </BlockStack>
          </Card>
        </BlockStack>
      </div>
    );
  };

  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );
  const tabs = [
    {
      id: "Settings-customers-1",
      content:t('defaultSettings.settings'),
      accessibilityLabel: "Settings customers",
      panelID: "Settings-customers-content-1",
      component: <>{SettingsDataTab}</>,
      dummy: "",
    }
   
  ];
  const appName = t('CookieBanner.appTitle');
  return (
    <div className="Cookies_Banner_page">
      <Page
        backAction={{ content: "Back", onAction: handleClick }}
        title={t('CookieBanner.appTitle')}
        subtitle={t('CookieBanner.appDesc')}
        primaryAction={
          status ? (
            <DeactivatePopover
              type={appName}
              handleToggleStatus={handleToggleStatus}
              buttonLoading={buttonloading}
            />
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
        <div className="Cookies_Banner">
          <div className="TabsField">
            <BlockStack>
              <div className="tab_container">
                <Tabs
                  tabs={tabs}
                  selected={selected}
                  onSelect={handleTabChange}
                >
                  <Box>{tabs[selected].dummy}</Box>
                  <div>{tabs[selected].component}</div>
                </Tabs>
              </div>
            </BlockStack>
          </div>
        </div>
        {activeField && (
          <div className="contextual-frame">
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
                  onAction: toggleModal,
                }}
              />
            </Frame>
          </div>
        )}
        {toastMarkup}
        <DiscardModal
          toggleModal={toggleModal}
          handleDiscard={handleDiscard}
          activemodal={activemodal}
        />
      </Page>
    </div>
  );
}

export default CookieBanner;
