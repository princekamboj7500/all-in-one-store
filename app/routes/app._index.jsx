import { useEffect, useState } from "react";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  Banner,
  InlineStack,
  LegacyStack,
  Icon,
  InlineGrid,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

import {
  StarIcon,
  MenuHorizontalIcon,
  ChartLineIcon,
} from "@shopify/polaris-icons";

import "./assets/style.css";
import {
  upsell,
  scroll,
  search,
  external,
  visitor,
  reviews,
  sticky,
} from "./assets";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const response = await admin.graphql(`query {
    currentAppInstallation {
      id
      metafields(first: 8) {
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
let activeApp =0;
if(metafielData){
  const trueAppStatuses = metafielData.filter(item => {
    try {
      const parsedValue = JSON.parse(item.node.value);
      return parsedValue.app_status === true;
    } catch (e) {
      return false;
    }
  });
  activeApp = trueAppStatuses.length;
}




  let storeName = session.shop.split(".")[0];
  const getThemes = await admin.rest.resources.Theme.all({
    session: session,
  });

  var currentTheme = getThemes?.data?.find(
    (themes) => themes.role === "main",
  )?.id;


  const checkStatus = await admin.rest.resources.Asset.all({
    session: session,
    theme_id: currentTheme,
    asset: { key: "config/settings_data.json" },
  });

  function findAppStatus(data) {
    for (const key in data) {
      if (data[key].type && data[key].type.includes("all-in-one-store")) {
        return !data[key].disabled;
      }
    }
    return null;
  }

  const data = JSON.parse(checkStatus.data[0].value);
  const themeBlock = data.current.blocks;
  const status = findAppStatus(themeBlock);


  return { storeName, status, currentTheme, activeApp };
};

export default function Index() {
  const nav = useNavigate();
  const { storeName, status, currentTheme, activeApp } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const [isBannerVisible, setIsBannerVisible] = useState(status);
  const [isDismissed, setIsDismissed] = useState(false);

  const activateApp = () => {

    window.open(
      "https://admin.shopify.com/store/" +
        storeName.replace(".myshopify.com", "") +
        "/themes/current/editor?context=apps&activateAppId=8177ef1b-fb1c-4ebb-a686-d743f22ea714/all-in-one-store",
      "__blank",
    );
  };
  const handleDismiss = () => {
    setIsDismissed(true);
  };
  useEffect(()=>{
    shopify.loading(false);
  },[])
  const handleClick = () => {
     shopify.loading(true);
  };
  const handleCreate = () =>{
    nav("/app/create/upsell_builder/all")
    shopify.loading(true);
  }
  return (
    <Page>
      <BlockStack gap="500">
        <Text variant="headingLg" as="h5">
          {`Hello, ${storeName}!`}
        </Text>
        <Card>
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="200">
              <Text variant="headingSm" as="h6">
                How is your experience with All-In-One Store?
              </Text>
              <Text as="p" tone="subdued">
                Rate us by clicking on the stars on the right.
              </Text>
            </BlockStack>
            <InlineStack align="space-between" blockAlign="center">
              <Icon source={StarIcon} tone="base" />
              <Icon source={StarIcon} tone="base" />
              <Icon source={StarIcon} tone="base" />
              <Icon source={StarIcon} tone="base" />
              <Icon source={StarIcon} tone="base" />

              <Button variant="tertiary" icon={MenuHorizontalIcon} />
            </InlineStack>
          </InlineStack>
        </Card>

        {(isBannerVisible === false || isBannerVisible === null) && !isDismissed  && (
          <Banner
            title="Please Enable the app"
            action={{
              content: "Activate the app",
              variant: "primary",
              onAction: activateApp,
            }}
           tone="warning"
            onDismiss={handleDismiss}
          >
            <p>Activate All-in-one Store  widget in your theme</p>
          </Banner>
        )}
        <Box>
          <Text variant="bodySm" as="p">
            Last 7 Days
          </Text>
        </Box>

        <InlineGrid gap="400" columns={1}>
          
        
          <Card background="bg-surface-secondary">
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm" fontWeight="medium">
                Active apps
              </Text>
              <Text variant="headingLg" as="h5">
             {activeApp}
              </Text>
            </BlockStack>
          </Card>
      
        </InlineGrid>
       
        <div className="vitals_app_card">
          <Card roundedAbove="sm">
            <BlockStack gap="200">
              <InlineGrid columns="1fr auto">
                <Link
                  removeUnderline
                  monochrome
                  url="/app/upsell_builder"
                >
                  Upsell Builder
                </Link>
                <Button
                  onClick={handleCreate}
                  accessibilityLabel="Create new offer"
                >
                  Create new offer
                </Button>
              </InlineGrid>
              <div className="vitals_app_body">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="20">
                      <Text as="p" fontWeight="medium" tone="subdued">
                        Revenue
                      </Text>
                      <Text variant="heading2xl" as="h3">
                        $0
                      </Text>
                      <Text variant="bodySm" as="p">
                        Last 7 Days
                      </Text>
                    </BlockStack>
                    <Icon source={ChartLineIcon} tone="base" />
                  </InlineStack>

                  <BlockStack gap="200">
                    <InlineStack align="space-between" blockAlign="center">
                      <Link
                        removeUnderline
                        className="app_upsell"
                        monochrome
                        url="https://help.shopify.com/manual"
                      >
                        Viewed Offers
                      </Link>
                      <Link
                        removeUnderline
                        className="app_upsell_text"
                        monochrome
                        url="https://help.shopify.com/manual"
                      >
                        0
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between" blockAlign="center">
                      <Link
                        removeUnderline
                        className="app_upsell"
                        monochrome
                        url="https://help.shopify.com/manual"
                      >
                        Accepted Offers
                      </Link>
                      <Link
                        removeUnderline
                        className="app_upsell_text"
                        monochrome
                        url="https://help.shopify.com/manual"
                      >
                        0
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between" blockAlign="center">
                      <Link
                        removeUnderline
                        monochrome
                        url="https://help.shopify.com/manual"
                      >
                        Click-Throgh Rate(CTR)
                      </Link>
                      <Link
                        className="app_upsell_text"
                        removeUnderline
                        monochrome
                        url="https://help.shopify.com/manual"
                      >
                        0%
                      </Link>
                    </InlineStack>
                  </BlockStack>
                </InlineStack>
              </div>
            </BlockStack>
          </Card>
        </div>
        <div className="apps_list">
          <Card>
            <BlockStack gap="200">
              <Text variant="headingMd" as="h6">
                My Apps
              </Text>
              <div className="apps_name">
                <InlineStack blockAlign="center" rows="5">
                  <div className="all_in_apps_Card">
                    <Link monochrome  onClick= {handleClick} removeUnderline url="/app/cart_favicon">
                      <InlineStack gap="200" blockAlign="center">
                        <div className="app_icon">
                          <img src={upsell} style={{ width: "100%" }} />
                        </div>
                        <div className="app_name">
                          <Text variant="bodyMd" as="h3">
                            Favicon Cart Count
                          </Text>
                        </div>
                      </InlineStack>
                    </Link>
                  </div>
                  <div className="all_in_apps_Card">
                    <Link   onClick= {handleClick} monochrome removeUnderline url="/app/scroll_to_top">
                      <InlineStack gap="200" blockAlign="center">
                        <div className="app_icon">
                          <img src={scroll} style={{ width: "100%" }} />
                        </div>
                        <div className="app_name">
                          <Text variant="bodyMd" as="h3">
                            Scroll to Top Button
                          </Text>
                        </div>
                      </InlineStack>
                    </Link>
                  </div>
                  <div className="all_in_apps_Card">
                    <Link   onClick= {handleClick} monochrome removeUnderline url="/app/sticky_add_cart">
                      <InlineStack gap="200" blockAlign="center">
                        <div className="app_icon">
                          <img src={sticky} style={{ width: "100%" }} />
                        </div>
                        <div className="app_name">
                          <Text variant="bodyMd" as="h3">
                            Sticky Add to Cart
                          </Text>
                        </div>
                      </InlineStack>
                    </Link>
                  </div>

                  <div className="all_in_apps_Card">
                    <Link  onClick= {handleClick}
                      monochrome
                      removeUnderline
                      url="/app/auto_external_links"
                    >
                      <InlineStack
                        align="space-between"
                        gap="200"
                        blockAlign="center"
                      >
                        <div className="app_icon">
                          <img src={external} style={{ width: "100%" }} />
                        </div>
                        <div className="app_name">
                          <Text variant="bodyMd" as="h3">
                            Auto external links
                          </Text>
                        </div>
                      </InlineStack>
                    </Link>
                  </div>
                  <div className="all_in_apps_Card">
                    <Link monochrome  onClick= {handleClick} removeUnderline url="/app/instant_search">
                      <InlineStack
                        align="space-between"
                        gap="200"
                        blockAlign="center"
                      >
                        <div className="app_icon">
                          <img src={search} style={{ width: "100%" }} />
                        </div>
                        <div className="app_name">
                          <Text variant="bodyMd" as="h3">
                            Instant Search
                          </Text>
                        </div>
                      </InlineStack>
                    </Link>
                  </div>
                  <div className="all_in_apps_Card">
                    <Link  onClick= {handleClick}
                      monochrome
                      removeUnderline
                      url="/app/inactive_tab_message"
                    >
                      <InlineStack
                        align="space-between"
                        gap="200"
                        blockAlign="center"
                      >
                        <div className="app_icon">
                          <img src={reviews} style={{ width: "100%" }} />
                        </div>
                        <div className="app_name">
                          <Text variant="bodyMd" as="h3">
                            Inactive Tab Message
                          </Text>
                        </div>
                      </InlineStack>
                    </Link>
                  </div>

                  <div className="all_in_apps_Card">
                    <Link monochrome   onClick= {handleClick} removeUnderline url="/app/cart_notice">
                      <InlineStack align="space-between" blockAlign="center">
                        <div className="app_icon">
                          <img src={visitor} style={{ width: "100%" }} />
                        </div>
                        <div className="app_name">
                          <Text variant="bodyMd" as="h3">
                            Cart Notice
                          </Text>
                        </div>
                      </InlineStack>
                    </Link>
                  </div>
                  <div className="all_in_apps_Card">
                    <Link  onClick= {handleClick}
                      monochrome
                      removeUnderline
                      url="/app/hide_dynamic_checkout_buttons"
                    >
                      <InlineStack
                        align="space-between"
                        gap="200"
                        blockAlign="center"
                      >
                        <div className="app_icon">
                          <img src={upsell} style={{ width: "100%" }} />
                        </div>
                        <div className="app_name">
                          <Text variant="bodyMd" as="h3">
                            Hide Dynamic Checkout Button
                          </Text>
                        </div>
                      </InlineStack>
                    </Link>
                  </div>
                  <div className="all_in_apps_Card">
                    <Link   onClick= {handleClick} monochrome removeUnderline url="/app/cookie_banner">
                      <InlineStack
                        align="space-between"
                        gap="200"
                        blockAlign="center"
                      >
                        <div className="app_icon">
                          <img src={upsell} style={{ width: "100%" }} />
                        </div>
                        <div className="app_name">
                          <Text variant="bodyMd" as="h3">
                            Cookie Banner
                          </Text>
                        </div>
                      </InlineStack>
                    </Link>
                  </div>
                  <div className="all_in_apps_Card">
                    <Link   onClick= {handleClick} monochrome removeUnderline url="/app/product_reviews">
                      <InlineStack
                        align="space-between"
                        gap="200"
                        blockAlign="center"
                      >
                        <div className="app_icon">
                          <img src={upsell} style={{ width: "100%" }} />
                        </div>
                        <div className="app_name">
                          <Text variant="bodyMd" as="h3">
                            Product Reviews
                          </Text>
                        </div>
                      </InlineStack>
                    </Link>
                  </div>
                
                  <div className="all_in_apps_Card">
                    <Link  onClick= {handleClick}  monochrome removeUnderline url="/app/upsell_builder">
                      <InlineStack
                        align="space-between"
                        gap="200"
                        blockAlign="center"
                      >
                        <div className="app_icon">
                          <img src={upsell} style={{ width: "100%" }} />
                        </div>
                        <div className="app_name">
                          <Text variant="bodyMd" as="h3">
                            Upsell Builder
                          </Text>
                        </div>
                      </InlineStack>
                    </Link>
                  </div>
                </InlineStack>
              </div>
            </BlockStack>
          </Card>
        </div>
      </BlockStack>
      <br></br>
    </Page>
  );
}
