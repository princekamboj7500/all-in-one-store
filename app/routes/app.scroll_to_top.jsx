import {
  Page,
  Layout,
  Card,
  Checkbox,
  TextField,
  Button,
  Icon,
  Popover,
  BlockStack,
  Text,
  InlineStack,
  Box,
  Frame,
  Toast,
  ContextualSaveBar,
} from "@shopify/polaris";
import "./assets/style.css";
import { useState, useCallback, useEffect } from "react";
import { product, bogoproduct, bogoproduct2 } from "./assets";
import { authenticate } from "../shopify.server";

import { useNavigate, useLoaderData } from "@remix-run/react";
import DeactivatePopover from "./components/DeactivatePopover";
import { useTranslation } from "react-i18next";
import { XIcon } from "@shopify/polaris-icons";
import {
  SvgIcon1,
  SvgIcon10,
  SvgIcon11,
  SvgIcon12,
  SvgIcon13,
  SvgIcon14,
  SvgIcon15,
  SvgIcon16,
  SvgIcon2,
  SvgIcon3,
  SvgIcon4,
  SvgIcon5,
  SvgIcon6,
  SvgIcon7,
  SvgIcon8,
  SvgIcon9,
} from "./components/Icons";
import DiscardModal from "./components/DiscardModal";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
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
    app_name: "ScrollTopToBottom",
    app_status: false,
    button_color: "#888888",
    show_on_desktop: 1,
    show_on_mobile: 1,

    theme_icon: "SvgIcon1",
  };

  const appName =
    metafielData.length > 0
      ? metafielData.filter(
          (item) => item.node.namespace === "ScrollTopToBottom",
        )
      : [];

  let appSettings =
    appName.length > 0 ? appName[0].node.value : defaultSettings;

  let data;
  if (typeof appSettings === "string") {
    try {
      data = JSON.parse(appSettings);
    } catch (error) {
      data = {};
    }
  } else {
    data = appSettings;
  }

  return { data };
};

