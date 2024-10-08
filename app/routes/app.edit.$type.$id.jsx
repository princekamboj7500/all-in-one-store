import React, { useCallback, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Card,
  Text,
  Badge,
  Page,
  Layout,
  Icon,
  Link,
  Frame,
  ContextualSaveBar,
  Button,
  InlineStack,
  TextField,
  InlineGrid,
  BlockStack,
  Tooltip,
  Box,
  ButtonGroup,
  Checkbox,
  Toast,
  Spinner,
  Collapsible,
  Select,
  RangeSlider,
  Grid,
  RadioButton,
  PageActions,
  Divider,
  InlineError,
  Thumbnail,
  Modal,
} from "@shopify/polaris";
import db from "../db.server";

import { authenticate } from "../shopify.server";
import "./assets/style.css";
import {
  CheckIcon,
  PlusCircleIcon,
  SearchIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
  ImageIcon,
} from "@shopify/polaris-icons";
import { useTranslation } from "react-i18next";
import DiscardModal from "./components/DiscardModal";
import { product, bogoproduct, bogoproduct2 } from "./assets";
export const loader = async ({ request, params }) => {
  const upsellId = params.id;

  const upsellType = params.type;
  const { session, admin } = await authenticate.admin(request);
  const store = session.shop;

  const getData = await db.UpsellBuilder.findFirst({
    where: {
      id: upsellId,
      store: store,
    },
    select: {
      discount_type: true,
      rules: true,
      offer_status: true,
      internal_name: true,
      cart_label: true,
      created_at: true,
    },
  });

  const buyIds = getData.rules.customer_buy.products;
  const getIds = getData.rules.customer_get.products;
  const buyCollectionsIds = getData.rules.customer_buy.collections;
  const ids = buyCollectionsIds?.map((url) => url.split("/").pop());

  const query = ids?.map((id) => `id:${id}`).join(" OR ");

  const getCollectionsIds = getData.rules.customer_get.collections;
  const getCollIds = getCollectionsIds?.map((url) => url.split("/").pop());
  const getquery = getCollIds?.map((id) => `id:${id}`).join(" OR ");
  let buyCustomerProducts = [],
    getCustomerProducts = [],
    buyCustomerCollections = [],
    getCustomerCollections = [];
  if (buyIds.length > 0) {
    const query = `
    query getProductsByIds($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          featuredImage {
          originalSrc
          }
        }
      }
    }
  `;
    const response = await admin.graphql(query, {
      variables: {
        ids: buyIds,
      },
    });

    const data = await response.json();
    const buyProductsIds = data.data.nodes;
    buyCustomerProducts = buyProductsIds.map((products) => {
      const { id, title, featuredImage } = products;

      return {
        productId: id,
        productTitle: title,
        productImage: featuredImage?.originalSrc,
      };
    });
  }
  if (getIds.length > 0) {
    const query = `
    query getProductsByIds($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          featuredImage {
          originalSrc
          }
        }
      }
    }
  `;
    const response = await admin.graphql(query, {
      variables: {
        ids: getIds,
      },
    });

    const data = await response.json();
    const getProductIds = data.data.nodes;
    getCustomerProducts = getProductIds.map((product) => {
      const { id, title, featuredImage } = product;

      return {
        productId: id,
        productTitle: title,
        productImage: featuredImage?.originalSrc,
      };
    });
  }
  if (buyCollectionsIds.length > 0) {
    const response = await admin.graphql(
      `#graphql
      query {
        collections(first:250, query: "${query}") {
          edges {
            node {
              id
              title
              handle
              updatedAt
              sortOrder
              image{
              url
              }
            }
          }
        }
      }`,
    );
    const data = await response.json();
    const collections = data.data.collections.edges;

    buyCustomerCollections = collections.map(
      ({ node: { id, title, image } }) => ({
        productId: id,
        productTitle: title,
        productImage: image?.url,
      }),
    );
  }
  if (getCollectionsIds.length > 0) {
    const response = await admin.graphql(
      `#graphql
      query {
        collections(first:250, query: "${getquery}") {
          edges {
            node {
              id
              title
              handle
              updatedAt
              sortOrder
              image{
              url
              }
            }
          }
        }
      }`,
    );
    const data = await response.json();
    const collections = data.data.collections.edges;

    getCustomerCollections = collections.map(
      ({ node: { id, title, image } }) => ({
        productId: id,
        productTitle: title,
        productImage: image?.url,
      }),
    );
  }

  return {
    getData,
    upsellType,
    upsellId,
    getCustomerProducts,
    buyCustomerProducts,
    buyCustomerCollections,
    getCustomerCollections,
  };
};

export function Discount({
  handleFocus,

  toggleModal,
  isFirstButtonActive,
  handleSecondButtonClick,
  handleFirstButtonClick,
  leftPreviewLayout,
  handleChange,
  formData,

  handleContinueClick,
}) {
  let { t } = useTranslation();
  return (

    <>
      <div className="aios_layout_spacer">
        <Layout>
          <Layout.Section variant="oneHalf">
            <Layout>
              <Layout.Section>
                <Card roundedAbove="sm">
                  <BlockStack gap="300">
                    <Text variant="headingSm" as="h6">
                   {t('translation.title')}
                    </Text>
                    <Box paddingBlockStart="200">
                      <BlockStack gap="400">
                        <InlineStack gap="200">
                          <ButtonGroup variant="segmented">
                            <Button
                              pressed={isFirstButtonActive}
                              onClick={() => {
                                handleFirstButtonClick("discount");
                              }}
                            >
                               {t('translation.Percent')}
                            </Button>
                            <Button
                              pressed={!isFirstButtonActive}
                              onClick={handleSecondButtonClick}
                            >
                               {t('translation.FixedAmount')}
                            </Button>
                          </ButtonGroup>
                          <TextField
                            type="number"
                            value={formData.rules.discount.discount_amount}
                            suffix={formData.rules.discount.discount_symbol}
                            onChange={(e) => {
                              handleFocus("discount_amount");
                              handleChange(e, "discount", "discount_amount");
                            }}
                            placeholder="Min Value : 0"
                            min={0}
                          />
                        </InlineStack>
                      </BlockStack>
                    </Box>
                  </BlockStack>
                </Card>
              </Layout.Section>
            </Layout>
          </Layout.Section>
          <Layout.Section variant="oneHalf">{leftPreviewLayout}</Layout.Section>
        </Layout>
      </div>
      <PageActions
        primaryAction={{
          content: t('translation.Continue'),
          onClick: handleContinueClick,
        }}
        secondaryActions={
          <Button onClick={toggleModal} variant="primary" tone="critical">
            {t('translation.Delete')}
          </Button>
        }
      />
    </>
  );
}

