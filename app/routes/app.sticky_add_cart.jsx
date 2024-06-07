import {
  Banner,
  BlockStack,
  Box,
  Button,
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
  Page,
  Select,
  Tabs,
  Text,
  TextContainer,
  TextField,
  Tooltip,
} from "@shopify/polaris";
import React, { Component, useCallback, useState } from "react";
import {
  ChevronDownIcon,
  EditIcon,
  MinusIcon,
  SearchIcon,
  ExternalIcon,
  CalendarIcon,
  AlertCircleIcon,
} from "@shopify/polaris-icons";
import "./assets/style.css";
import { useNavigate, useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import DeactivatePopover from "./components/DeactivatePopover";
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

  const appId = result.data.currentAppInstallation.id;
  const metafielData = result.data.currentAppInstallation.metafields.edges;
  const defaultSettings = {
    app_name: "StickyAddCart",
    app_status: false,
    show_on_desktop: 1,
    desktop_position: 1,
    show_sticky_cart: "When user scrolls past the Add to cart button",
    show_quantity: 1,
    show_variant: 1,
    sticky_height: "Medium",
    show_product_title: 1,
    button_size: "Small",
    show_on_mobile: 1,
    mobile_position: "Bottom",
    show_sticky_cart_mobile: "When user scrolls past the Add to cart button",
    show_quantity_mobile: 1,
    show_variant_mobile: 1,
    show_product_reviews: 1,
    background_color: "#ffffff",
    text_color: "#eeeeee",
    sticky_position: "Custom",
    border_shadow: 1,
    border_radius: 2,
    border_colors: "#f6f6f6",
    show_animate_effect: 1,
  };
  console.log(metafielData, "metafielData--");

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
      console.error("Error parsing appSettings:", error);
      data = {}; // or handle the error as needed
    }
  } else {
    data = appSettings;
  }

  return { data };
};