export default function ScrollToTop() {
  const navigate = useNavigate();
	let { t } = useTranslation();
  const { data } = useLoaderData();
  const [status, setStatus] = useState(data.app_status);
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState(data);

  const [buttonloading, setButtonLoading] = useState(false);
  const [activeIcon, setActiveIcon] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [error, setError] = useState("");
  const [active, setActive] = useState(false);
  const [msgData, setMsgData] = useState("");
  const [lastSavedData, setLastSavedData] = useState(data);
  const [activemodal, setActivemodal] = useState(false);
  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };
  const toggleModal = useCallback(
    () => setActivemodal((activemodal) => !activemodal),
    [],
  );
  const toggleActive = useCallback(
    () => setActive((prevActive) => !prevActive),
    [],
  );

  const svgIcons = [
    { name: "SvgIcon1", imgSrc: <SvgIcon1 color={formData.button_color} /> },
    { name: "SvgIcon2", imgSrc: <SvgIcon2 color={formData.button_color} /> },
    { name: "SvgIcon3", imgSrc: <SvgIcon3 color={formData.button_color} /> },
    { name: "SvgIcon4", imgSrc: <SvgIcon4 color={formData.button_color} /> },
    { name: "SvgIcon5", imgSrc: <SvgIcon5 color={formData.button_color} /> },
    { name: "SvgIcon6", imgSrc: <SvgIcon6 color={formData.button_color} /> },
    { name: "SvgIcon7", imgSrc: <SvgIcon7 color={formData.button_color} /> },
    { name: "SvgIcon8", imgSrc: <SvgIcon8 color={formData.button_color} /> },
    { name: "SvgIcon9", imgSrc: <SvgIcon9 color={formData.button_color} /> },
    { name: "SvgIcon10", imgSrc: <SvgIcon10 color={formData.button_color} /> },
    { name: "SvgIcon11", imgSrc: <SvgIcon11 color={formData.button_color} /> },
    { name: "SvgIcon12", imgSrc: <SvgIcon12 color={formData.button_color} /> },
    { name: "SvgIcon13", imgSrc: <SvgIcon13 color={formData.button_color} /> },
    { name: "SvgIcon14", imgSrc: <SvgIcon14 color={formData.button_color} /> },
    { name: "SvgIcon15", imgSrc: <SvgIcon15 color={formData.button_color} /> },
    { name: "SvgIcon16", imgSrc: <SvgIcon16 color={formData.button_color} /> },
  ];

  const handleColorChange = (e) => {
    const colorValue = e.target.value;
    setFormData({
      ...formData,
      button_color: colorValue,
    });
  };

  const handleImageClick = (id) => {
    setActiveIcon(id);
    const selected = svgIcons.find((icon) => icon.name === id);
    setFormData({
      ...formData,
      theme_icon: id,
    });
  };

  const ScrollArrowsIcon = svgIcons.map((box) => (
    <div
      className={`aios_scroll_images ${
        formData.theme_icon === box.name || activeIcon === box.name
          ? "aios_scroll_active"
          : "aios_scroll_inactive"
      }`}
      key={box.name}
      onClick={() => handleImageClick(box.name)}
      onFocus={() => handleFocus(box.name)}
      tabIndex={0}
    >
      <div className="All_app_scroll_icon">{box.imgSrc}</div>
    </div>
  ));

  const handleInputChange = (value, property) => {
    setFormData((formData) => ({
      ...formData,
      [property]: value,
    }));
  };
  useEffect(() => {
    shopify.loading(false);
  }, []);

  const SelectedIcon = () => {
    var icon = svgIcons.find((i) => i.name == formData.theme_icon);
    icon = icon ? icon.imgSrc : <SvgIcon1 />;
    return icon;
  };

  function PopoverContentExample() {
    const [popoverActive, setPopoverActive] = useState(false);
    const [isActivated, setIsActivated] = useState(false);

    const togglePopoverActive = useCallback(
      () => setPopoverActive((popoverActive) => !popoverActive),
      [],
    );

    const handleDeactivateClick = useCallback(() => {
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
          <Button
            className="activate_button"
            tone="success"
            onClick={handleActivateClickAgain}
          >
           {`${t('defaultSettings.Activate')}`}  
          </Button>
        )}
      </>
    );

    return (
      <div>
        {isActivated ? (
          <>
            <Popover
              active={popoverActive}
              activator={activator}
              autofocusTarget="first-node"
              onClose={togglePopoverActive}
            >
              <Card>
                <Button onClick={handleDeactivateClick} tone="critical">
                 {`${t('defaultSettings.scrolltop')}`}
                </Button>
              </Card>
            </Popover>
          </>
        ) : (
          <>
            <Popover
              active={popoverActive}
              activator={activator}
              autofocusTarget="first-node"
              onClose={togglePopoverActive}
            >
              <Popover.Pane fixed>
                <Popover.Section>
                  <InlineStack>
                    <Text
                      alignment="center"
                      as="p"
                      fontWeight="regular"
                      variant="headingMd"
                    >
                      {`${t('defaultSettings.wentwrong')}`}{" "}
                    </Text>
                    <div>
                      <Icon source={XIcon}></Icon>
                    </div>
                  </InlineStack>
                </Popover.Section>
              </Popover.Pane>
            </Popover>
          </>
        )}
      </div>
    );
  }
  const toastMarkup = active ? (
    <Frame>
      <Toast content={msgData} onDismiss={toggleActive} error={error} />
    </Frame>
  ) : null;

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
  const handleDiscard = () => {
    setFormData(lastSavedData);
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
      setActiveField(false);
    }
  };
  const handleClick = () => {
    navigate("/app");
    shopify.loading(true);
  };

  const appName = t('ScrollTop.appTitle');
  return (
    <Page
      backAction={{ content: "Back", onAction: handleClick }}
      title={t('ScrollTop.appTitle')}
      subtitle={
        <Text variant="bodyLg" as="h6">
         {`${t('Homepage.paragraphnew2')}`}
        </Text>
      }
      primaryAction={
        status ? (
          <DeactivatePopover
            type={t('ScrollTop.appTitle')}
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
      <Layout>
        <Layout.Section variant="oneHalf">
          <Layout>
            <Layout.Section>
              <Card roundedAbove="sm">
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h6">
                    {`${t('defaultSettings.settings')}`}
                  </Text>
                  <Box paddingBlockStart="200">
                    <div className="checkbox_section">
                      <BlockStack gap="400">
                        <Checkbox
                          onFocus={() => handleFocus("field1")}
                          label={`${t('ScrollTop.labelDesktop')}`}
                          onChange={(e) =>
                            handleInputChange(e, "show_on_desktop")
                          }
                          checked={formData.show_on_desktop}
                        />

                        <Checkbox
                          onFocus={() => handleFocus("field2")}
                          label={`${t('ScrollTop.labelMobile')}`}
                          onChange={(e) =>
                            handleInputChange(e, "show_on_mobile")
                          }
                          checked={formData.show_on_mobile}
                        />

                        <div className="color_section">
                          <TextField
                            onFocus={() => handleFocus("field3")}
                            label={`${t('ScrollTop.btnColor')}`}
                            type="text"
                            value={formData.button_color}
                            onChange={(e) =>
                              handleInputChange(e, "button_color")
                            }
                            autoComplete="off"
                            connectedLeft={
                              <input
                                type="color"
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
                                onFocus={() => handleFocus("field3")}
                                value={formData.button_color}
                                onChange={handleColorChange}
                              />
                            }
                          />
                        </div>
                      </BlockStack>
                    </div>
                  </Box>
                </BlockStack>
              </Card>
            </Layout.Section>
            <Layout.Section>
              <Card roundedAbove="sm">
                <Text variant="headingMd" as="h6">
                {`${t('ScrollTop.theme')}`}
                </Text>
                <Box paddingBlockStart="200">
                  <div className="theme_image_icons">
                    <BlockStack gap="300">
                      <InlineStack wrap={true} gap="300" alignItems="center">
                        {ScrollArrowsIcon}
                      </InlineStack>
                    </BlockStack>
                  </div>
                </Box>
              </Card>
            </Layout.Section>
          </Layout>
        </Layout.Section>
        <Layout.Section variant="oneHalf">
          <div className="all_in_one_preview_layout">
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
                  <input className="product_input" type="number" />
                </div>
                <div className="add_cart_button">{`${t('defaultSettings.atc')}`}</div>
                <div className="product_description">
                  {`${t('ScrollTop.description')}`}
                  <br></br>
                  <br></br>
                  {`${t('ScrollTop.lorem')}`}
                </div>
              </div>
              <div className="app_preview_scroll_icon">{SelectedIcon()}</div>
            </div>
          </div>
        </Layout.Section>
      </Layout>
      {activeField && (
        <Frame
          logo={{
            width: 86,
            contextualSaveBarSource:
              "https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png",
          }}
        >
          <ContextualSaveBar
                message={t('defaultSettings.content')}
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
      <DiscardModal
        toggleModal={toggleModal}
        handleDiscard={handleDiscard}
        activemodal={activemodal}
      />
    </Page>
  );
}