export function ReviewsLayout({
  handleFocus,
  toggleModal,
  handleTab,
  handleSave,
  getCollections,
  buyCollections,
  getProduct,
  buyProduct,
  handleChange,
  formData,
}) {
  let { t } = useTranslation();
  const getCustomerBuysText = () => {
    const { chosen_type, qty } = formData?.rules?.customer_buy || {};
    const eligibleProductsCount = buyProduct.length;

    return chosen_type === "specific"
      ? `${qty || 0} quantity of ${eligibleProductsCount} eligible products`
      : "any product";
  };
  const getCustomerGetsText = () => {
    const { chosen_type, qty } = formData?.rules?.customer_get || {};
    const eligibleProductsCount = getProduct.length;

    return chosen_type === "specific"
      ? `${qty || 0} quantity of ${eligibleProductsCount} eligible products`
      : "any product";
  };

  const options = [
    { label: "Draft", value: "Draft" },
    { label: "Active", value: "Active" },
  ];
  return (
    <div className="aios_layout_spacer">
      <Layout>
        <Layout.Section>
          <Layout>
            <Layout.Section>
              <Layout>
                <Layout.Section variant="oneThird">
                  <Card>
                    <InlineStack wrap={false} align="space-between">
                      <Text variant="headingSm" as="h6">
                         {t('translation.Products')}
                      </Text>
                      <div>
                        <Button
                          variant="plain"
                          onClick={() => handleTab(1)}
                          icon={EditIcon}
                        />
                      </div>
                    </InlineStack>
                    <Text variant="bodySm" as="p">
                    {t('translation.Customer')} {getCustomerBuysText()}
                    </Text>
                    {t('translation.Customergets')} {getCustomerGetsText()}
                  </Card>
                </Layout.Section>
                <Layout.Section>
                  <Card>
                    <InlineStack wrap={false} align="space-between">
                      <Text variant="headingSm" as="h6">
                      {t('translation.Discountdetails')}
                      </Text>
                      <div>
                        <Button
                          variant="plain"
                          onClick={() => handleTab(2)}
                          icon={EditIcon}
                        />
                      </div>
                    </InlineStack>
                    {formData?.rules?.discount?.discount_amount}
                    {formData?.rules?.discount?.discount_symbol} {t('translation.Discount')}
                  </Card>
                </Layout.Section>
                <Layout.Section>
                  <Card>
                    <InlineStack wrap={false} align="space-between">
                      <Text variant="headingSm" as="h6">
                         {t('translation.Placements')}
                      </Text>
                      <div>
                        <Button
                          variant="plain"
                          onClick={() => handleTab(3)}
                          icon={EditIcon}
                        />
                      </div>
                    </InlineStack>
                    <Box
                      background="bg-surface"
                      borderColor="border"
                      borderWidth="025"
                      borderRadius="100"
                    >
                      <a>
                        <div className="aios_placements_reviews">
                          <BlockStack gap="500">
                            <InlineStack wrap={false} align="space-between">
                              <Text variant="bodyMd" as="p">
                              {t('translation.BOGO')}
                              </Text>
                              <div>
                                {formData?.rules?.product_page.status ==
                                "Active" ? (
                                  <Badge tone="success">{t('translation.Active')}</Badge>
                                ) : (
                                  <Badge tone="info">{t('translation.Inactive')}</Badge>
                                )}
                              </div>
                            </InlineStack>
                          </BlockStack>
                        </div>
                      </a>
                    </Box>
                    <Box
                      background="bg-surface"
                      borderColor="border"
                      borderWidth="025"
                      borderRadius="100"
                    >
                      <a>
                        <div className="aios_placements_reviews">
                          <BlockStack gap="500">
                            <InlineStack wrap={false} align="space-between">
                              <Text variant="bodyMd" as="p">
                              {t('translation.subs')}
                              </Text>
                              <div>
                                {formData?.rules?.cart_page.status ==
                                "Active" ? (
                                  <Badge tone="success">{t('translation.Active')}</Badge>
                                ) : (
                                  <Badge>{t('translation.Inactive')}</Badge>
                                )}
                              </div>
                            </InlineStack>
                          </BlockStack>
                        </div>
                      </a>
                    </Box>
                   
                  </Card>
                </Layout.Section>
              </Layout>
            </Layout.Section>
          </Layout>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Layout>
            <Layout.Section>
              <Card>
                <Text variant="headingMd" as="h6">
                {t('translation.Offerstatus')}
                </Text>
                <Select
                  options={options}
                  value={formData.offer_status}
                  onChange={(value) => {
                    handleFocus("offer_status");
                    handleChange(value, "offer_status");
                  }}
                />
              </Card>
            </Layout.Section>
            <Layout.Section variant="oneThird">
              <Card>
                <Text variant="headingMd" as="h6">
                {t('translation.Internalname')}
                </Text>
                <TextField
                  onChange={(e) => {
                    handleFocus("internal_name");
                    handleChange(e, "internal_name");
                  }}
                  value={formData.internal_name}
                  autoComplete="off"
                />
              </Card>
            </Layout.Section>
            <Layout.Section variant="oneThird">
              <Card>
                <Text variant="headingMd" as="h6">
                {t('translation.CartLabel')}
                </Text>
                <TextField
                  onChange={(e) => {
                    handleFocus("cart_label");
                    handleChange(e, "cart_label");
                  }}
                  value={formData.cart_label}
                  helpText={t('translation.descritpion')}
                  autoComplete="off"
                />
              </Card>
            </Layout.Section>
          </Layout>
        </Layout.Section>
      </Layout>
      <PageActions
       secondaryActions={
        <Button onClick={toggleModal} variant="primary" tone="critical">
           {t('translation.Delete')}
        </Button>
      }
      />
    </div>
  );
}

