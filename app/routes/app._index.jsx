import { useEffect } from "react";
import { json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
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
  InlineStack,
  LegacyStack,
  Icon,
  InlineGrid,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

import {
  StarIcon,
  MenuHorizontalIcon,
  ChartLineIcon,
} from "@shopify/polaris-icons";

import "./assets/style.css";
import { upsell, scroll, search,external, visitor,reviews, sticky } from "./assets";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
console.log(session,"session")
  let storeName = session.shop.split(".")[0];

  return { storeName };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();
  const variantId =
    responseJson.data.productCreate.product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
      mutation shopifyRemixTemplateUpdateVariant($input: ProductVariantInput!) {
        productVariantUpdate(input: $input) {
          productVariant {
            id
            price
            barcode
            createdAt
          }
        }
      }`,
    {
      variables: {
        input: {
          id: variantId,
          price: Math.random() * 100,
        },
      },
    },
  );
  const variantResponseJson = await variantResponse.json();

  return json({
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantUpdate.productVariant,
  });
};

export default function Index() {
  const nav = useNavigation();
  const { storeName } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const shopify = useAppBridge();

  const generateProduct = () => submit({}, { replace: true, method: "POST" });

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
                How is your experience with Vitals?
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
        <Box>
          <Text variant="bodySm" as="p">
            Last 7 Days
          </Text>
        </Box>

        <InlineGrid gap="400" columns={4}>
          <Card background="bg-surface-secondary">
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm" fontWeight="medium">
                Sales (assisted)
              </Text>
              <Text variant="headingLg" as="h5">
                0
              </Text>
            </BlockStack>
          </Card>
          <Card background="bg-surface-secondary">
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm" fontWeight="medium">
                Orders (assisted)
              </Text>
              <Text variant="headingLg" as="h5">
                0
              </Text>
            </BlockStack>
          </Card>
          <Card background="bg-surface-secondary">
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm" fontWeight="medium">
                Active apps
              </Text>
              <Text variant="headingLg" as="h5">
                0
              </Text>
            </BlockStack>
          </Card>
          <Card background="bg-surface-secondary">
            <BlockStack gap="200">
              <Text as="h3" variant="headingSm" fontWeight="medium">
                Captured emails
              </Text>
              <Text variant="headingLg" as="h5">
                0
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
                  url="https://help.shopify.com/manual"
                >
                  Visitor Replays
                </Link>
              </InlineGrid>
              <div className="vitals_app_body">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="20">
                      <Text as="p" fontWeight="medium" tone="subdued">
                        Recordings
                      </Text>
                      <Text variant="heading2xl" as="h3">
                        0
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
                        Live visitors
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
                        Completed orders
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
                        Added to cart
                      </Link>
                      <Link
                        className="app_upsell_text"
                        removeUnderline
                        monochrome
                        url="https://help.shopify.com/manual"
                      >
                        0
                      </Link>
                    </InlineStack>
                  </BlockStack>
                </InlineStack>
              </div>
            </BlockStack>
          </Card>
        </div>
        <div className="vitals_app_card">
          <Card roundedAbove="sm">
            <BlockStack gap="200">
              <InlineGrid columns="1fr auto">
                <Link
                  removeUnderline
                  monochrome
                  url="https://help.shopify.com/manual"
                >
                  Upsell Builder
                </Link>
                <Button
                  onClick={() => {}}
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
                <InlineStack  blockAlign="center" rows="5">
                  <div className="all_in_apps_Card">
                  <Link
                    monochrome
                    removeUnderline
                    url="/app/cart_favicon"
                  >
                    <InlineStack    gap="200" blockAlign="center">
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
                  <Link monochrome removeUnderline url="/app/scroll_to_top">
                    <InlineStack gap="200"  blockAlign="center">
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
                  <Link monochrome removeUnderline url="/app/sticky_add_cart">
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
                  <Link
                    monochrome
                    removeUnderline
                    url="/app/auto_external_links"
                  >
                    <InlineStack align="space-between"   gap="200" blockAlign="center">
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
                  <Link
                    monochrome
                    removeUnderline
                    url=""
                  >
                    <InlineStack align="space-between"  gap="200"  blockAlign="center">
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
                  <Link
                    monochrome
                    removeUnderline
                    url="https://help.shopify.com/manual"
                  >
                    <InlineStack align="space-between"   gap="200" blockAlign="center">
                      <div className="app_icon">
                        <img src={reviews} style={{ width: "100%" }} />
                      </div>
                      <div className="app_name">
                        <Text variant="bodyMd" as="h3">
                        Product review
                        </Text>
                      </div>
                    </InlineStack>
                  </Link>
                  </div>
               
                  <div className="all_in_apps_Card">
                  <Link
                    monochrome
                    removeUnderline
                    url="https://help.shopify.com/manual"
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <div className="app_icon">
                        <img src={visitor} style={{ width: "100%" }} />
                      </div>
                      <div className="app_name">
                        <Text variant="bodyMd" as="h3">
                          Visitor Replays
                        </Text>
                      </div>
                    </InlineStack>
                  </Link>
                  </div>
                  <div className="all_in_apps_Card">
                  <Link
                    monochrome
                    removeUnderline
                    url="https://help.shopify.com/manual"
                  >
                    <InlineStack align="space-between"  gap="200"  blockAlign="center">
                      <div className="app_icon">
                        <img src={upsell} style={{ width: "100%" }} />
                      </div>
                      <div className="app_name">
                        <Text variant="bodyMd" as="h3">
                          Cookies Banner
                        </Text>
                      </div>
                    </InlineStack>
                  </Link>
                  </div>
                  <div className="all_in_apps_Card">
                  <Link monochrome removeUnderline url="/app/sticky_add_cart">
                    <InlineStack align="space-between"  gap="200"  blockAlign="center">
                      <div className="app_icon">
                        <img src={upsell} style={{ width: "100%" }} />
                      </div>
                      <div className="app_name">
                        <Text variant="bodyMd" as="h3">
                        cart notice
                        </Text>
                      </div>
                    </InlineStack>
                  </Link>
                  </div>
                  <div className="all_in_apps_Card">
                  <Link monochrome removeUnderline url="/app/sticky_add_cart">
                    <InlineStack align="space-between"  gap="200"  blockAlign="center">
                      <div className="app_icon">
                        <img src={upsell} style={{ width: "100%" }} />
                      </div>
                      <div className="app_name">
                        <Text variant="bodyMd" as="h3">
                        Inactive tab massage
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
