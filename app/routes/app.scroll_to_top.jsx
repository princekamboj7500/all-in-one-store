import {
  Page,
  Badge,
  Grid,
  Layout,
  Card,
  Collapsible,
  Checkbox,
  TextField,
  Button,
  Icon,
  
  Tooltip,
  Link, OptionList,
  Popover,
  ActionList,
  BlockStack,
  Text,
  InlineStack,
  ButtonGroup,
  Box,
  Frame,
  Toast,
  ContextualSaveBar,
  InlineGrid,
} from "@shopify/polaris";
import "./assets/style.css";
import { useState, useCallback, useEffect } from "react";

import { authenticate } from "../shopify.server";
import {
  Modal,
  TitleBar,
  useAppBridge,
  SaveBar,
} from "@shopify/app-bridge-react";
import { useNavigate, useLoaderData } from "@remix-run/react";
import DeactivatePopover from "./components/DeactivatePopover";


import {
  ChevronDownIcon, XIcon, MinusIcon, SearchIcon, ExternalIcon, CalendarIcon, AlertCircleIcon, ArrowRightIcon
} from '@shopify/polaris-icons';
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
    console.log(metafielData,"metafielData--")
      const appName = metafielData.filter(item => item.node.namespace === "Scroll Top To Bottom");
      
      const appSettings = appName.length > 0 ? appName[0].node.value : {
        app_name: "Scroll Top To Bottom",
        app_status: false,
        show_on_desktop: 1,
        show_on_mobile:  1,
        fill_animation: 0,
        theme_icon:  "SvgIcon1",
     
      };
     const  data = JSON.parse(appSettings);
  
     return {data};
};

export default function ScrollToTop() {
  const navigate = useNavigate();
  const shopify = useAppBridge();
 
  const { data } = useLoaderData();
  const [status, setStatus] = useState(data.app_status); 
  const [activeField, setActiveField] = useState(null);
  const [formData, setFormData] = useState(data);

  const[buttonloading,setButtonLoading] = useState(false);
  const [activeIcon, setActiveIcon] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");
  const[error, setError] =useState('');
  const [active, setActive] = useState(false);
  const [msgData, setMsgData] = useState("");
 
  const handleFocus = (fieldName) => {

    setActiveField(fieldName);
  };

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
    console.log(id, "llll");
    setActiveIcon(id);
    const selected = svgIcons.find((icon) => icon.name === id);
    setFormData({
      ...formData,
      theme_icon: id,
    });
  };

  const ScrollArrowsIcon = svgIcons.map((box) => (
    <Box
      key={box.name}
      borderColor={
        activeIcon === box.name
          ? "var(--p-color-border-emphasis)"
          : "transparent"
      }
      borderWidth="var(--p-border-width-050)"
      paddingInlineEnd="200"
      paddingInlineStart="200"
      borderRadius="100"
      paddingBlockEnd="200"
      style={{
        border:
          activeIcon === box.name
            ? "2px solid var(--p-color-border-emphasis)"
            : "1px solid transparent",
        padding: "10px",
        borderRadius: "0.25rem",
      }}
      onClick={() => handleImageClick(box.name)}
      onFocus={() => handleFocus(box.name)}
      tabIndex={0}
    >
      <div className="All_app_scroll_icon">{box.imgSrc}</div>
    </Box>
  ));

  const handleInputChange = (value, property) => {
    setFormData((formData) => ({
      ...formData,
     [property]: value,
    }));
  };

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

    const handleDeactivateClick= useCallback(() => {
      console.log("Hello deactivated successfully")
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
                            <Button onClick={handleDeactivateClick} tone="critical">Deactivate Scroll To Top Button</Button>
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
                    </Popover>
                </>
            }
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
      data:formData
      };
   
    console.log(formData, "formData--");
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
    setActiveField(false);
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


  
  return (
    <Page
      backAction={{ content: "Back", onAction: () => navigate("/app") }}
      title="Scroll to Top Button"
      subtitle={
        <Text variant="bodyLg" as="h6">
          Help your customers get back easily to the top of the page, where they
          can see the product photos and purchase options.
        </Text>
      }
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
    
    >
      <Layout>
        <Layout.Section variant="oneHalf">
          <Layout>
            <Layout.Section>
              <Card roundedAbove="sm">
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h6">
                    Settings
                  </Text>
                  <Box paddingBlockStart="200">
                    <div className="checkbox_section">
                      <BlockStack gap="400">
                        <Checkbox
                          onFocus={() => handleFocus("field1")}
                          label="Show on desktop"
                          onChange={(e) =>
                            handleInputChange(e, "show_on_desktop")
                          }
                          checked={formData.show_on_desktop}
                        />

                        <Checkbox
                          onFocus={() => handleFocus("field2")}
                          label="Show on mobile"
                          onChange={(e) =>
                            handleInputChange(e, "show_on_mobile")
                          }
                          checked={formData.show_on_mobile}
                        />

                        <div className="color_section">
                          <TextField
                            onFocus={() => handleFocus("field3")}
                            label="Button Color"
                            type="text"
                            value={formData.button_color}
                            onChange={(e) =>
                              handleInputChange(e, "button_color")
                            }
                            autoComplete="off"
                            connectedLeft={
                              <input
                                type="color"
                                value={formData.button_color}
                                onChange={handleColorChange}
                              />
                            }
                          />
                        </div>
                        <div className="lower_checkbox">
                          <Checkbox
                            onFocus={() => handleFocus("field4")}
                            label="Fill Animation"
                            onChange={(e) =>
                              handleInputChange(e, "fill_animation")
                            }
                            checked={formData.fill_animation}
                            helpText="Displays an interactive, scroll dependent fill-animation."
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
                  Theme
                </Text>
                <Box paddingBlockStart="200">
                  <div className="theme_image_icons">
                    <BlockStack gap="300">
                      <InlineGrid gap="500" columns={5}>
                        {ScrollArrowsIcon}
                      </InlineGrid>
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
                  example.com/product-page
                </div>
                <div className="all_preview_image">
                  <img
                    className="preview_image"
                    src="https://d3acrzpqhtrug6.cloudfront.net/img/product-2.png"
                  />
                </div>
                <div className="all_preview_body">
                  <h1>Example product</h1>
                </div>
                <div className="price_section_grid_2nd">
                  <h1>
                    <del>300 INR</del> <span>200 INR</span>
                  </h1>
                </div>
                <div className="product_preview_quantity">
                  <input className="product_input" type="number" />
                </div>
                <div className="add_cart_button">Add to cart</div>
                <div className="product_description">
                  Example product description
                  <br></br>
                  <br></br>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of sheets containing Lorem Ipsum passages.
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
    </Page>
  );
}