export function BogoProducts({
  toggleModal,
  getCollections,
  handleFocus,
  buyCollections,
  getProduct,
  buyProduct,
  selectProduct,
  selectCollection,
  handleContinueClick,
  leftPreviewLayout,
  handleDelete,
  handleChange,
  formData,
  handleCollectionDelete,
}) {
  let { t } = useTranslation();
  const handleInputChangeCustomerProduct = () => {
    selectProduct("customer_buy");
  };
  const handleInputChangeCustomerCollection = () => {
    selectCollection("customer_buy");
  };
  const handleInputChangeCustomerGet = () => {
    selectProduct("customer_get");
  };
  const handleInputChangeCustomerColl = () => {
    selectCollection("customer_get");
  };

  return (
    <>
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <div style={{ padding: "10px" }} className="product-review">
            <Layout.Section>
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h6" fontWeight="semibold">
                  {t('translation.Customer')}
                  </Text>
                  <RadioButton
                    label={t('translation.Anyproduct')}
                    id="any-products-slotA"
                    name="products-slotA"
                    checked={formData.rules.customer_buy.chosen_type === "any"}
                    onChange={(e) => {
                      handleFocus("any");
                      handleChange("any", "customer_buy", "chosen_type");
                    }}
                  />

                  <RadioButton
                    label={t('translation.specific')}
                    id="product-collection-slotA"
                    name="products-slotA"
                    checked={
                      formData.rules.customer_buy.chosen_type === "specific"
                    }
                    onChange={(e) => {
                      handleFocus("specific");
                      handleChange("specific", "customer_buy", "chosen_type");
                    }}
                  />

                  {formData.rules.customer_buy.chosen_type === "specific" ? (
                    <>
                      <InlineStack wrap={false} gap="200">
                        <div style={{ width: "100%" }}>
                          <TextField
                            placeholder= {t('translation.searchproduct')}
                            type="text"
                            onChange={handleInputChangeCustomerProduct}
                            prefix={<Icon source={SearchIcon} tone="base" />}
                            autoComplete="off"
                          />
                        </div>
                        <Button onClick={() => selectProduct("customer_buy")}>
                        {t('translation.Browse')}
                        </Button>
                      </InlineStack>
                      <InlineStack wrap={false} gap="200">
                        <div style={{ width: "100%" }}>
                          <TextField
                            placeholder= {t('translation.SearchCollections')}
                            type="text"
                            onChange={handleInputChangeCustomerCollection}
                            prefix={<Icon source={SearchIcon} tone="base" />}
                            autoComplete="off"
                          />
                        </div>
                        <Button
                          onClick={() => selectCollection("customer_buy")}
                        >
                          {t('translation.Browse')}
                        </Button>
                      </InlineStack>
                    </>
                  ) : (
                    ""
                  )}

                  <TextField
                    label={t('translation.Quantity')}
                    type="number"
                    value={formData.rules.customer_buy.qty}
                    autoComplete="off"
                    onChange={(e) => {
                      handleFocus("qty");
                      handleChange(e, "customer_buy", "qty");
                    }}
                  />
                  {formData.rules.customer_buy.chosen_type === "specific" && (
                    <>
                      {buyProduct.length === 0 &&
                      buyCollections.length === 0 ? (
                        <InlineError
                          message={t('translation.aproductsdes')}
                          fieldID="myFieldID"
                        />
                      ) : (
                        <>
                          {buyProduct.length > 0 && (
                            <BlockStack gap="200">
                              <Text as="p" fontWeight="bold">
                              {t('translation.Youselected')} {buyProduct.length} {t('translation.product')}
                                {buyProduct.length > 1 ? "s" : ""}
                              </Text>
                              {buyProduct.length > 0 &&
                                buyProduct.map((item, index) => (
                                  <div
                                    className="upsell_products_bundles_list"
                                    key={index}
                                  >
                                    <Box>
                                      <InlineStack
                                        wrap={false}
                                        align="space-between"
                                        blockAlign="center"
                                      >
                                        <Box padding="200">
                                          <InlineStack
                                            align="center"
                                            blockAlign="center"
                                            gap="200"
                                          >
                                            {item.productImage ? (
                                              <Thumbnail
                                                source={item.productImage}
                                                alt={item.productTitle}
                                              />
                                            ) : (
                                              <Icon
                                                source={ImageIcon}
                                                color="base"
                                                accessibilityLabel={t('translation.Placeholder')}
                                              />
                                            )}
                                            <Text variant="bodySm" as="p">
                                              {item.productTitle}
                                            </Text>
                                          </InlineStack>
                                        </Box>
                                        <Box padding="200">
                                          <Button
                                            icon={DeleteIcon}
                                            onClick={() =>
                                              handleDelete(
                                                index,
                                                "customer_buy",
                                              )
                                            }
                                            accessibilityLabel={t('translation.Deleteproduct')}
                                          />
                                        </Box>
                                      </InlineStack>
                                    </Box>
                                  </div>
                                ))}
                            </BlockStack>
                          )}
                          {buyCollections.length > 0 && (
                            <BlockStack gap="200">
                              <Text as="p" fontWeight="bold">
                              {t('translation.Youselected')} {buyCollections.length}{" "}
                                collection
                                {buyCollections.length > 1 ? "s" : ""}
                              </Text>
                              {buyCollections.map((item, index) => (
                                <div
                                  className="upsell_products_bundles_list"
                                  key={index}
                                >
                                  <Box>
                                    <InlineStack
                                      wrap={false}
                                      align="space-between"
                                      blockAlign="center"
                                    >
                                      <Box padding="200">
                                        <InlineStack
                                          align="center"
                                          blockAlign="center"
                                          gap="200"
                                        >
                                          {item.productImage ? (
                                            <Thumbnail
                                              source={item.productImage}
                                              alt={item.productTitle}
                                            />
                                          ) : (
                                            <Icon
                                              source={ImageIcon}
                                              color="base"
                                              accessibilityLabel={t('translation.Placeholder')}
                                            />
                                          )}
                                          <Text variant="bodySm" as="p">
                                            {item.productTitle}
                                          </Text>
                                        </InlineStack>
                                      </Box>
                                      <Box padding="200">
                                        <Button
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleCollectionDelete(
                                              index,
                                              "customer_buy",
                                            )
                                          }
                                          accessibilityLabel={t('translation.Deletecollection')}
                                        />
                                      </Box>
                                    </InlineStack>
                                  </Box>
                                </div>
                              ))}
                            </BlockStack>
                          )}
                        </>
                      )}
                    </>
                  )}
                </BlockStack>
              </Card>
            </Layout.Section>
            <Layout.Section>
              <Card>
                <BlockStack gap={300}>
                  <Text variant="headingMd" as="h6" fontWeight="semibold">
                  {t('translation.Customergets')}
                  </Text>
                  <BlockStack>
                    <RadioButton
                      label={t('translation.Anyproduct')}
                      id="any-products-slotB"
                      name="products-slotB"
                      checked={
                        formData.rules.customer_get.chosen_type === "any"
                      }
                      onChange={(e) => {
                        handleFocus("any");
                        handleChange("any", "customer_get", "chosen_type");
                      }}
                    />
                    <RadioButton
                      label={t('translation.specific')}
                      id="same-collection-slotB"
                      name="products-slotB"
                      checked={
                        formData.rules.customer_get.chosen_type === "specific"
                      }
                      onChange={(e) => {
                        handleFocus("specific");
                        handleChange("specific", "customer_get", "chosen_type");
                      }}
                    />
                    {formData.rules.customer_get.chosen_type === "specific" ? (
                      <>
                        <BlockStack gap="200">
                          <InlineStack wrap={false} gap="200">
                            <div style={{ width: "100%" }}>
                              <TextField
                                placeholder={t('translation.SearchsCollections')}
                                type="text"
                                onChange={handleInputChangeCustomerGet}
                                prefix={
                                  <Icon source={SearchIcon} tone="base" />
                                }
                                autoComplete="off"
                              />
                            </div>
                            <Button
                              onClick={() => selectProduct("customer_get")}
                            >
                              Browse
                            </Button>
                          </InlineStack>
                          <InlineStack wrap={false} gap="200">
                            <div style={{ width: "100%" }}>
                              <TextField
                                placeholder={t('translation.SearchsCollections')}
                                type="text"
                                onChange={handleInputChangeCustomerColl}
                                prefix={
                                  <Icon source={SearchIcon} tone="base" />
                                }
                                autoComplete="off"
                              />
                            </div>
                            <Button
                              onClick={() => selectCollection("customer_get")}
                            >
                              {t('translation.Browse')}
                            </Button>
                          </InlineStack>
                        </BlockStack>
                      </>
                    ) : (
                      ""
                    )}
                    <TextField
                      label={t('translation.Quantity')}
                      type="number"
                      onChange={(e) => {
                        handleFocus("qty");
                        handleChange(e, "customer_get", "qty");
                      }}
                      autoComplete="off"
                      value={formData.rules.customer_get.qty}
                    />{" "}
                    {formData.rules.customer_get.chosen_type === "specific" && (
                      <>
                        {getProduct.length === 0 &&
                        getCollections.length === 0 ? (
                          <InlineError
                            message={t('translation.aproductsdes')}
                            fieldID="myFieldID"
                          />
                        ) : (
                          <>
                            {getProduct.length > 0 && (
                              <BlockStack gap="200">
                                <Text as="p" fontWeight="bold">
                                {t('translation.Youselected')} {getProduct.length} {t('translation.product')}
                                  {getProduct.length > 1 ? "s" : ""}
                                </Text>
                                {getProduct.length > 0 &&
                                  getProduct.map((item, index) => (
                                    <div
                                      className="upsell_products_bundles_list"
                                      key={index}
                                    >
                                      <Box>
                                        <InlineStack
                                          wrap={false}
                                          align="space-between"
                                          blockAlign="center"
                                        >
                                          <Box padding="200">
                                            <InlineStack
                                              align="center"
                                              blockAlign="center"
                                              gap="200"
                                            >
                                              {item.productImage ? (
                                                <Thumbnail
                                                  source={item.productImage}
                                                  alt={item.productTitle}
                                                />
                                              ) : (
                                                <Icon
                                                  source={ImageIcon}
                                                  color="base"
                                                  accessibilityLabel={t('translation.Placeholder')}
                                                />
                                              )}
                                              <Text variant="bodySm" as="p">
                                                {item.productTitle}
                                              </Text>
                                            </InlineStack>
                                          </Box>
                                          <Box padding="200">
                                            <Button
                                              icon={DeleteIcon}
                                              onClick={() =>
                                                handleDelete(
                                                  index,
                                                  "customer_get",
                                                )
                                              }
                                              accessibilityLabel={t('translation.Deleteproduct')}
                                            />
                                          </Box>
                                        </InlineStack>
                                      </Box>
                                    </div>
                                  ))}
                              </BlockStack>
                            )}
                            {getCollections.length > 0 && (
                              <BlockStack gap="200">
                                <Text as="p" fontWeight="bold">
                                {t('translation.Youselected')} {getCollections.length}{" "}
                                  collection
                                  {getCollections.length > 1 ? "s" : ""}
                                </Text>
                                {getCollections.map((item, index) => (
                                  <div
                                    className="upsell_products_bundles_list"
                                    key={index}
                                  >
                                    <Box>
                                      <InlineStack
                                        wrap={false}
                                        align="space-between"
                                        blockAlign="center"
                                      >
                                        <Box padding="200">
                                          <InlineStack
                                            align="center"
                                            blockAlign="center"
                                            gap="200"
                                          >
                                            {item.productImage ? (
                                              <Thumbnail
                                                source={item.productImage}
                                                alt={item.productTitle}
                                              />
                                            ) : (
                                              <Icon
                                                source={ImageIcon}
                                                color="base"
                                                accessibilityLabel={t('translation.Placeholder')}
                                              />
                                            )}
                                            <Text variant="bodySm" as="p">
                                              {item.productTitle}
                                            </Text>
                                          </InlineStack>
                                        </Box>
                                        <Box padding="200">
                                          <Button
                                            icon={DeleteIcon}
                                            onClick={() =>
                                              handleCollectionDelete(
                                                index,
                                                "customer_get",
                                              )
                                            }
                                            accessibilityLabel={t('translation.Deleteproduct')}
                                          />
                                        </Box>
                                      </InlineStack>
                                    </Box>
                                  </div>
                                ))}
                              </BlockStack>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </BlockStack>
                </BlockStack>
              </Card>
            </Layout.Section>
          </div>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <Layout.Section variant="oneHalf">{leftPreviewLayout}</Layout.Section>
        </Grid.Cell>
      </Grid>

      <PageActions
        primaryAction={{
          content: "Continue to discount",
          onClick: handleContinueClick,
        }}
        secondaryActions={
          <Button onClick={toggleModal} variant="primary" tone="critical">
             {t('translation.Delete')}
          </Button>
        }
      />
    </>
  );
}

export function Apperance({
  handleFocus,
  toggleModal,
  openStates,
  handleToggle,
  leftPreviewLayout,
  handleContinueClick,
  handleChange,
  formData,
  handleColorChange,
}) {
  let { t } = useTranslation();
  const Status_options = [
    { label: t('translation.Selectoption'), value: t('translation.Selectoption') },
    { label: t('translation.Active'), value: t('translation.Active') },
    { label: t('translation.Inactive'), value: t('translation.Inactive') },
  ];
  const codeSnippet =
    '<div class="aios_cart_bogo" id="{{ item.product_id  }}" data-key="{{ item.key }}"></div>';
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard
      .writeText(codeSnippet)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  const informative_Status_options = [
    { label: t('translation.Selectoption'), value: t('translation.Selectoption') },
    { label: t('translation.Active'), value: t('translation.Active') },
    { label: t('translation.Inactive'), value: t('translation.Inactive') },
  ];

  const Productpage = (
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
                      {t('translation.BOGO')}
                      {formData.rules.product_page.status === "Active" ? (
                        <Badge tone="success">{t('translation.Active')}</Badge>
                      ) : (
                        <Badge>{t('translation.Inactive')}</Badge>
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
                        {t('translation.Showsettings')}
                        </Text>
                      </div>
                    )}
                    <Icon source={ChevronDownIcon} tone="base" />
                  </InlineStack>
                </div>
              </div>
              <Text variant="bodySm" as="p">
               {t('translation.newdescription')}
                {/* <Link href="#">
                  <Text variant="headingSm" as="h5">
                    Preview
                  </Text>
                </Link> */}
              </Text>
            </BlockStack>
          </div>

          <Collapsible
            open={openStates.cookiesettings}
            id="productpage"
            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
            expandOnPrint
          >
            <BlockStack gap="400">
              <Select
                label={t('translation.Status')}
                options={Status_options}
                onChange={(e) => {
                  handleFocus("status");
                  handleChange(e, "product_page", "status");
                }}
                value={formData.rules.product_page.status}
              />
              <TextField
                label={t('translation.Offertitle')}
                autoComplete="off"
                onChange={(e) => {
                  handleFocus("offer_title");
                  handleChange(e, "product_page", "offer_title");
                }}
                value={formData.rules.product_page.offer_title}
              />
              <TextField
                label={t('translation.Buttontext')}
                autoComplete="off"
                onChange={(e) => {
                  handleFocus("button_text");
                  handleChange(e, "product_page", "button_text");
                }}
                value={formData.rules.product_page.button_text}
              />
              <TextField
                label={t('translation.Badgetext')}
                autoComplete="off"
                onChange={(e) => {
                  handleFocus("badge_text");
                  handleChange(e, "product_page", "badge_text");
                }}
                value={formData.rules.product_page.badge_text}
              />
              <BlockStack gap={300}>
                <div
                  class="discount-displayed"
                  style={{
                    paddingTop: "20px",
                    borderBottom: "1px solid #ebebeb",
                  }}
                ></div>
              </BlockStack>
              <BlockStack gap={200}>
                <div style={{ float: "left" }}>
                  <Text variant="headingMd" as="h6">
                  {t('translation.Appearance')}
                  </Text>
                  <Text variant="bodySm" as="p">
                  {t('translation.Appearancetext')}
                  </Text>
                </div>

                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <div className="color_section">
                      <TextField
                        label={t('translation.Accentcolor')}
                        type="text"
                        onChange={(e) => {
                          handleFocus("accent_color");
                          handleChange(e, "product_page", "accent_color");
                        }}
                        value={formData.rules.product_page.accent_color}
                        autoComplete="off"
                        connectedLeft={
                          <input
                            style={{
                              boxShadow:
                                formData.rules.product_page.accent_color ===
                                "#ffffff"
                                  ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                                  : "none",
                              width:
                                formData.rules.product_page.accent_color ===
                                "#ffffff"
                                  ? "34px"
                                  : "38px",
                              height:
                                formData.rules.product_page.accent_color ===
                                "#ffffff"
                                  ? "34px"
                                  : "38px",
                            }}
                            type="color"
                            value={formData.rules.product_page.accent_color}
                            onChange={(e) =>
                              handleColorChange(
                                e,
                                "accent_color",
                                "product_page",
                                "accent_color",
                              )
                            }
                          />
                        }
                      />
                    </div>
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <div className="color_section">
                      <TextField
                        label={t('translation.Textcolor')}
                        type="text"
                        onChange={(e) => {
                          handleFocus("text_color");
                          handleChange(e, "product_page", "text_color");
                        }}
                        value={formData.rules.product_page.text_color}
                        autoComplete="off"
                        connectedLeft={
                          <input
                            style={{
                              boxShadow:
                                formData.rules.product_page.text_color ===
                                "#ffffff"
                                  ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                                  : "none",
                              width:
                                formData.rules.product_page.text_color ===
                                "#ffffff"
                                  ? "34px"
                                  : "38px",
                              height:
                                formData.rules.product_page.text_color ===
                                "#ffffff"
                                  ? "34px"
                                  : "38px",
                            }}
                            type="color"
                            value={formData.rules.product_page.text_color}
                            onChange={(e) =>
                              handleColorChange(
                                e,
                                "text_color",
                                "product_page",
                                "text_color",
                              )
                            }
                          />
                        }
                      />
                    </div>
                  </Grid.Cell>
                </Grid>
                <RangeSlider
                  output
                  label={
                    <InlineStack style={{ margin: "0px" }}>
                      {t('translation.Offersize')}
                      <Tooltip
                        content={t('translation.offersizetext')}
                      ></Tooltip>
                    </InlineStack>
                  }
                  min={10}
                  max={60}
                  prefix="10px"
                  suffix="16px"
                  value={formData.rules.product_page.badge_size}
                  onChange={(e) => {
                    handleFocus("badge_size");
                    handleChange(e, "product_page", "badge_size");
                  }}
                />
              </BlockStack>
              <BlockStack gap={300}>
                <div
                  className="discount-displayed"
                  style={{
                    paddingTop: "20px",
                    borderBottom: "1px solid #ebebeb",
                  }}
                ></div>
              </BlockStack>
              <div>
                <Text variant="headingSm" as="h6">
                 {t('translation.Productcard')}
                </Text>
                <Text variant="bodyMd" as="p">
                {t('translation.Thesesettings')}
                </Text>
              </div>
              <BlockStack gap={300}>
                <Checkbox
                  label={t('translation.Showshadow')}
                  checked={formData.rules.product_page.show_shadow}
                  onChange={(e) => {
                    handleFocus("show_shadow");
                    handleChange(e, "product_page", "show_shadow");
                  }}
                />
                <Checkbox
                  label={t('translation.Showborder')} 
                  checked={formData.rules.product_page.show_border}
                  onChange={(e) => {
                    handleFocus("show_border");
                    handleChange(e, "product_page", "show_border");
                  }}
                />

                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <div className="color_section">
                      <TextField
                        label={t('translation.Bordercolor')}
                        type="text"
                        onChange={(e) => {
                          handleFocus("border_color");
                          handleChange(e, "product_page", " border_color");
                        }}
                        value={formData.rules.product_page.border_color}
                        autoComplete="off"
                        connectedLeft={
                          <input
                            type="color"
                            style={{
                              boxShadow:
                                formData.rules.product_page.border_color ===
                                "#ffffff"
                                  ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                                  : "none",
                              width:
                                formData.rules.product_page.border_color ===
                                "#ffffff"
                                  ? "34px"
                                  : "38px",
                              height:
                                formData.rules.product_page.border_color ===
                                "#ffffff"
                                  ? "34px"
                                  : "38px",
                            }}
                            value={formData.rules.product_page.border_color}
                            onChange={(e) =>
                              handleColorChange(
                                e,
                                "border_color",
                                "product_page",
                                "border_color",
                              )
                            }
                          />
                        }
                      />
                    </div>
                  </Grid.Cell>
                  <Grid.Cell
                    columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                  ></Grid.Cell>
                </Grid>
              </BlockStack>
            </BlockStack>
          </Collapsible>
        </BlockStack>
      </Card>
    </div>
  );
  const CartPage = (
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
                    {t('translation.subss')}
                      {formData.rules.cart_page.status === "Active" ? (
                        <Badge tone="success">{t('translation.Active')}</Badge>
                      ) : (
                        <Badge>{t('translation.Inactive')}</Badge>
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
                        {t('translation.Showsettings')}
                        </Text>
                      </div>
                    )}
                    <Icon source={ChevronDownIcon} tone="base" />
                  </InlineStack>
                </div>
              </div>
              <Text variant="bodySm" as="p">
              {t('translation.newdescriptions')}
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
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  width: "fit-content",
                }}
              >
                <p>
                {t('translation.TodisplayBogo')}
                </p>
                <pre
                  style={{
                    background: "#f4f4f4",
                    padding: "10px",
                    borderRadius: "4px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {codeSnippet}
                </pre>
                <Button
                  onClick={handleCopy}
                  style={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  {copied ? t('translation.Copied') : t('translation.CopyCode')}
                </Button>
              </div>
              <Select
                label="Status"
                options={informative_Status_options}
                onChange={(e) => {
                  handleFocus("status");
                  handleChange(e, "cart_page", "status");
                }}
                value={formData.rules.cart_page.status}
              />
              <TextField
                label={t('translation.metades')}
                onChange={(e) => {
                  handleFocus("format");
                  handleChange(e, "cart_page", "format");
                }}
                value={formData.rules.cart_page.format}
                autoComplete="off"
                helpText={t('translation.deafaulttext')}
              />

              <Divider />
            </BlockStack>
          </Collapsible>
        </BlockStack>
      </Card>
    </div>
  );
  const ApperanceDataTab = (
    <div style={{ padding: "10px" }} className="SettingsDataTab_container">
      <BlockStack gap={500}>
        <div className="upper_section">
          <Layout>
            <Layout.Section variant="oneThird"></Layout.Section>
            <Layout.Section variant="oneThird">{Productpage}</Layout.Section>
            <Layout.Section variant="oneThird">{CartPage}</Layout.Section>
          </Layout>
        </div>
      </BlockStack>
    </div>
  );

  return (
    <div className="aios_layout_spacer">
      <Layout>
        <Layout.Section variant="oneHalf">
          <Layout>
            <Layout.Section>{ApperanceDataTab}</Layout.Section>
          </Layout>
        </Layout.Section>
        <Layout.Section variant="oneHalf">{leftPreviewLayout}</Layout.Section>
      </Layout>
      <PageActions
       primaryAction={{
        content: "Continue to Reviews",
        onClick: handleContinueClick,
      }}
        secondaryActions={
          <Button onClick={toggleModal} variant="primary" tone="critical">
            {t('translation.Delete')}
          </Button>
        }
      />
    </div>
  );
}
const EditDiscountType = () => {
  const navigate = useNavigate();
  let { t } = useTranslation();
  const {
    getData,
    upsellType,
    upsellId,
    getCustomerProducts,
    buyCustomerProducts,
    buyCustomerCollections,
    getCustomerCollections,
  } = useLoaderData();
  const [formData, setFormData] = useState(getData);
  const [activeTab, setActiveTab] = useState(1);
  const [editUpsellId, seteditUpsellId] = useState(upsellId);
  const [openStates, setOpenStates] = useState({
    generalDesignSettings: false,
    cookiesettings: false,
    informativeCookieBanner: false,
    thankubanner: false,
    addCart: false,
  });
  const [lastSavedData, setLastSavedData] = useState(getData);
  const [buttonloading, setButtonLoading] = useState(false);
  const [activemodal, setActivemodal] = useState(false);
  const [activeDiscardModal, setactiveDiscardModal] = useState(false);
  const handleToggle = (section) => {
    setOpenStates((prevOpenStates) => ({
      ...prevOpenStates,
      [section]: !prevOpenStates[section],
    }));
  };
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const [msgData, setMsgData] = useState("");
  const [activeField, setActiveField] = useState(false);
  const toggleModal = useCallback(
    () => setActivemodal((activemodal) => !activemodal),
    [],
  );
  const toggleDiscardModal = useCallback(
    () => setactiveDiscardModal((activeDiscardModal) => !activeDiscardModal),
    [],
  );
  const [buyProduct, setBuyProduct] = useState(buyCustomerProducts);
  const [getProduct, setGetProduct] = useState(getCustomerProducts);
  const [isFirstButtonActive, setIsFirstButtonActive] = useState(true);
  const [buyCollections, setBuyCollections] = useState(buyCustomerCollections);
  const [getCollections, setGetCollections] = useState(getCustomerCollections);

  const handleTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };
  const handleChange = (value, field, nestedField) => {
    if (nestedField) {
      setFormData((prevState) => ({
        ...prevState,
        rules: {
          ...prevState.rules,
          [field]: {
            ...prevState.rules[field],
            [nestedField]: value,
          },
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };
  const handleColorChange = (e, fieldName, field, nestedField) => {
    const value = e.target.value;
    handleChange(value, field, nestedField);
  };
  const handleSave = async () => {
    setButtonLoading(true);
    const dataToSend = {
      actionType: "update",
      data: formData,
      id: editUpsellId,
    };
    const response = await fetch("/api/upsell-save", {
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
      setMsgData(t('translation.SettingsUpdated'));
      setLastSavedData(formData);
      setFormData(data.data);
    } else {
      setButtonLoading(false);
      setActive(true);
      setActiveField(false);
      setError(true);
      setMsgData(t('translation.erorr'));
    }
  };
  const handleFirstButtonClick = (field) => {
    setIsFirstButtonActive(true);
    setFormData({
      ...formData,
      rules: {
        ...formData.rules,
        discount: {
          ...formData.rules.discount,

          discount_type: "Percent",
          discount_symbol: "%",
        },
      },
    });
  };
  const handleSecondButtonClick = (field) => {
   
    setFormData({
      ...formData,
      rules: {
        ...formData.rules,
        discount: {
          ...formData.rules.discount,

          discount_type: "fixed",
          discount_symbol: "INR",
        },
      },
    });
    setIsFirstButtonActive(false);
  };
  const toggleActive = useCallback(
    () => setActive((prevActive) => !prevActive),
    [],
  );

  useEffect(() => {
    shopify.loading(false);
  }, []);
  const handleDiscard = () => {
    setFormData(lastSavedData);
    setActiveField(false);
    toggleDiscardModal();
  };
  const toastMarkup = active ? (
    <Frame>
      <Toast content={msgData} onDismiss={toggleActive} error={error} />
    </Frame>
  ) : null;
  const addProducts = async (selectedProducts, type) => {
    if (type === "customer_buy") {
      setBuyProduct((prevBuyProduct) => [
        ...prevBuyProduct,
        ...selectedProducts.filter(
          (product) =>
            !prevBuyProduct.some((p) => p.productId === product.productId),
        ),
      ]);
    } else {
      setGetProduct((prevGetProduct) => [
        ...prevGetProduct,
        ...selectedProducts.filter(
          (product) =>
            !prevGetProduct.some((p) => p.productId === product.productId),
        ),
      ]);
    }
  };
  const addCollections = async (selectedCollections, type) => {
    if (type === "customer_buy") {
      setBuyCollections((prevBuyProduct) => [
        ...prevBuyProduct,
        ...selectedCollections.filter(
          (product) =>
            !prevBuyProduct.some((p) => p.productId === product.productId),
        ),
      ]);
    } else {
      setGetCollections((prevGetProduct) => [
        ...prevGetProduct,
        ...selectedCollections.filter(
          (product) =>
            !prevGetProduct.some((p) => p.productId === product.productId),
        ),
      ]);
    }
  };
  async function selectCollection(type) {
    const selectedIds = buyCollections.map((product) => ({
      id: product.productId,
    }));

    const getproductSelected = getCollections.map(
      (product) => product.productId,
    );
    let ids;
    if (type === "customer_buy") {
      ids = selectedIds;
    } else {
      ids = getproductSelected;
    }
    const collections = await window.shopify.resourcePicker({
      type: "collection",
      action: "select",
      multiple: true,
      selectionIds: ids,

      filter: {
        hidden: true,
        variants: false,
        draft: false,
        archived: false,
      },
    });
    if (collections) {
      const allSelectedProducts = collections.map((product) => {
        const { image, id, title, handle } = product;

        return {
          productId: id,
          productTitle: title,
          productImage: image?.originalSrc,
        };
      });
      const collectionIds = collections.map((coll) => coll.id);
    

      setFormData((prevState) => {
        const newRules = { ...prevState.rules };
        

        if (type == "customer_buy") {
          newRules.customer_buy.collections = collectionIds;
        } else if (type == "customer_get") {
          newRules.customer_get.collections = collectionIds;
        }

        return {
          ...prevState,
          rules: newRules,
        };
      });

      await addCollections(allSelectedProducts, type);
    }
  }

  async function selectProduct(type) {
    const selectedIds = buyProduct.map((product) => ({
      id: product.productId,
    }));

    const getproductSelected = getProduct.map((product) => product.productId);

    let ids;
    if (type === "customer_buy") {
      ids = selectedIds;
    } else {
      ids = getproductSelected;
    }

    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select",
      multiple: true,
      selectionIds: ids,

      filter: {
        hidden: true,
        variants: false,
        draft: false,
        archived: false,
      },
    });
    if (products) {
      const allSelectedProducts = products.map((product) => {
        const { images, id, title, handle } = product;

        return {
          productId: id,
          productTitle: title,
          productImage: images[0]?.originalSrc,
        };
      });
      const productIds = products.map((product) => product.id);

      setFormData((prevState) => {
        const newRules = { ...prevState.rules };

        if (type == "customer_buy") {
          newRules.customer_buy.products = productIds;
        } else if (type == "customer_get") {
          newRules.customer_get.products = productIds;
        }

        return {
          ...prevState,
          rules: newRules,
        };
      });
      await addProducts(allSelectedProducts, type);
    }
  }

  const handleContinueClick = () => {
    handleTab(activeTab + 1);
  };

  const leftPreviewLayout = (
    <div className="all_in_one_preview_layout">
      <div className="grid_2nd_card_conatiner">
        <div className="grid_2nd_inner_card_conatiner">
          <div className="all_preview_header">example.com/product-page</div>
          <div className="all_preview_image">
            <div className="preview_header">
              <h1>{t('translation.BuyOne')}</h1>
            </div>
            <div className="buy_one_wrapper">
              <div className="buy_one_box">
                <div className="buy_badge">
                  <span>BUY 1</span>
                </div>
                <div className="buy_box_image">
                  <img className="preview_image" src={bogoproduct} />
                  <div className="buy_box_content">
                    <div className="buy_box_title">Product A</div>
                    <div className="buy_box_price">100 ₹</div>
                    <div className="buy_box_variants">
                      <select>
                        <option value="Variant A">Variant A</option>
                        <option value="Variant B">Variant B</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="buy_one_icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="282.8931"
                  height="172.2146"
                  viewBox="0 0 282.8931 172.2146"
                >
                  <path
                    class="vtl-arrow"
                    fill="#333"
                    d="M288.5405,70.6877,191.5324,14.68a5.812,5.812,0,0,0-8.7181,5.0333V40.6707c-68.1986-3.568-149.68,48.2556-168.6364,111.6267a135.8115,135.8115,0,0,0-5.6244,33.81c19.85-65.5534,94.689-97.4043,174.2608-82.1232v27.7447a5.8121,5.8121,0,0,0,8.7181,5.0334l97.0081-56.0077A5.8121,5.8121,0,0,0,288.5405,70.6877Z"
                    transform="translate(-8.5535 -13.8927)"
                  ></path>
                </svg>
              </div>
              <div className="buy_one_get_off_box">
                <div className="buy_badge">
                  <span>BUY 1</span>
                </div>
                <div className="buy_box_image">
                  <img className="preview_image" src={bogoproduct2} />
                  <div className="buy_box_content">
                    <select>
                      <option value="Swap Item">Swap Item</option>
                      <option value="Swap Item">Swap Item</option>
                    </select>
                    <div className="buy_box_title">Product B</div>
                    <div className="offer-price">
                      <span>₹90</span>
                      <del>₹100</del>
                    </div>
                    <div className="buy_box_variants">
                      <select>
                        <option value="Variant A">Variant A</option>
                        <option value="Variant B">Variant B</option>
                      </select>
                    </div>
                    <div className="add-cart">
                      <span> Add To Cart</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const handleDelete = (id, type) => {
    if (type === "customer_buy") {
      setBuyProduct((prevBuyProduct) =>
        prevBuyProduct.filter((product, index) => index !== id),
      );

      setFormData((prevState) => {
        const newRules = { ...prevState.rules };
        newRules.customer_buy.products = newRules.customer_buy.products.filter(
          (productId, index) => index !== id,
        );
        return { ...prevState, rules: newRules };
      });
    } else {
      setGetProduct((prevGetProduct) =>
        prevGetProduct.filter((product, index) => index !== id),
      );
      setFormData((prevState) => {
        const newRules = { ...prevState.rules };
        newRules.customer_get.products = newRules.customer_get.products.filter(
          (productId, index) => index !== id,
        );
        return { ...prevState, rules: newRules };
      });
    }
  };
  const handleCollectionDelete = (id, type) => {
    if (type === "customer_buy") {
      setBuyCollections((prevBuyProduct) =>
        prevBuyProduct.filter((product, index) => index !== id),
      );
      setFormData((prevState) => {
        const newRules = { ...prevState.rules };
        newRules.customer_buy.collections =
          newRules.customer_buy.collections.filter(
            (productId, index) => index !== id,
          );
        return { ...prevState, rules: newRules };
      });
    } else {
      setGetCollections((prevGetProduct) =>
        prevGetProduct.filter((product, index) => index !== id),
      );
      setFormData((prevState) => {
        const newRules = { ...prevState.rules };
        newRules.customer_get.collections =
          newRules.customer_get.collections.filter(
            (productId, index) => index !== id,
          );
        return { ...prevState, rules: newRules };
      });
    }
  };
  const deleteUpsell = async () => {
    setButtonLoading(true);
    const dataToSend = {
      actionType: "delete",
      data: formData,
      id: editUpsellId,
    };
    const response = await fetch("/api/upsell-save", {
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
      setMsgData(t('translation.DeletedSuccessfully'));
      setActivemodal(false)
      navigate("/app/upsell_builder");
    } else {
      setButtonLoading(false);
      setActive(true);
      setActivemodal(false);
      setActiveField(false);
      setError(true);
      setMsgData(t('translation.erorr'));
    }
  };

  const DeleteModal = () => {
    return (
      <div className="discard-modal">
        <Modal
          open={activemodal}
          onClose={toggleModal}
          title={t('translation.areyousure')}
          primaryAction={{
            destructive: true,
            content: "Delete",
            laoding: buttonloading,
            onAction: deleteUpsell,
          }}
          secondaryActions={[
            {
              content: "Close",
              onAction: toggleModal,
            },
          ]}
        >
          <Modal.Section>{t('translation.Thisundone')}</Modal.Section>
        </Modal>
      </div>
    );
  };

  

  const getPrimaryActionContent = () => {
    let content;
    let disabled = false;
    switch (activeTab) {
      case 1:
        content = "Continue to Discount";
      case 2:
        content = "Continue to Appearance";
      case 3:
        content = "Continue to Review";
      default:
        content =
          formData?.offer_status === "Active" ? "Save" : "Publish Buy X Get Y";
        disabled = formData?.offer_status === "Active";
    }
    return { content, disabled };
  };
  const handleUpsellPublish = async () => {
    setButtonLoading(true);
    const updateddata = {
      offer_status: "Active",
    };
    const dataToSend = {
      actionType: "publish",
      id: editUpsellId,
      data: updateddata,
    };
    const response = await fetch("/api/upsell-save", {
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
      setMsgData(t('translation.SettingsUpdated'));
      setLastSavedData(formData);
      navigate("/app/upsell_builder");
    } else {
      setButtonLoading(false);
      setActive(true);
      setActiveField(false);
      setError(true);
      setMsgData(t('translation.erorr'));
    }
  };
  const handlePrimaryAction = () => {
    if (activeTab >= 1 && activeTab <= 3) {
      // Handle continue actions here
      handleContinueClick();
    } else {
      handleUpsellPublish();
    }
  };

  const handleClick = () => {
    navigate("/app/upsell_builder");
    shopify.loading(true);
  };
  const { content, disabled } = getPrimaryActionContent();
  return (
    <Page
      backAction={{
        content: "Back",
        onAction: handleClick,
      }}
      title={getData.internal_name}
      titleMetadata={
        formData.offer_status === "Active" ? (
          <Badge tone="success">{t('translation.Active')}</Badge>
        ) : (
          <Badge tone="info">{t('translation.Draft')}</Badge>
        )
      }
      primaryAction={{
        content: content,
        disabled: disabled,
        onAction: handlePrimaryAction,
        loading: buttonloading,
      }}
     
    >
      <Box background="bg-surface" borderRadius="200" shadow="300">
        <InlineGrid columns={4}>
          <a
            onClick={() => handleTab(1)}
            className={`aios-upsell_nav-link aios-upsell-steps ${activeTab === 1 ? "aios-upsell-current-step" : ""} ${activeTab > 1 ? "aios-upsell-completed-step" : ""}`}
          >
            <InlineStack blockAlign="center">
              <div className="aios-upsell_step_counter">
                {activeTab > 1 ? <Icon source={CheckIcon} tone="base" /> : "01"}
              </div>
              <BlockStack>
                <div className="aios-upsell_step_heading">Select Products</div>
                <div className="aios-upsell_step_sub_title">
                {t('translation.Productsoffer')}
                </div>
              </BlockStack>
            </InlineStack>
          </a>
          <a
            onClick={() => handleTab(2)}
            className={`aios-upsell_nav-link aios-upsell-steps ${activeTab === 2 ? "aios-upsell-current-step" : ""} ${activeTab > 2 ? "aios-upsell-completed-step" : ""}`}
          >
            <InlineStack blockAlign="center">
              <div className="aios-upsell_step_counter">
                {activeTab > 2 ? <Icon source={CheckIcon} tone="base" /> : "02"}
              </div>
              <BlockStack>
                <div className="aios-upsell_step_heading">{t('translation.Discount')}</div>
                <div className="aios-upsell_step_sub_title">
                {t('translation.Discounttypes')}
                </div>
              </BlockStack>
            </InlineStack>
          </a>
          <a
            onClick={() => handleTab(3)}
            className={`aios-upsell_nav-link aios-upsell-steps ${activeTab === 3 ? "aios-upsell-current-step" : ""} ${activeTab > 3 ? "aios-upsell-completed-step" : ""}`}
          >
            <InlineStack blockAlign="center">
              <div className="aios-upsell_step_counter">
                {activeTab > 3 ? <Icon source={CheckIcon} tone="base" /> : "03"}
              </div>
              <BlockStack>
                <div className="aios-upsell_step_heading">{t('translation.Appearance')}</div>
                <div className="aios-upsell_step_sub_title">
                {t('translation.Wherehow')}
                </div>
              </BlockStack>
            </InlineStack>
          </a>
          <a
            onClick={() => handleTab(4)}
            className={`aios-upsell_nav-link aios-upsell-steps ${activeTab === 4 ? "aios-upsell-current-step" : ""} `}
          >
            <InlineStack blockAlign="center">
              <div className="aios-upsell_step_counter">04</div>
              <BlockStack>
                <div className="aios-upsell_step_heading"> {t('translation.ReviewOrder')}</div>
                <div className="aios-upsell_step_sub_title">
                {t('translation.Reviewproducts')}
                </div>
              </BlockStack>
            </InlineStack>
          </a>
        </InlineGrid>
      </Box>
      {activeTab === 1 && (
        <div>
          {upsellType === "bogo" && (
            <BogoProducts
              toggleModal={toggleModal}
              getCollections={getCollections}
              handleFocus={handleFocus}
              buyCollections={buyCollections}
              getProduct={getProduct}
              buyProduct={buyProduct}
              selectProduct={selectProduct}
              selectCollection={selectCollection}
              handleContinueClick={handleContinueClick}
              leftPreviewLayout={leftPreviewLayout}
              handleDelete={handleDelete}
              handleChange={handleChange}
              formData={formData}
              handleCollectionDelete={handleCollectionDelete}
            />
          )}
        </div>
      )}
      {activeTab === 2 && (
        <div>
          {upsellType === "bogo" && (
            <Discount
              handleFocus={handleFocus}
              toggleModal={toggleModal}
              isFirstButtonActive={isFirstButtonActive}
              handleSecondButtonClick={handleSecondButtonClick}
              handleFirstButtonClick={handleFirstButtonClick}
              leftPreviewLayout={leftPreviewLayout}
              handleChange={handleChange}
              formData={formData}
              handleContinueClick={handleContinueClick}
            />
          )}
        </div>
      )}
      {activeTab === 3 && (
        <div>
          {upsellType === "bogo" && (
            <Apperance
              handleFocus={handleFocus}
              toggleModal={toggleModal}
              openStates={openStates}
              handleToggle={handleToggle}
              leftPreviewLayout={leftPreviewLayout}
              handleContinueClick={handleContinueClick}
              handleChange={handleChange}
              formData={formData}
              handleColorChange={handleColorChange}
            />
          )}
        </div>
      )}
      {activeTab === 4 && (
        <div>
          {upsellType === "bogo" && (
            <ReviewsLayout
              handleFocus={handleFocus}
              toggleModal={toggleModal}
              handleTab={handleTab}
              handleSave={handleSave}
              getCollections={getCollections}
              buyCollections={buyCollections}
              getProduct={getProduct}
              buyProduct={buyProduct}
              handleChange={handleChange}
              formData={formData}
            />
          )}
        </div>
      )}
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
              message={t('defaultSettings.content')}
              saveAction={{
                onAction: handleSave,
                loading: buttonloading,
                disabled: false,
              }}
              discardAction={{
                onAction: toggleDiscardModal,
              }}
            />
          </Frame>
        </div>
      )}
      {toastMarkup}
      <DiscardModal
        toggleModal={toggleDiscardModal}
        handleDiscard={handleDiscard}
        activemodal={activeDiscardModal}
      />
      <DeleteModal />
    </Page>
  );
};

export default EditDiscountType;