export default function StickyAddToCart() {
  const navigate = useNavigate();
  const { data } = useLoaderData();
  const [formData, setFormData] = useState(data);
  const [status, setStatus] = useState(data.app_status);
  const[error, setError] =useState('');
  const [activeField, setActiveField] = useState(null);
  const [active, setActive] = useState(false);
  const[buttonloading,setButtonLoading] = useState(false);
  const [activeIcon, setActiveIcon] = useState(false);
  const [msgData, setMsgData] = useState(""); 
  const handleInputChange = (property, value) => {
    setFormData((formData) => ({
      ...formData,
      [property]: value,
    }));
  };
  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
 };
  const CollapsibleExample = () => {
    const [open, setOpen] = useState(true);

    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    return (
      <div>
        <Card sectioned>
          <BlockStack gap="300">
            <div className="arrow-sign">
              <div
                style={{ display: "flex" }}
                className="flex-container-button"
                onClick={() => handleToggle("intro")}
              >
                <div style={{ flexGrow: "0" }}>
                  <Icon source={EditIcon} tone="base" />
                </div>
                <div
                  style={{
                    flexGrow: "8",
                    textAlign: "start",
                    marginLeft: "4px",
                  }}
                >
                  <Text variant="headingMd" as="h6">
                    Need more design options?
                  </Text>
                </div>
                <div style={{ flexGrow: "0", textAlign: "end" }}>
                  <Icon source={ChevronDownIcon} tone="base" />
                </div>
              </div>
            </div>

            <Collapsible
              open={open}
              id="basic-collapsible"
              transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
              expandOnPrint
            >
              <BlockStack gap="300">
                <p>
                  Can't find the design options that you want? Chat with one of
                  our support specialists to help you customize the app for
                  free.
                </p>

                <div>
                  <Button>
                    <Text variant="headingSm" as="h6">
                      Start chat
                    </Text>
                  </Button>
                </div>
              </BlockStack>
            </Collapsible>
          </BlockStack>
        </Card>
      </div>
    );
  };
  const ModulefiltersCollapsibleExample = () => {
    const [open, setOpen] = useState(true);

    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    const [value, setValue] = useState("1");

    const handleChange = useCallback((newValue) => setValue(newValue), []);

    return (
      <div>
        <Card sectioned>
          <BlockStack gap="500">
            <div className="arrow-sign">
              <div
                style={{ display: "flex" }}
                className="flex-container-button"
                onClick={() => handleToggle("intro")}
              >
                <div
                  style={{
                    flexGrow: "8",
                    textAlign: "start",
                    marginLeft: "4px",
                  }}
                >
                  <BlockStack gap="300">
                    <Text variant="headingMd" as="h6">
                      Module filters
                    </Text>
                    <Text variant="bodySm" as="p">
                      Display module on product pages according to filters
                    </Text>
                  </BlockStack>
                </div>
                <div style={{ flexGrow: "0", textAlign: "end" }}>
                  <Icon source={ChevronDownIcon} tone="base" />
                </div>
              </div>
            </div>

            <Collapsible
              open={open}
              id="basic-collapsible"
              transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
              expandOnPrint
            >
              <BlockStack gap="500">
                <FormLayout>
                  <BlockStack gap="500">
                    <Box>
                      <BlockStack gap="100">
                        <Text as="p" fontWeight="regular">
                          Price between
                        </Text>
                        <InlineStack align="space-around">
                          <TextField
                            type="number"
                            value={value}
                            onChange={handleChange}
                            autoComplete="off"
                            prefix="INR"
                          />
                          <Icon source={MinusIcon} tone="base"></Icon>
                          <TextField
                            type="number"
                            value={value}
                            onChange={handleChange}
                            autoComplete="off"
                            prefix="INR"
                          />
                        </InlineStack>
                      </BlockStack>
                    </Box>

                    <Box>
                      <Text as="p" fontWeight="regular">
                        Discount between
                      </Text>
                      <InlineStack align="space-around">
                        <TextField
                          suffix="%"
                          type="number"
                          value={value}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                        <Icon source={MinusIcon} tone="base"></Icon>
                        <TextField
                          suffix="%"
                          type="number"
                          value={value}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </InlineStack>
                    </Box>

                    <Box>
                      <Text as="p" fontWeight="regular">
                        Inventory between
                      </Text>
                      <InlineStack align="space-around">
                        <TextField
                          type="number"
                          value={value}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                        <Icon source={MinusIcon} tone="base"></Icon>
                        <TextField
                          type="number"
                          value={value}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </InlineStack>
                    </Box>

                    <Box>
                      <TextField
                        label="Display only on"
                        type="number"
                        value={""}
                        onChange={""}
                        autoComplete="off"
                        connectedRight={
                          <Button>
                            <Text variant="headingSm" as="h6">
                              Browse
                            </Text>
                          </Button>
                        }
                        prefix={<Icon source={SearchIcon}></Icon>}
                        placeholder="Search products"
                      />
                    </Box>
                  </BlockStack>
                </FormLayout>

                <div>
                  <Button tone="critical" variant="tertiary">
                    <Text variant="headingSm" as="h6">
                      Reset filters
                    </Text>
                  </Button>
                </div>
              </BlockStack>
            </Collapsible>
          </BlockStack>
        </Card>
      </div>
    );
  };


  const SettingsDataTab = () => {
    const Location_options = [
      { label: "Select an option", value: "Select an option" },
      { label: "Top", value: "Top" },
      { label: "Bottom", value: "Bottom" },
    ];
    const Cart_bar_options = [
      { label: "Select an option", value: "Select an option" },
      { label: "Always on display", value: "Always on display" },
      {
        label: "When user starts scrolling",
        value: "When user starts scrolling",
      },
      {
        label: "When user scrolls past the Add to cart button",
        value: "When user scrolls past the Add to cart button",
      },
    ];
    const Height_options = [
      { label: "Small", value: "Small" },
      { label: "Medium", value: "Medium" },
      { label: "Big", value: "Big" },
    ];
    const Button_Size_options = [
      { label: "Small", value: "Small" },
      { label: "Large", value: "Large" },
    ];

    const Mobile_Location_options = [
      { label: "Select an option", value: "Select an option" },
      { label: "Bottom", value: "Bottom" },
      { label: "Top", value: "Top" },
    ];
    const Show_Cart_bar_options = [
      { label: "Select an option", value: "Select an option" },
      { label: "Always on display", value: "Always on display" },
      {
        label: "When user starts scrolling",
        value: "When user starts scrolling",
      },
      {
        label: "When user scrolls past the Add to cart button",
        value: "When user scrolls past the Add to cart button",
      },
    ];

    const Styling_options = [
      { label: "Select an option", value: "Select an option" },
      {
        label: "Automatic, copies the style of the ATC button",
        value: "Automatic, copies the style of the ATC button",
      },
      { label: "Custom", value: "Custom" },
    ];

    return (
      <div className="SettingsDataTab_container">
        <BlockStack gap="400">
          <InlineGrid columns={["oneThird", "twoThirds"]}>
            <Text variant="headingMd" as="h6">
              Settings for Desktop
            </Text>
            <Layout>
              <Layout.Section>
                <Card roundedAbove="sm">
                  <BlockStack gap="300">
                    <Box paddingBlockStart="200">
                      <div className="checkbox_section">
                        <BlockStack gap="400">
                          <Checkbox label="Show the Sticky Add to Cart bar on Desktop Devices." />
                             <Select
                               onFocus={() => handleFocus("field1")}
                            label="Desktop Location"
                            options={Location_options}
                            onChange={(e) =>
                                handleInputChange(e, "show_on_desktop")
                              }
                              value={formData.show_on_desktop}
                          />

                          <Select
                            label="Show the Sticky Add to Cart bar"
                            options={Cart_bar_options}
                            onChange={(e) =>
                                handleInputChange(e, "desktop_position")
                              }
                              value={formData.desktop_position}
                               
                          />

                          <Checkbox
                            label="Show Quantity Selector on Desktop"
                            
                          />

                          <Checkbox
                            label="Show the Variant Selector on Desktop"
                           
                          />

                          <Select
                            label="Sticky Bar Height"
                            options={Height_options}
                         
                          />

                          <Checkbox
                            label="Show Product Title on Desktop"
                            
                          />

                          <Select
                            label="Button Size"
                            options={Button_Size_options}
                           
                          />
                        </BlockStack>
                      </div>
                    </Box>
                  </BlockStack>
                </Card>
              </Layout.Section>
            </Layout>
          </InlineGrid>

          <InlineGrid columns={["oneThird", "twoThirds"]}>
            <Text variant="headingMd" as="h6">
              Settings for Mobile
            </Text>
            <Layout>
              <Layout.Section>
                <Card roundedAbove="sm">
                  <BlockStack gap="300">
                    <Box paddingBlockStart="200">
                      <div className="checkbox_section">
                        <BlockStack gap="400">
                          <Checkbox
                            label="Show the Sticky Add to Cart bar on Desktop Devices."
                            
                          />

                          <Select
                            label="Mobile Location"
                            options={Mobile_Location_options}
                          
                          />

                          <Select
                            label="Show the Sticky Add to Cart bar"
                            options={Show_Cart_bar_options}
                            
                          />

                          <Checkbox
                            label="Show Quantity Selector on Mobile"
                         
                          />

                          <Checkbox
                            label="Show the Variant Selector on Mobile"
                         
                          />
                        </BlockStack>
                      </div>
                    </Box>
                  </BlockStack>
                </Card>
              </Layout.Section>
            </Layout>
          </InlineGrid>

          <InlineGrid columns={["oneThird", "twoThirds"]}>
            <Text variant="headingMd" as="h6">
              Product Reviews integration
            </Text>
            <Layout>
              <Layout.Section>
                <Card roundedAbove="sm">
                  <BlockStack gap="300">
                    <Box paddingBlockStart="200">
                      <div className="checkbox_section">
                        <BlockStack gap="400">
                          <Checkbox
                            label="Show Product Reviews Stars"
                          
                            helpText="Show the stars from the Product Reviews module."
                          />
                        </BlockStack>
                      </div>
                    </Box>
                  </BlockStack>
                </Card>
              </Layout.Section>
            </Layout>
          </InlineGrid>

          <InlineGrid columns={["oneThird", "twoThirds"]}>
            <Text variant="headingMd" as="h6">
              Look and feel
            </Text>
            <Layout>
              <Layout.Section>
                <Card roundedAbove="sm">
                  <BlockStack gap="300">
                    <Box paddingBlockStart="200">
                      <div className="checkbox_section">
                        <BlockStack gap="400">
                          <div className="color_section">
                            <TextField
                              label="Background color"
                              type="text"
                              value={""}
                              onChange={""}
                              autoComplete="off"
                              connectedLeft={<input type="color" />}
                            />
                          </div>

                          <div className="color_section">
                            <TextField
                              label="Text color"
                              type="text"
                              value={""}
                              onChange={""}
                              autoComplete="off"
                              connectedLeft={<input type="color" />}
                            />
                          </div>

                          <Select
                            label="Styling of the sticky Add to Cart button"
                            options={Styling_options}
                           
                            helpText="Vitals can automatically adapt the styling of the Sticky Add to Cart button to match the look and feel of your main Add to Cart button from the product page. This is especially helpful when your theme changes the style of the Add to Cart button when a product is out of stock, the sticky Add to Cart button will adapt to the new styling."
                          />

                          <Checkbox
                            label="Show border shadow"
                           
                          />

                          <TextField
                            label={
                              <InlineStack>
                                Border Radius{" "}
                                <Tooltip
                                  active
                                  content={`This controls the border radius for the "Add to cart" button and the selectors.`}
                                >
                                  <Icon
                                    source={AlertCircleIcon}
                                    tone="base"
                                  ></Icon>
                                </Tooltip>
                              </InlineStack>
                            }
                            type="text"
                            value={""}
                            onChange={""}
                            autoComplete="off"
                          />

                          <div className="color_section">
                            <TextField
                              label={
                                <InlineStack>
                                  Selectors Border-color{" "}
                                  <Tooltip
                                    active
                                    content={`This controls the color of variants and quantity selectors.`}
                                  >
                                    <Icon
                                      source={AlertCircleIcon}
                                      tone="base"
                                    ></Icon>
                                  </Tooltip>
                                </InlineStack>
                              }
                              type="text"
                              value={""}
                              onChange={""}
                              autoComplete="off"
                              connectedLeft={<input type="color" />}
                            />
                          </div>
                          <div className="lower_checkbox">
                            <Checkbox
                              label={`Apply "Animated Add to Cart" effect`}
                            
                              helpText="If the Animated add to cart app is enabled in Vitals, you can apply the same effect to the Sticky add to cart button by checking this option."
                            />
                          </div>
                        </BlockStack>
                      </div>
                    </Box>
                  </BlockStack>
                </Card>
              </Layout.Section>
            </Layout>
          </InlineGrid>

          <InlineGrid columns={["oneThird", "twoThirds"]}>
            <Text variant="headingMd" as="h6"></Text>
            <Layout>
              <Layout.Section>
                <BlockStack gap="300">
                  <Box paddingBlockStart="200">
                    <CollapsibleExample />
                  </Box>
                </BlockStack>
              </Layout.Section>
            </Layout>
          </InlineGrid>

          <InlineGrid columns={["oneThird", "twoThirds"]}>
            <Text variant="headingMd" as="h6"></Text>
            <Layout>
              <Layout.Section>
                <BlockStack gap="300">
                  <Box paddingBlockStart="200">
                    <ModulefiltersCollapsibleExample />
                  </Box>
                </BlockStack>
              </Layout.Section>
            </Layout>
          </InlineGrid>

          <div className="lower_section">
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                <Card roundedAbove="sm">
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingSm">
                      Check our Help Center
                    </Text>
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingSm" fontWeight="medium">
                        If you need help with setting up the Scroll to Top
                        Button app, please check our exhaustive Help Center for
                        details.
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
                      <Text as="h3" variant="headingSm" fontWeight="medium">
                        We know how complex Vitals is - that's why{" "}
                        <Link href="#">we are available 24/7</Link> to support
                        you in setting it up.
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
          </div>
        </BlockStack>
      </div>
    );
  };

  const AnalyticsPaymentsTab = () => {
    return (
      <div className="AnalyticsPaymentsTab_container">
        <BlockStack gap="300">
          <InlineStack gap="300">
            <Button onClick={togglePopoverActive} icon={CalendarIcon}>
              <Text variant="headingSm" as="h6">
                May 24, 2024 - May 30, 2024
              </Text>
            </Button>
            <Text>compared to May 17, 2024 - May 23, 2024</Text>
          </InlineStack>
        </BlockStack>
      </div>
    );
  };
  function TabsInsideOfACardExample() {
    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
      (selectedTabIndex) => setSelected(selectedTabIndex),
      [],
    );

    const tabs = [
      {
        id: "Settings-customers-1",
        content: "Settings",
        accessibilityLabel: "Settings customers",
        panelID: "Settings-customers-content-1",
        component: <SettingsDataTab />,
        dummy: "",
      },
      {
        id: "Analytics-marketing-1",
        content: "Analytics",
        panelID: "Analytics-marketing-content-1",
        component: <AnalyticsPaymentsTab />,
        dummy: "",
      },
    ];

    return (
      <div className="tab_container">
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <Box>{tabs[selected].dummy}</Box>
          <div>{tabs[selected].component}</div>
        </Tabs>
      </div>
    );
  }

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
    <div className="Sticky_Add_to_Cart">
      <Page
        backAction={{ content: "Back", onAction: () => navigate("/app") }}
        title="Sticky Add to Cart"
        subtitle="Improve conversion rate by displaying a sticky add to cart bar when the visitors are scrolling down."
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
         <div className="TabsField">
            <BlockStack gap="200">
              <TabsInsideOfACardExample />
            </BlockStack>
          </div>
      
      </Page>
    </div>
  );
}
