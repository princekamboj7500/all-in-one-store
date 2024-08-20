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
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import "./assets/style.css";
import {
  CheckIcon,
  PlusCircleIcon,
  SearchIcon,
  ChevronDownIcon,
  EditIcon,
  DeleteIcon,
  ImageIcon,
} from "@shopify/polaris-icons";
import DiscardModal from "./components/DiscardModal";
import {product, bogoproduct, bogoproduct2} from "./assets"
export const loader = async ({ request, params }) => {
  const type = params.id;

  const { session } = await authenticate.admin(request);
  const store = session.shop;
  let data;
  if (type === "bogo") {
    data = {
      discount_type: "BOGO",
      offer_status: "Draft",
      internal_name: "New BOGO",
      cart_label: "Discount",

      rules: {
        customer_buy: {
          products: [],
          chosen_type: "any",
          collections: [],
          qty: 1,
        },
        discount: {
          discount_amount: 10,
          discount_type: "percent",
          discount_symbol: "%",
        },
        product_page: {
          status: "Active",
          offer_title: "Buy One, Get One",
          button_text: "Add to Cart",
          badge_text: "Get {{ value }} off",
          accent_color: "#d83b3b",
          text_color: "#ffffff",
          badge_size: "12",
          show_shadow: 1,
          show_border: 1,
          border_color: "#eaeaea",
        },
        cart_page: {
          status: "Inactive",
          format:
            "You are eligible to get {{ quantity }} x {{ product }} with {{ value }} OFF!",
          button_style: "custom",
        },
        popup_cart: {
          status: "Inactive",
          title: "Get {{ value }} OFF for {{ quantity }}x",
          text: "Add to Cart",
          overlay_bgColor: "#ffffff",
          overlay_textColor: "#000000",
          button_bgColor: "#d83b3b",
          button_textColor: "#ffffff",
          variant_bgColor: "#ffffff",
          variant_textColor: "#4f4f4f",
        },
        customer_get: {
          products: [],
          chosen_type: "any",
          collections: [],
          qty: 1,
        },
      },
    };
  }

  if (type === "productbundle") {
  }

  return { data, store, type };
};

export function Discount({
  isFirstButtonActive,
  handleSecondButtonClick,
  handleFirstButtonClick,
  leftPreviewLayout,
  handleChange,
  formData,
  handleContinueClick,
}) {
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
                      Discount value
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
                              Percent
                            </Button>
                            <Button
                              pressed={!isFirstButtonActive}
                              onClick={handleSecondButtonClick}
                            >
                              Fixed Amount
                            </Button>
                          </ButtonGroup>
                          <TextField
                            type="number"
                            value={formData.rules.discount.discount_amount}
                            suffix={formData.rules.discount.discount_symbol}
                            onChange={(e) =>
                              handleChange(e, "discount", "discount_amount")
                            }
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
          content: "Continue to Appearance",
          onClick: handleContinueClick,
        }}
      />
    </>
  );
}

export function ReviewsLayout({handleTab, handleSave, getCollections,buyCollections, getProduct, buyProduct, handleChange, formData }) {
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
                        Products
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
                      Customer buys: {getCustomerBuysText()}
                    </Text>
                    Customer gets: {getCustomerGetsText()}
                  </Card>
                </Layout.Section>
                <Layout.Section>
                  <Card>
                    <InlineStack wrap={false} align="space-between">
                      <Text variant="headingSm" as="h6">
                        Discount details
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
                    {formData?.rules?.discount?.discount_symbol} Discount
                  </Card>
                </Layout.Section>
                <Layout.Section>
                  <Card>
                    <InlineStack wrap={false} align="space-between">
                      <Text variant="headingSm" as="h6">
                        Placements & Appearance
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
                                BOGO on Product Page
                              </Text>
                              <div>
                                {formData?.rules?.product_page.status =="Active"?( 
                                  <Badge tone="success">Active</Badge>):(
                         <Badge tone="info">Inactive</Badge>
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
                                Cart Suggestion on Cart page Success
                              </Text>
                              <div>
                              {formData?.rules?.cart_page.status=="Active"?( 
                                  <Badge tone="success">Active</Badge>):(
                         <Badge>Inactive</Badge>
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
                                Pop-up on Add to Cart button
                              </Text>
                              <div>
                              {formData?.rules?.popup_cart.status=="Active"?( 
                                  <Badge tone="success">Active</Badge>):(
                         <Badge>Inactive</Badge>
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
                  Offer status
                </Text>
                <Select
                  options={options}
                  value={formData.offer_status}
                  onChange={(value) => handleChange(value, "offer_status")}
                />
              </Card>
            </Layout.Section>
            <Layout.Section variant="oneThird">
              <Card>
                <Text variant="headingMd" as="h6">
                  Internal name
                </Text>
                <TextField
                  onChange={(e) => handleChange(e, "internal_name")}
                  value={formData.internal_name}
                  autoComplete="off"
                />
              </Card>
            </Layout.Section>
            <Layout.Section variant="oneThird">
              <Card>
                <Text variant="headingMd" as="h6">
                  Cart Label
                </Text>
                <TextField
                  onChange={(e) => handleChange(e, "cart_label")}
                  value={formData.cart_label}
                  helpText="Customize the text that shows up near the discount on the Cart page."
                  autoComplete="off"
                />
              </Card>
            </Layout.Section>
          </Layout>
        </Layout.Section>
      </Layout>
      <PageActions
        secondaryActions={<Button onClick={handleSave}>Save</Button>}
      />
    </div>
  );
}


export function AllCustomer({getCollections,buyCollections, getProduct, buyProduct,selectProduct, selectCollection,handleContinueClick,leftPreviewLayout,handleDelete,handleChange,formData,handleCollectionDelete }){
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = () => {
   
    selectProduct("customer_buy");
  };
  const handleInputChangeCustomerCollection = () => {
    selectCollection("customer_buy")
  };
  const handleInputChangeCustomerGet = () => {
    selectProduct("customer_get");
  };
  const handleInputChangeCustomerColl = () => {
    selectCollection("customer_get");
  }
  return (
    <>
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <div style={{ padding: "10px" }} className="product-review">
            <Layout.Section>
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h6" fontWeight="semibold">
                    Customer buys
                  </Text>
                  <RadioButton
                    label="Any product"
                    id="any-products-slotA"
                    name="products-slotA"
                    checked={
                      formData.rules.customer_buy.chosen_type === "any"
                    }
                    onChange={(e) =>
                      handleChange("any", "customer_buy", "chosen_type")
                    }
                  />

                  <RadioButton
                    label="Specific product or collection"
                    id="product-collection-slotA"
                    name="products-slotA"
                    checked={
                      formData.rules.customer_buy.chosen_type === "specific"
                    }
                    onChange={(e) =>
                      handleChange("specific", "customer_buy", "chosen_type")
                    }
                  />

                  {formData.rules.customer_buy.chosen_type === "specific" ? (
                    <>
                      <InlineStack wrap={false} gap="200">
                        <div style={{ width: "100%" }}>
                          <TextField
                            placeholder="Search Products"
                            type="text"
                            onChange={handleInputChange}
                            prefix={<Icon source={SearchIcon} tone="base" />}
                            autoComplete="off"
                          />
                        </div>
                        <Button onClick={() => selectProduct("customer_buy")}>
                          Browse
                        </Button>
                      </InlineStack>
                      <InlineStack wrap={false} gap="200">
                        <div style={{ width: "100%" }}>
                          <TextField
                            placeholder="Search  Collections"
                            type="text"
                            onChange={handleInputChangeCustomerCollection}
                            prefix={<Icon source={SearchIcon} tone="base" />}
                            autoComplete="off"
                          />
                        </div>
                        <Button
                          onClick={() => selectCollection("customer_buy")}
                        >
                          Browse
                        </Button>
                      </InlineStack>
                    </>
                  ) : (
                    ""
                  )}

                  <TextField
                    label="Quantity"
                    type="number"
                    value={formData.rules.customer_buy.qty}
                    autoComplete="off"
                    onChange={(e) => handleChange(e, "customer_buy", "qty")}
                  />
                  {formData.rules.customer_buy.chosen_type === "specific" && (
                    <>
                      {buyProduct.length === 0 &&
                      buyCollections.length === 0 ? (
                        <InlineError
                          message="A product or collection selection is required"
                          fieldID="myFieldID"
                        />
                      ) : (
                        <>
                          {buyProduct.length > 0 && (
                            <BlockStack gap="200">
                              <Text as="p" fontWeight="bold">
                                You have selected {buyProduct.length} product
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
                                                accessibilityLabel="Placeholder image"
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
                                            accessibilityLabel="Delete product"
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
                                You have selected {buyCollections.length}{" "}
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
                                              accessibilityLabel="Placeholder image"
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
                                          accessibilityLabel="Delete collection"
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
                <BlockStack gap={200}>
                  <Text variant="headingMd" as="h6" fontWeight="semibold">
                    Customer gets
                  </Text>

                  <RadioButton
                    label="Any product"
                    id="any-products-slotB"
                    name="products-slotB"
                    checked={
                      formData.rules.customer_get.chosen_type === "any"
                    }
                    onChange={(e) =>
                      handleChange("any", "customer_get", "chosen_type")
                    }
                  />
                  <RadioButton
                    label="Specific Products or Collections"
                    id="same-collection-slotB"
                    name="products-slotB"
                    checked={
                      formData.rules.customer_get.chosen_type === "specific"
                    }
                    onChange={(e) =>
                      handleChange("specific", "customer_get", "chosen_type")
                    }
                  />

                  {formData.rules.customer_get.chosen_type === "specific" ? (
                    <>
                      <InlineStack wrap={false} gap="200">
                        <div style={{ width: "100%" }}>
                          <TextField
                            placeholder="Search Products or Collections"
                            type="text"
                            onChange={handleInputChangeCustomerGet}
                            prefix={<Icon source={SearchIcon} tone="base" />}
                            autoComplete="off"
                          />
                        </div>
                        <Button onClick={() => selectProduct("customer_get")}>
                          Browse
                        </Button>
                      </InlineStack>
                      <InlineStack wrap={false} gap="200">
                        <div style={{ width: "100%" }}>
                          <TextField
                            placeholder="Search  Collections"
                            type="text"
                            onChange= {handleInputChangeCustomerColl}
                            prefix={<Icon source={SearchIcon} tone="base" />}
                            autoComplete="off"
                          />
                        </div>
                        <Button
                          onClick={() => selectCollection("customer_get")}
                        >
                          Browse
                        </Button>
                      </InlineStack>
                    </>
                  ) : (
                    ""
                  )}

                  <TextField
                    label="Quantity"
                    type="number"
                    onChange={(e) => handleChange(e, "customer_get", "qty")}
                    autoComplete="off"
                    value={formData.rules.customer_get.qty}
                  />
                  {formData.rules.customer_get.chosen_type === "specific" && (
                    <>
                      {getProduct.length === 0 &&
                      getCollections.length === 0 ? (
                        <InlineError
                          message="A product or collection selection is required"
                          fieldID="myFieldID"
                        />
                      ) : (
                        <>
                          {getProduct.length > 0 && (
                            <BlockStack gap="200">
                              <Text as="p" fontWeight="bold">
                                You have selected {getProduct.length} product
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
                                                accessibilityLabel="Placeholder image"
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
                                            accessibilityLabel="Delete product"
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
                                You have selected {getCollections.length}{" "}
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
                                              accessibilityLabel="Placeholder image"
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
                                          accessibilityLabel="Delete collection"
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
          </div>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <Layout.Section variant="oneHalf">
            {leftPreviewLayout}
          </Layout.Section>
        </Grid.Cell>
      </Grid>

      <PageActions
        primaryAction={{
          content: "Continue to discount",
          onClick: handleContinueClick,
        }}
      />
      </>
      )
}


export function Appearance({ openStates, handleToggle, leftPreviewLayout, handleContinueClick, handleChange, formData, handleColorChange}){
  const Status_options = [
    { label: "Select an option", value: "Select an option" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const informative_Status_options = [
    { label: "Select an option", value: "Select an option" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
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
                      BOGO on Product Page
                      {formData.rules.product_page.status === "Active" ? (
                        <Badge tone="success">Active</Badge>
                      ) : (
                        <Badge>Inactive</Badge>
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
                          Show settings
                        </Text>
                      </div>
                    )}
                    <Icon source={ChevronDownIcon} tone="base" />
                  </InlineStack>
                </div>
              </div>
              <Text variant="bodySm" as="p">
                Showcase the products from the offer, together with the
                discount. Suited just below the product description.
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
                label="Status"
                options={Status_options}
                onChange={(e) => {
                  handleChange(e, "product_page", "status");
                }}
                value={formData.rules.product_page.status}
              />
              <TextField
                label="Offer title"
                autoComplete="off"
                onChange={(e) => {
                  handleChange(e, "product_page", "offer_title");
                }}
                value={formData.rules.product_page.offer_title}
              />
              <TextField
                label={`Button text`}
                autoComplete="off"
                onChange={(e) => {
                  handleChange(e, "product_page", "button_text");
                }}
                value={formData.rules.product_page.button_text}
              />
              <TextField
                label={`Badge text`}
                autoComplete="off"
                onChange={(e) => {
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
                    Appearance
                  </Text>
                  <Text variant="bodySm" as="p">
                    These settings apply to offer badges, price badge and
                    button.
                  </Text>
                </div>

                <Grid>
                  <Grid.Cell
                    columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                  >
                    <div className="color_section">
                      <TextField
                        label={`Accent color`}
                        type="text"
                        onChange={(e) => {
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
                  <Grid.Cell
                    columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                  >
                    <div className="color_section">
                      <TextField
                        label={`Text color`}
                        type="text"
                        onChange={(e) => {
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
                      Offer badge text size
                      <Tooltip
                        content={`This is the maximum width that the carousel can have. It will not exceed the width of its container (section).`}
                      ></Tooltip>
                    </InlineStack>
                  }
                  min={10}
                  max={60}
                  prefix="10px"
                  suffix="16px"
                  value={formData.rules.product_page.badge_size}
                  onChange={(e) => {
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
                  Product card
                </Text>
                <Text variant="bodyMd" as="p">
                  These settings apply to all BOGO offers on Product Page
                </Text>
              </div>
              <BlockStack gap={300}>
                <Checkbox
                  label="Show shadow"
                  checked={formData.rules.product_page.show_shadow}
                  onChange={(e) => {
                    handleChange(e, "product_page", "show_shadow");
                  }}
                />
                <Checkbox
                  label="Show border"
                  checked={formData.rules.product_page.show_border}
                  onChange={(e) => {
                    handleChange(e, "product_page", "show_border");
                  }}
                />

                <Grid>
                  <Grid.Cell
                    columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                  >
                    <div className="color_section">
                      <TextField
                        label={`Border color`}
                        type="text"
                        onChange={(e) => {
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
                            Cart Suggestion on Cart page
                            {formData.rules.cart_page.status === "Active" ? (
                              <Badge tone="success">Active</Badge>
                            ) : (
                              <Badge>Inactive</Badge>
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
                                Show settings
                              </Text>
                            </div>
                          )}
                          <Icon source={ChevronDownIcon} tone="base" />
                        </InlineStack>
                      </div>
                    </div>
                    <Text variant="bodySm" as="p">
                      If your visitors are not required to give permission before
                      their data can be used, you can display an informative banner.
                      It will notify the visitors that by using your service, they
                      accept your Privacy Policy.
                      {/* <Link href="#">
                        <Text variant="headingSm" as="h5">
                          Preview
                        </Text>
                      </Link> */}
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
                      label="Status"
                      options={informative_Status_options}
                      onChange={(e) => {
                        handleChange(e, "cart_page", "status");
                      }}
                      value={formData.rules.cart_page.status}
                    />
                    <TextField
                      label="Product suggestion format when there is a discount"
                      onChange={(e) => {
                        handleChange(e, "cart_page", "format");
                      }}
                      value={formData.rules.cart_page.format}
                      autoComplete="off"
                      helpText="Default is: You are eligible to get {{ quantity }} x {{ product }} with
    {{ value }} OFF!'"
                    />
    
                    <Divider />
    
                    <Text variant="headingSm" as="h6">
                      Button
                    </Text>
                    <div className="aios-product-appearnce">
                      <label>Type</label>
                      <RadioButton
                        label="
                       Auto-detect theme style"
                        id="disabled"
                        name="accounts"
                        onChange={(e) =>
                          handleChange("auto-detect", "cart_page", "button_style")
                        }
                        checked={
                          formData.rules.cart_page.button_style === "auto-detect"
                        }
                      />
                      <RadioButton
                        label="Custom"
                        onChange={(e) =>
                          handleChange("custom", "cart_page", "button_style")
                        }
                        checked={formData.rules.cart_page.button_style === "custom"}
                        id="optional"
                        name="accounts"
                      />
                    </div>
                  </BlockStack>
                </Collapsible>
              </BlockStack>
            </Card>
          </div>
        );
        //     const ThankuPage = (
        //       <div>
        //         <Card sectioned>
        //           <BlockStack gap="500">
        //             <div className="arrow-sign">
        //               <BlockStack gap={200}>
        //                 <div
        //                   onClick={() => handleToggle("thankubanner")}
        //                   style={{ display: "inline-block", cursor: "pointer" }}
        //                 >
        //                   <div style={{ float: "left" }}>
        //                     <Text variant="headingSm" as="h6">
        //                       <InlineStack gap={300}>
        //                         Post Purchase on Thank you page
        //                         {formData.informative_banner_status === "Active" ? (
        //                           <Badge tone="success">Active</Badge>
        //                         ) : (
        //                           <Badge>Inactive</Badge>
        //                         )}
        //                       </InlineStack>
        //                     </Text>
        //                   </div>
        //                   <div style={{ float: "right" }}>
        //                     <InlineStack>
        //                       {openStates.thankubanner ? (
        //                         <> </>
        //                       ) : (
        //                         <div style={{ marginTop: "2px" }}>
        //                           <Text variant="bodySm" as="p">
        //                             Show settings
        //                           </Text>
        //                         </div>
        //                       )}
        //                       <Icon source={ChevronDownIcon} tone="base" />
        //                     </InlineStack>
        //                   </div>
        //                 </div>
        //               </BlockStack>
        //             </div>
    
        //             <Collapsible
        //               open={openStates.thankubanner}
        //               id="basic-collapsible"
        //               transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
        //               expandOnPrint
        //             >
        //               <BlockStack gap="400">
        //                 <Select
        //                   label="Status"
        //                   options={informative_Status_options}
        //                   onChange={(e) => {
        //                     handleFocus("informative_banner_status");
        //                     handleChange(e, "informative_banner_status");
        //                   }}
        //                   value={formData.informative_banner_status}
        //                 />
        //                 <TextField
        //                   label="Post Purchase offer title"
        //                   onChange={(e) => {
        //                     handleFocus("informative_banner_text");
        //                     handleChange(e, "informative_banner_text");
        //                   }}
        //                   value={formData.informative_banner_text}
        //                   autoComplete="off"
        //                   helpText="Default is: Last chance to get {{ value }} OFF, if you buy {{ quantity }}"
        //                 />
    
        //                 <TextField label={`"Accept" button`} autoComplete="off" />
        //                 <Divider />
        //                 <BlockStack gap={200}>
        //                   <div
        //                     onClick={() => handleToggle("generalDesignSettings")}
        //                     style={{ display: "inline-block", cursor: "pointer" }}
        //                   >
        //                     <div style={{ float: "left" }}>
        //                       <Text variant="headingMd" as="h6">
        //                         Appearance
        //                       </Text>
        //                       <Text variant="bodyMd" as="h6">
        //                         Accent
        //                       </Text>
        //                     </div>
        //                   </div>
        //                   <Grid>
        //                     <Grid.Cell
        //                       columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
        //                     >
        //                       <div className="color_section">
        //                         <TextField
        //                           label="Background"
        //                           type="text"
        //                           onChange={(e) => {
        //                             handleFocus("Accent_color");
        //                             handleChange(e, "Accent_color");
        //                           }}
        //                           value={formData.Accent_color}
        //                           autoComplete="off"
        //                           connectedLeft={
        //                             <input
        //                               type="color"
        //                               value={formData.Accent_color}
        //                               onChange={(e) => {
        //                                 handleFocus("Accent_color");
        //                                 handleColorChange(e, "Accent_color");
        //                               }}
        //                             />
        //                           }
        //                         />
        //                       </div>
        //                     </Grid.Cell>
        //                     <Grid.Cell
        //                       columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
        //                     >
        //                       <div className="color_section">
        //                         <TextField
        //                           label="Text"
        //                           type="text"
        //                           onChange={(e) => {
        //                             handleFocus("text_color");
        //                             handleChange(e, "text_color");
        //                           }}
        //                           value={formData.text_color}
        //                           autoComplete="off"
        //                           connectedLeft={
        //                             <input
        //                               type="color"
        //                               value={formData.text_color}
        //                               onChange={(e) => {
        //                                 handleFocus("reject_text_color");
        //                                 handleColorChange(e, "reject_text_color");
        //                               }}
        //                             />
        //                           }
        //                         />
        //                       </div>
        //                     </Grid.Cell>
        //                   </Grid>
        //                   <Text variant="bodyMd" as="h6">
        //                     Widget Position
        //                   </Text>
        //                   <Divider />
        //                   <Text variant="headingMd" as="h6">
        //                     Advanced Settings
        //                   </Text>
        //                   <TextField
        //                     label="Maximum acceptable discount
        // "
        //                     autoComplete="off"
        //                     helpText="This setting will protect against situations where the discount would make the upsell unprofitable."
        //                   />
        //                   <TextField
        //                     label="Bonus disclaimer text"
        //                     multiline={4}
        //                     autoComplete="off"
        //                   />
        //                 </BlockStack>
        //               </BlockStack>
        //             </Collapsible>
        //           </BlockStack>
        //         </Card>
        //       </div>
        //     );
        const addCart = (
          <div>
            <Card sectioned>
              <BlockStack gap="500">
                <div className="arrow-sign">
                  <BlockStack gap={200}>
                    <div
                      onClick={() => handleToggle("addCart")}
                      style={{ display: "inline-block", cursor: "pointer" }}
                    >
                      <div style={{ float: "left" }}>
                        <Text variant="headingSm" as="h6">
                          <InlineStack gap={300}>
                            Pop-up on Add to Cart button
                            {formData.rules.popup_cart.status === "Active" ? (
                              <Badge tone="success">Active</Badge>
                            ) : (
                              <Badge>Inactive</Badge>
                            )}
                          </InlineStack>
                        </Text>
                      </div>
                      <div style={{ float: "right" }}>
                        <InlineStack>
                          {openStates.addCart ? (
                            <> </>
                          ) : (
                            <div style={{ marginTop: "2px" }}>
                              <Text variant="bodySm" as="p">
                                Show settings
                              </Text>
                            </div>
                          )}
                          <Icon source={ChevronDownIcon} tone="base" />
                        </InlineStack>
                      </div>
                    </div>
                    <Text variant="bodySm" as="p">
                      Remind customers about this offer, if they missed the Classic
                      widget on the product page.
                      {/* <Link href="#">
                        <Text variant="headingSm" as="h5">
                          Preview
                        </Text>
                      </Link> */}
                    </Text>
                  </BlockStack>
                </div>
    
                <Collapsible
                  open={openStates.addCart}
                  id="basic-collapsible"
                  transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
                  expandOnPrint
                >
                  <BlockStack gap="400">
                    <Select
                      label="Status"
                      options={informative_Status_options}
                      onChange={(e) => {
                        handleChange(e, "popup_cart", "status");
                      }}
                      value={formData.rules.popup_cart.status}
                    />
                    <TextField
                      label="Pop-up title"
                      onChange={(e) => {
                        handleChange(e, "popup_cart", "title");
                      }}
                      value={formData.rules.popup_cart.title}
                      autoComplete="off"
                    />
                    <TextField
                      label="Button text"
                      onChange={(e) => {
                        handleChange(e, "popup_cart", "text");
                      }}
                      value={formData.rules.popup_cart.text}
                      autoComplete="off"
                    />
    
                    <Divider />
    
                    <Text variant="headingSm" as="h6">
                      Appearance
                    </Text>
                    <Text variant="headingSm" as="h6">
                      Overlay
                    </Text>
                    <Grid>
                      <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <div className="color_section">
                          <TextField
                            label="Background"
                            type="text"
                            onChange={(e) => {
                              handleChange(e, "popup_cart", "overlay_bgColor");
                            }}
                            value={formData.rules.popup_cart.overlay_bgColor}
                            autoComplete="off"
                            connectedLeft={
                              <input
                                type="color"
                                style={{
                                  boxShadow:
                                    formData.rules.popup_cart.overlay_bgColor ===
                                    "#ffffff"
                                      ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                                      : "none",
                                  width:
                                    formData.rules.popup_cart.overlay_bgColor ===
                                    "#ffffff"
                                      ? "34px"
                                      : "38px",
                                  height:
                                    formData.rules.popup_cart.overlay_bgColor ===
                                    "#ffffff"
                                      ? "34px"
                                      : "38px",
                                }}
                                value={formData.rules.popup_cart.overlay_bgColor}
                                onChange={(e) =>
                                  handleColorChange(
                                    e,
                                    "overlay_bgColor",
                                    "popup_cart",
                                    "overlay_bgColor",
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
                            label="Text"
                            type="text"
                            onChange={(e) => {
                              handleChange(e, "popup_cart", "overlay_textColor");
                            }}
                            value={formData.rules.popup_cart.overlay_textColor}
                            autoComplete="off"
                            connectedLeft={
                              <input
                                style={{
                                  boxShadow:
                                    formData.rules.popup_cart.overlay_textColor ===
                                    "#ffffff"
                                      ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                                      : "none",
                                  width:
                                    formData.rules.popup_cart.overlay_textColor ===
                                    "#ffffff"
                                      ? "34px"
                                      : "38px",
                                  height:
                                    formData.rules.popup_cart.overlay_textColor ===
                                    "#ffffff"
                                      ? "34px"
                                      : "38px",
                                }}
                                type="color"
                                value={formData.rules.popup_cart.overlay_textColor}
                                onChange={(e) =>
                                  handleColorChange(
                                    e,
                                    "overlay_textColor",
                                    "popup_cart",
                                    "overlay_textColor",
                                  )
                                }
                              />
                            }
                          />
                        </div>
                      </Grid.Cell>
                    </Grid>
                    <Text variant="headingSm" as="h6">
                      Button
                    </Text>
                    <Grid>
                      <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <div className="color_section">
                          <TextField
                            label="Background"
                            type="text"
                            onChange={(e) => {
                              handleChange(e, "popup_cart", "button_bgColor");
                            }}
                            value={formData.rules.popup_cart.button_bgColor}
                            autoComplete="off"
                            connectedLeft={
                              <input
                                type="color"
                                style={{
                                  boxShadow:
                                    formData.rules.popup_cart.button_bgColor ===
                                    "#ffffff"
                                      ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                                      : "none",
                                  width:
                                    formData.rules.popup_cart.button_bgColor ===
                                    "#ffffff"
                                      ? "34px"
                                      : "38px",
                                  height:
                                    formData.rules.popup_cart.button_bgColor ===
                                    "#ffffff"
                                      ? "34px"
                                      : "38px",
                                }}
                                value={formData.rules.popup_cart.button_bgColor}
                                onChange={(e) =>
                                  handleColorChange(
                                    e,
                                    "button_bgColor",
                                    "popup_cart",
                                    "button_bgColor",
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
                            label="Text"
                            type="text"
                            onChange={(e) => {
                              handleChange(e, "popup_cart", "button_textColor");
                            }}
                            value={formData.rules.popup_cart.button_textColor}
                            autoComplete="off"
                            connectedLeft={
                              <input
                                type="color"
                                style={{
                                  boxShadow:
                                    formData.rules.popup_cart.button_textColor ===
                                    "#ffffff"
                                      ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                                      : "none",
                                  width:
                                    formData.rules.popup_cart.button_textColor ===
                                    "#ffffff"
                                      ? "34px"
                                      : "38px",
                                  height:
                                    formData.rules.popup_cart.button_textColor ===
                                    "#ffffff"
                                      ? "34px"
                                      : "38px",
                                }}
                                value={formData.rules.popup_cart.button_textColor}
                                onChange={(e) =>
                                  handleColorChange(
                                    e,
                                    "button_textColor",
                                    "popup_cart",
                                    "button_textColor",
                                  )
                                }
                              />
                            }
                          />
                        </div>
                      </Grid.Cell>
                    </Grid>
                    <Text variant="headingSm" as="h6">
                      Variant selector
                    </Text>
                    <Grid>
                      <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <div className="color_section">
                          <TextField
                            label="Background"
                            type="text"
                            onChange={(e) => {
                              handleChange(e, "popup_cart", "variant_bgColor");
                            }}
                            value={formData.rules.popup_cart.variant_bgColor}
                            autoComplete="off"
                            connectedLeft={
                              <input
                                type="color"
                                style={{
                                  boxShadow:
                                    formData.rules.popup_cart.variant_bgColor ===
                                    "#ffffff"
                                      ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                                      : "none",
                                  width:
                                    formData.rules.popup_cart.variant_bgColor ===
                                    "#ffffff"
                                      ? "34px"
                                      : "38px",
                                  height:
                                    formData.rules.popup_cart.variant_bgColor ===
                                    "#ffffff"
                                      ? "34px"
                                      : "38px",
                                }}
                                value={formData.rules.popup_cart.variant_bgColor}
                                onChange={(e) =>
                                  handleColorChange(
                                    e,
                                    "variant_bgColor",
                                    "popup_cart",
                                    "variant_bgColor",
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
                            label="Text"
                            type="text"
                            onChange={(e) => {
                              handleChange(e, "popup_cart", " variant_textColor");
                            }}
                            value={formData.rules.popup_cart.variant_textColor}
                            autoComplete="off"
                            connectedLeft={
                              <input
                                type="color"
                                style={{
                                  boxShadow:
                                    formData.rules.popup_cart.variant_textColor ===
                                    "#ffffff"
                                      ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                                      : "none",
                                  width:
                                    formData.rules.popup_cart.variant_textColor ===
                                    "#ffffff"
                                      ? "34px"
                                      : "38px",
                                  height:
                                    formData.rules.popup_cart.variant_textColor ===
                                    "#ffffff"
                                      ? "34px"
                                      : "38px",
                                }}
                                value={formData.rules.popup_cart.variant_textColor}
                                onChange={(e) =>
                                  handleColorChange(
                                    e,
                                    "variant_textColor",
                                    "popup_cart",
                                    "variant_textColor",
                                  )
                                }
                              />
                            }
                          />
                        </div>
                      </Grid.Cell>
                    </Grid>
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
            {/* <Layout.Section variant="oneThird">{ThankuPage}</Layout.Section> */}
            <Layout.Section variant="oneThird">{addCart}</Layout.Section> 
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
          content: "Continue to Review",
          onClick: handleContinueClick,
        }}
      />
    </div>
  );
}
function BuilderCreate() {
  const [activeTab, setActiveTab] = useState(1);
  const { data, store, type } = useLoaderData();
  const [formData, setFormData] = useState(data);
  const [openStates, setOpenStates] = useState({
    generalDesignSettings: false,
    cookiesettings: false,
    informativeCookieBanner: false,
    thankubanner: false,
    addCart: false,
  });
  const [isFirstButtonActive, setIsFirstButtonActive] = useState(true);

  const nav = useNavigate();
  const [buttonloading, setButtonLoading] = useState(false);
  const [activemodal, setActivemodal] = useState(false);
  const handleToggle = (section) => {
    setOpenStates((prevOpenStates) => ({
      ...prevOpenStates,
      [section]: !prevOpenStates[section],
    }));
  };
  useEffect(() => {
    shopify.loading(false);
  }, []);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const [msgData, setMsgData] = useState("");
  const [activeField, setActiveField] = useState(false);
  const toggleModal = useCallback(
    () => setActivemodal((activemodal) => !activemodal),
    [],
  );
  const [lastSavedData, setLastSavedData] = useState(data);
  const [buyProduct, setBuyProduct] = useState([]);
  const [getProduct, setGetProduct] = useState([]);
  const [buyCollections, setBuyCollections] = useState([]);
  const [getCollections, setGetCollections] = useState([]);
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

  const handleSecondButtonClick = () => {
    setIsFirstButtonActive(true);
    // setFormData({ ...formData, discount_type: "fixed" });
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
  const handleTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const leftPreviewLayout = (
    <div className="all_in_one_preview_layout">
      <div className="grid_2nd_card_conatiner">
        <div className="grid_2nd_inner_card_conatiner">
          <div className="all_preview_header">example.com/product-page</div>
          <div className="all_preview_image">
            <div className="preview_header">
              <h1>Buy One, Get One</h1>
            </div>
            <div className="buy_one_wrapper">
              <div className="buy_one_box">
                <div className="buy_badge">
                  <span>BUY 1</span>
                </div>
                <div className="buy_box_image">
                  <img className="preview_image" width="200" height="200"
                    src={bogoproduct}
                  />
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
                  <span>Get {formData?.rules?.discount?.discount_amount}{formData?.rules?.discount?.discount_symbol} OFF</span>
                </div>
                <div className="buy_box_image">
                  <img
                    className="preview_image"
                    src={bogoproduct2}
                  />
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
  const addProducts = async (selectedProducts, type) => {
    if (type === "customer_buy") {
      setBuyProduct((prevBuyProduct) => [
        ...prevBuyProduct,
        ...selectedProducts,
      ]);
    } else {
      setGetProduct((prevBuyProduct) => [
        ...prevBuyProduct,
        ...selectedProducts,
      ]);
    }
  };

  const addCollections = async (selectedCollections, type) => {
    if (type === "customer_buy") {
      setBuyCollections((prevBuyProduct) => [
        ...prevBuyProduct,
        ...selectedCollections,
      ]);
    } else {
      setGetCollections((prevBuyProduct) => [
        ...prevBuyProduct,
        ...selectedCollections,
      ]);
    }
  };
  async function selectCollection(type) {
    const collections = await window.shopify.resourcePicker({
      type: "collection",
      action: "select",
      multiple: true,

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
    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select",
      multiple: true,

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

  useEffect(() => {
    shopify.loading(false);
  }, []);

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
    const updatedFormData = {
      ...formData,
      store: store,
    };
    setButtonLoading(true);
    const dataToSend = {
      actionType: "save",
      data: updatedFormData,
    };
    const response = await fetch("/api/upsell-save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });
    const result = await response.json();

    if (result.success) {
      setActive(true);
      const data = result.data;
      setMsgData("Saved successfully");
      setButtonLoading(false);
      nav(`/app/edit/${type}/${data.id}`);
    } else {
      setButtonLoading(false);
      setActive(true);

      setError(true);
      setMsgData("There is some error while update");
    }
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

  const handleColorChange = (e, fieldName, field, nestedField) => {
    const value = e.target.value;
    handleChange(value, field, nestedField);
  };

  const handleContinueClick = () => {
    handleTab(activeTab + 1);
  };
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
  // const AllCustomer = () => {
  //   const [inputValue, setInputValue] = useState("");
  //   const handleInputChange = (value) => {
  //     setInputValue(value);
  //     selectProduct("customer_buy", value);
  //   };
  //   return (
  //     <>
  //       <Grid>
  //         <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
  //           <div style={{ padding: "10px" }} className="product-review">
  //             <Layout.Section>
  //               <Card>
  //                 <BlockStack gap="200">
  //                   <Text variant="headingMd" as="h6" fontWeight="semibold">
  //                     Customer buys
  //                   </Text>
  //                   <RadioButton
  //                     label="Any product"
  //                     id="any-products-slotA"
  //                     name="products-slotA"
  //                     checked={
  //                       formData.rules.customer_buy.chosen_type === "any"
  //                     }
  //                     onChange={(e) =>
  //                       handleChange("any", "customer_buy", "chosen_type")
  //                     }
  //                   />

  //                   <RadioButton
  //                     label="Specific product or collection"
  //                     id="product-collection-slotA"
  //                     name="products-slotA"
  //                     checked={
  //                       formData.rules.customer_buy.chosen_type === "specific"
  //                     }
  //                     onChange={(e) =>
  //                       handleChange("specific", "customer_buy", "chosen_type")
  //                     }
  //                   />

  //                   {formData.rules.customer_buy.chosen_type === "specific" ? (
  //                     <>
  //                       <InlineStack wrap={false} gap="200">
  //                         <div style={{ width: "100%" }}>
  //                           <TextField
  //                             placeholder="Search Products"
  //                             type="text"
  //                             onChange={handleInputChange}
  //                             prefix={<Icon source={SearchIcon} tone="base" />}
  //                             autoComplete="off"
  //                           />
  //                         </div>
  //                         <Button onClick={() => selectProduct("customer_buy")}>
  //                           Browse
  //                         </Button>
  //                       </InlineStack>
  //                       <InlineStack wrap={false} gap="200">
  //                         <div style={{ width: "100%" }}>
  //                           <TextField
  //                             placeholder="Search  Collections"
  //                             type="text"
  //                             prefix={<Icon source={SearchIcon} tone="base" />}
  //                             autoComplete="off"
  //                           />
  //                         </div>
  //                         <Button
  //                           onClick={() => selectCollection("customer_buy")}
  //                         >
  //                           Browse
  //                         </Button>
  //                       </InlineStack>
  //                     </>
  //                   ) : (
  //                     ""
  //                   )}

  //                   <TextField
  //                     label="Quantity"
  //                     type="number"
  //                     value={formData.rules.customer_buy.qty}
  //                     autoComplete="off"
  //                     onChange={(e) => handleChange(e, "customer_buy", "qty")}
  //                   />
  //                   {formData.rules.customer_buy.chosen_type === "specific" && (
  //                     <>
  //                       {buyProduct.length === 0 &&
  //                       buyCollections.length === 0 ? (
  //                         <InlineError
  //                           message="A product or collection selection is required"
  //                           fieldID="myFieldID"
  //                         />
  //                       ) : (
  //                         <>
  //                           {buyProduct.length > 0 && (
  //                             <BlockStack gap="200">
  //                               <Text as="p" fontWeight="bold">
  //                                 You have selected {buyProduct.length} product
  //                                 {buyProduct.length > 1 ? "s" : ""}
  //                               </Text>
  //                               {buyProduct.length > 0 &&
  //                                 buyProduct.map((item, index) => (
  //                                   <div
  //                                     className="upsell_products_bundles_list"
  //                                     key={index}
  //                                   >
  //                                     <Box>
  //                                       <InlineStack
  //                                         wrap={false}
  //                                         align="space-between"
  //                                         blockAlign="center"
  //                                       >
  //                                         <Box padding="200">
  //                                           <InlineStack
  //                                             align="center"
  //                                             blockAlign="center"
  //                                             gap="200"
  //                                           >
  //                                             {item.productImage ? (
  //                                               <Thumbnail
  //                                                 source={item.productImage}
  //                                                 alt={item.productTitle}
  //                                               />
  //                                             ) : (
  //                                               <Icon
  //                                                 source={ImageIcon}
  //                                                 color="base"
  //                                                 accessibilityLabel="Placeholder image"
  //                                               />
  //                                             )}
  //                                             <Text variant="bodySm" as="p">
  //                                               {item.productTitle}
  //                                             </Text>
  //                                           </InlineStack>
  //                                         </Box>
  //                                         <Box padding="200">
  //                                           <Button
  //                                             icon={DeleteIcon}
  //                                             onClick={() =>
  //                                               handleDelete(
  //                                                 index,
  //                                                 "customer_buy",
  //                                               )
  //                                             }
  //                                             accessibilityLabel="Delete product"
  //                                           />
  //                                         </Box>
  //                                       </InlineStack>
  //                                     </Box>
  //                                   </div>
  //                                 ))}
  //                             </BlockStack>
  //                           )}
  //                           {buyCollections.length > 0 && (
  //                             <BlockStack gap="200">
  //                               <Text as="p" fontWeight="bold">
  //                                 You have selected {buyCollections.length}{" "}
  //                                 collection
  //                                 {buyCollections.length > 1 ? "s" : ""}
  //                               </Text>
  //                               {buyCollections.map((item, index) => (
  //                                 <div
  //                                   className="upsell_products_bundles_list"
  //                                   key={index}
  //                                 >
  //                                   <Box>
  //                                     <InlineStack
  //                                       wrap={false}
  //                                       align="space-between"
  //                                       blockAlign="center"
  //                                     >
  //                                       <Box padding="200">
  //                                         <InlineStack
  //                                           align="center"
  //                                           blockAlign="center"
  //                                           gap="200"
  //                                         >
  //                                           {item.productImage ? (
  //                                             <Thumbnail
  //                                               source={item.productImage}
  //                                               alt={item.productTitle}
  //                                             />
  //                                           ) : (
  //                                             <Icon
  //                                               source={ImageIcon}
  //                                               color="base"
  //                                               accessibilityLabel="Placeholder image"
  //                                             />
  //                                           )}
  //                                           <Text variant="bodySm" as="p">
  //                                             {item.productTitle}
  //                                           </Text>
  //                                         </InlineStack>
  //                                       </Box>
  //                                       <Box padding="200">
  //                                         <Button
  //                                           icon={DeleteIcon}
  //                                           onClick={() =>
  //                                             handleCollectionDelete(
  //                                               index,
  //                                               "customer_buy",
  //                                             )
  //                                           }
  //                                           accessibilityLabel="Delete collection"
  //                                         />
  //                                       </Box>
  //                                     </InlineStack>
  //                                   </Box>
  //                                 </div>
  //                               ))}
  //                             </BlockStack>
  //                           )}
  //                         </>
  //                       )}
  //                     </>
  //                   )}
  //                 </BlockStack>
  //               </Card>
  //             </Layout.Section>
  //             <Layout.Section>
  //               <Card>
  //                 <BlockStack gap={200}>
  //                   <Text variant="headingMd" as="h6" fontWeight="semibold">
  //                     Customer gets
  //                   </Text>

  //                   <RadioButton
  //                     label="Any product"
  //                     id="any-products-slotB"
  //                     name="products-slotB"
  //                     checked={
  //                       formData.rules.customer_get.chosen_type === "any"
  //                     }
  //                     onChange={(e) =>
  //                       handleChange("any", "customer_get", "chosen_type")
  //                     }
  //                   />
  //                   <RadioButton
  //                     label="Specific Products or Collections"
  //                     id="same-collection-slotB"
  //                     name="products-slotB"
  //                     checked={
  //                       formData.rules.customer_get.chosen_type === "specific"
  //                     }
  //                     onChange={(e) =>
  //                       handleChange("specific", "customer_get", "chosen_type")
  //                     }
  //                   />

  //                   {formData.rules.customer_get.chosen_type === "specific" ? (
  //                     <>
  //                       <InlineStack wrap={false} gap="200">
  //                         <div style={{ width: "100%" }}>
  //                           <TextField
  //                             placeholder="Search Products or Collections"
  //                             type="text"
  //                             prefix={<Icon source={SearchIcon} tone="base" />}
  //                             autoComplete="off"
  //                           />
  //                         </div>
  //                         <Button onClick={() => selectProduct("customer_get")}>
  //                           Browse
  //                         </Button>
  //                       </InlineStack>
  //                       <InlineStack wrap={false} gap="200">
  //                         <div style={{ width: "100%" }}>
  //                           <TextField
  //                             placeholder="Search  Collections"
  //                             type="text"
  //                             prefix={<Icon source={SearchIcon} tone="base" />}
  //                             autoComplete="off"
  //                           />
  //                         </div>
  //                         <Button
  //                           onClick={() => selectCollection("customer_get")}
  //                         >
  //                           Browse
  //                         </Button>
  //                       </InlineStack>
  //                     </>
  //                   ) : (
  //                     ""
  //                   )}

  //                   <TextField
  //                     label="Quantity"
  //                     type="number"
  //                     onChange={(e) => handleChange(e, "customer_get", "qty")}
  //                     autoComplete="off"
  //                     value={formData.rules.customer_get.qty}
  //                   />
  //                   {formData.rules.customer_get.chosen_type === "specific" && (
  //                     <>
  //                       {getProduct.length === 0 &&
  //                       getCollections.length === 0 ? (
  //                         <InlineError
  //                           message="A product or collection selection is required"
  //                           fieldID="myFieldID"
  //                         />
  //                       ) : (
  //                         <>
  //                           {getProduct.length > 0 && (
  //                             <BlockStack gap="200">
  //                               <Text as="p" fontWeight="bold">
  //                                 You have selected {getProduct.length} product
  //                                 {getProduct.length > 1 ? "s" : ""}
  //                               </Text>
  //                               {getProduct.length > 0 &&
  //                                 getProduct.map((item, index) => (
  //                                   <div
  //                                     className="upsell_products_bundles_list"
  //                                     key={index}
  //                                   >
  //                                     <Box>
  //                                       <InlineStack
  //                                         wrap={false}
  //                                         align="space-between"
  //                                         blockAlign="center"
  //                                       >
  //                                         <Box padding="200">
  //                                           <InlineStack
  //                                             align="center"
  //                                             blockAlign="center"
  //                                             gap="200"
  //                                           >
  //                                             {item.productImage ? (
  //                                               <Thumbnail
  //                                                 source={item.productImage}
  //                                                 alt={item.productTitle}
  //                                               />
  //                                             ) : (
  //                                               <Icon
  //                                                 source={ImageIcon}
  //                                                 color="base"
  //                                                 accessibilityLabel="Placeholder image"
  //                                               />
  //                                             )}
  //                                             <Text variant="bodySm" as="p">
  //                                               {item.productTitle}
  //                                             </Text>
  //                                           </InlineStack>
  //                                         </Box>
  //                                         <Box padding="200">
  //                                           <Button
  //                                             icon={DeleteIcon}
  //                                             onClick={() =>
  //                                               handleDelete(
  //                                                 index,
  //                                                 "customer_get",
  //                                               )
  //                                             }
  //                                             accessibilityLabel="Delete product"
  //                                           />
  //                                         </Box>
  //                                       </InlineStack>
  //                                     </Box>
  //                                   </div>
  //                                 ))}
  //                             </BlockStack>
  //                           )}
  //                           {getCollections.length > 0 && (
  //                             <BlockStack gap="200">
  //                               <Text as="p" fontWeight="bold">
  //                                 You have selected {getCollections.length}{" "}
  //                                 collection
  //                                 {getCollections.length > 1 ? "s" : ""}
  //                               </Text>
  //                               {getCollections.map((item, index) => (
  //                                 <div
  //                                   className="upsell_products_bundles_list"
  //                                   key={index}
  //                                 >
  //                                   <Box>
  //                                     <InlineStack
  //                                       wrap={false}
  //                                       align="space-between"
  //                                       blockAlign="center"
  //                                     >
  //                                       <Box padding="200">
  //                                         <InlineStack
  //                                           align="center"
  //                                           blockAlign="center"
  //                                           gap="200"
  //                                         >
  //                                           {item.productImage ? (
  //                                             <Thumbnail
  //                                               source={item.productImage}
  //                                               alt={item.productTitle}
  //                                             />
  //                                           ) : (
  //                                             <Icon
  //                                               source={ImageIcon}
  //                                               color="base"
  //                                               accessibilityLabel="Placeholder image"
  //                                             />
  //                                           )}
  //                                           <Text variant="bodySm" as="p">
  //                                             {item.productTitle}
  //                                           </Text>
  //                                         </InlineStack>
  //                                       </Box>
  //                                       <Box padding="200">
  //                                         <Button
  //                                           icon={DeleteIcon}
  //                                           onClick={() =>
  //                                             handleCollectionDelete(
  //                                               index,
  //                                               "customer_get",
  //                                             )
  //                                           }
  //                                           accessibilityLabel="Delete collection"
  //                                         />
  //                                       </Box>
  //                                     </InlineStack>
  //                                   </Box>
  //                                 </div>
  //                               ))}
  //                             </BlockStack>
  //                           )}
  //                         </>
  //                       )}
  //                     </>
  //                   )}
  //                 </BlockStack>
  //               </Card>
  //             </Layout.Section>
  //           </div>
  //         </Grid.Cell>
  //         <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
  //           <Layout.Section variant="oneHalf">
  //             {leftPreviewLayout}
  //           </Layout.Section>
  //         </Grid.Cell>
  //       </Grid>

  //       <PageActions
  //         primaryAction={{
  //           content: "Continue to discount",
  //           onClick: handleContinueClick,
  //         }}
  //       />
  //     </>
  //   );
  // };

  // const Discount = () => {
  //   const [isFirstButtonActive, setIsFirstButtonActive] = useState(true);

  //   const handleFirstButtonClick = (field) => {
  //     setIsFirstButtonActive(true);
  //     setFormData({
  //       ...formData,
  //       rules: {
  //         ...formData.rules,
  //         discount: {
  //           ...formData.rules.discount,

  //           discount_type: "Percent",
  //           discount_symbol: "%",
  //         },
  //       },
  //     });
  //   };
  //   const handleSecondButtonClick = (field) => {
  //     // setFormData({ ...formData, discount_type: "fixed" });
  //     setFormData({
  //       ...formData,
  //       rules: {
  //         ...formData.rules,
  //         discount: {
  //           ...formData.rules.discount,

  //           discount_type: "fixed",
  //           discount_symbol: "INR",
  //         },
  //       },
  //     });
  //     setIsFirstButtonActive(false);
  //   };
  //   return (
  //     <>
  //       <div className="aios_layout_spacer">
  //         <Layout>
  //           <Layout.Section variant="oneHalf">
  //             <Layout>
  //               <Layout.Section>
  //                 <Card roundedAbove="sm">
  //                   <BlockStack gap="300">
  //                     <Text variant="headingSm" as="h6">
  //                       Discount value
  //                     </Text>
  //                     <Box paddingBlockStart="200">
  //                       <BlockStack gap="400">
  //                         <InlineStack gap="200">
  //                           <ButtonGroup variant="segmented">
  //                             <Button
  //                               pressed={isFirstButtonActive}
  //                               onClick={() => {
  //                                 handleFirstButtonClick("discount");
  //                               }}
  //                             >
  //                               Percent
  //                             </Button>
  //                             <Button
  //                               pressed={!isFirstButtonActive}
  //                               onClick={handleSecondButtonClick}
  //                             >
  //                               Fixed Amount
  //                             </Button>
  //                           </ButtonGroup>
  //                           <TextField
  //                             type="number"
  //                             value={formData.rules.discount.discount_amount}
  //                             suffix={formData.rules.discount.discount_symbol}
  //                             onChange={(e) =>
  //                               handleChange(e, "discount", "discount_amount")
  //                             }
  //                           />
  //                         </InlineStack>
  //                       </BlockStack>
  //                     </Box>
  //                   </BlockStack>
  //                 </Card>
  //               </Layout.Section>
  //             </Layout>
  //           </Layout.Section>
  //           <Layout.Section variant="oneHalf">
  //             {leftPreviewLayout}
  //           </Layout.Section>
  //         </Layout>
  //       </div>
  //       <PageActions
  //         primaryAction={{
  //           content: "Continue to Appearance",
  //           onClick: handleContinueClick,
  //         }}
  //       />
  //     </>
  //   );
  // };

//   const Apperance = () => {
//     const Status_options = [
//       { label: "Select an option", value: "Select an option" },
//       { label: "Active", value: "Active" },
//       { label: "Inactive", value: "Inactive" },
//     ];

//     const informative_Status_options = [
//       { label: "Select an option", value: "Select an option" },
//       { label: "Active", value: "Active" },
//       { label: "Inactive", value: "Inactive" },
//     ];

//     const Productpage = (
//       <div>
//         <Card sectioned>
//           <BlockStack gap="500">
//             <div className="arrow-sign">
//               <BlockStack gap={200}>
//                 <div
//                   onClick={() => handleToggle("cookiesettings")}
//                   style={{ display: "inline-block", cursor: "pointer" }}
//                 >
//                   <div style={{ float: "left" }}>
//                     <Text variant="headingSm" as="h6">
//                       <InlineStack gap={300}>
//                         {" "}
//                         BOGO on Product Page
//                         {formData.rules.product_page.status === "Active" ? (
//                           <Badge tone="success">Active</Badge>
//                         ) : (
//                           <Badge>Inactive</Badge>
//                         )}
//                       </InlineStack>
//                     </Text>
//                   </div>
//                   <div style={{ float: "right" }}>
//                     <InlineStack>
//                       {openStates.cookiesettings ? (
//                         <></>
//                       ) : (
//                         <div style={{ marginTop: "2px" }}>
//                           <Text variant="bodySm" as="p">
//                             Show settings
//                           </Text>
//                         </div>
//                       )}
//                       <Icon source={ChevronDownIcon} tone="base" />
//                     </InlineStack>
//                   </div>
//                 </div>
//                 <Text variant="bodySm" as="p">
//                   Showcase the products from the offer, together with the
//                   discount. Suited just below the product description.
//                   <Link href="#">
//                     <Text variant="headingSm" as="h5">
//                       Preview
//                     </Text>
//                   </Link>
//                 </Text>
//               </BlockStack>
//             </div>

//             <Collapsible
//               open={openStates.cookiesettings}
//               id="productpage"
//               transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
//               expandOnPrint
//             >
//               <BlockStack gap="400">
//                 <Select
//                   label="Status"
//                   options={Status_options}
//                   onChange={(e) => {
//                     handleChange(e, "product_page", "status");
//                   }}
//                   value={formData.rules.product_page.status}
//                 />
//                 <TextField
//                   label="Offer title"
//                   autoComplete="off"
//                   onChange={(e) => {
//                     handleChange(e, "product_page", "offer_title");
//                   }}
//                   value={formData.rules.product_page.offer_title}
//                 />
//                 <TextField
//                   label={`Button text`}
//                   autoComplete="off"
//                   onChange={(e) => {
//                     handleChange(e, "product_page", "button_text");
//                   }}
//                   value={formData.rules.product_page.button_text}
//                 />
//                 <TextField
//                   label={`Badge text`}
//                   autoComplete="off"
//                   onChange={(e) => {
//                     handleChange(e, "product_page", "badge_text");
//                   }}
//                   value={formData.rules.product_page.badge_text}
//                 />
//                 <BlockStack gap={300}>
//                   <div
//                     class="discount-displayed"
//                     style={{
//                       paddingTop: "20px",
//                       borderBottom: "1px solid #ebebeb",
//                     }}
//                   ></div>
//                 </BlockStack>
//                 <BlockStack gap={200}>
//                   <div style={{ float: "left" }}>
//                     <Text variant="headingMd" as="h6">
//                       Appearance
//                     </Text>
//                     <Text variant="bodySm" as="p">
//                       These settings apply to offer badges, price badge and
//                       button.
//                     </Text>
//                   </div>

//                   <Grid>
//                     <Grid.Cell
//                       columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
//                     >
//                       <div className="color_section">
//                         <TextField
//                           label={`Accent color`}
//                           type="text"
//                           onChange={(e) => {
//                             handleChange(e, "product_page", "accent_color");
//                           }}
//                           value={formData.rules.product_page.accent_color}
//                           autoComplete="off"
//                           connectedLeft={
//                             <input
//                               style={{
//                                 boxShadow:
//                                   formData.rules.product_page.accent_color ===
//                                   "#ffffff"
//                                     ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
//                                     : "none",
//                                 width:
//                                   formData.rules.product_page.accent_color ===
//                                   "#ffffff"
//                                     ? "34px"
//                                     : "38px",
//                                 height:
//                                   formData.rules.product_page.accent_color ===
//                                   "#ffffff"
//                                     ? "34px"
//                                     : "38px",
//                               }}
//                               type="color"
//                               value={formData.rules.product_page.accent_color}
//                               onChange={(e) =>
//                                 handleColorChange(
//                                   e,
//                                   "accent_color",
//                                   "product_page",
//                                   "accent_color",
//                                 )
//                               }
//                             />
//                           }
//                         />
//                       </div>
//                     </Grid.Cell>
//                     <Grid.Cell
//                       columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
//                     >
//                       <div className="color_section">
//                         <TextField
//                           label={`Text color`}
//                           type="text"
//                           onChange={(e) => {
//                             handleChange(e, "product_page", "text_color");
//                           }}
//                           value={formData.rules.product_page.text_color}
//                           autoComplete="off"
//                           connectedLeft={
//                             <input
//                               style={{
//                                 boxShadow:
//                                   formData.rules.product_page.text_color ===
//                                   "#ffffff"
//                                     ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
//                                     : "none",
//                                 width:
//                                   formData.rules.product_page.text_color ===
//                                   "#ffffff"
//                                     ? "34px"
//                                     : "38px",
//                                 height:
//                                   formData.rules.product_page.text_color ===
//                                   "#ffffff"
//                                     ? "34px"
//                                     : "38px",
//                               }}
//                               type="color"
//                               value={formData.rules.product_page.text_color}
//                               onChange={(e) =>
//                                 handleColorChange(
//                                   e,
//                                   "text_color",
//                                   "product_page",
//                                   "text_color",
//                                 )
//                               }
//                             />
//                           }
//                         />
//                       </div>
//                     </Grid.Cell>
//                   </Grid>
//                   <RangeSlider
//                     output
//                     label={
//                       <InlineStack style={{ margin: "0px" }}>
//                         Offer badge text size
//                         <Tooltip
//                           content={`This is the maximum width that the carousel can have. It will not exceed the width of its container (section).`}
//                         ></Tooltip>
//                       </InlineStack>
//                     }
//                     min={10}
//                     max={60}
//                     prefix="10px"
//                     suffix="16px"
//                     value={formData.rules.product_page.badge_size}
//                     onChange={(e) => {
//                       handleChange(e, "product_page", "badge_size");
//                     }}
//                   />
//                 </BlockStack>
//                 <BlockStack gap={300}>
//                   <div
//                     className="discount-displayed"
//                     style={{
//                       paddingTop: "20px",
//                       borderBottom: "1px solid #ebebeb",
//                     }}
//                   ></div>
//                 </BlockStack>
//                 <div>
//                   <Text variant="headingSm" as="h6">
//                     Product card
//                   </Text>
//                   <Text variant="bodyMd" as="p">
//                     These settings apply to all BOGO offers on Product Page
//                   </Text>
//                 </div>
//                 <BlockStack gap={300}>
//                   <Checkbox
//                     label="Show shadow"
//                     checked={formData.rules.product_page.show_shadow}
//                     onChange={(e) => {
//                       handleChange(e, "product_page", "show_shadow");
//                     }}
//                   />
//                   <Checkbox
//                     label="Show border"
//                     checked={formData.rules.product_page.show_border}
//                     onChange={(e) => {
//                       handleChange(e, "product_page", "show_border");
//                     }}
//                   />

//                   <Grid>
//                     <Grid.Cell
//                       columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
//                     >
//                       <div className="color_section">
//                         <TextField
//                           label={`Border color`}
//                           type="text"
//                           onChange={(e) => {
//                             handleChange(e, "product_page", " border_color");
//                           }}
//                           value={formData.rules.product_page.border_color}
//                           autoComplete="off"
//                           connectedLeft={
//                             <input
//                               type="color"
//                               style={{
//                                 boxShadow:
//                                   formData.rules.product_page.border_color ===
//                                   "#ffffff"
//                                     ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
//                                     : "none",
//                                 width:
//                                   formData.rules.product_page.border_color ===
//                                   "#ffffff"
//                                     ? "34px"
//                                     : "38px",
//                                 height:
//                                   formData.rules.product_page.border_color ===
//                                   "#ffffff"
//                                     ? "34px"
//                                     : "38px",
//                               }}
//                               value={formData.rules.product_page.border_color}
//                               onChange={(e) =>
//                                 handleColorChange(
//                                   e,
//                                   "border_color",
//                                   "product_page",
//                                   "border_color",
//                                 )
//                               }
//                             />
//                           }
//                         />
//                       </div>
//                     </Grid.Cell>
//                     <Grid.Cell
//                       columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
//                     ></Grid.Cell>
//                   </Grid>
//                 </BlockStack>
//               </BlockStack>
//             </Collapsible>
//           </BlockStack>
//         </Card>
//       </div>
//     );
//     const CartPage = (
//       <div>
//         <Card sectioned>
//           <BlockStack gap="500">
//             <div className="arrow-sign">
//               <BlockStack gap={200}>
//                 <div
//                   onClick={() => handleToggle("informativeCookieBanner")}
//                   style={{ display: "inline-block", cursor: "pointer" }}
//                 >
//                   <div style={{ float: "left" }}>
//                     <Text variant="headingSm" as="h6">
//                       <InlineStack gap={300}>
//                         Cart Suggestion on Cart page
//                         {formData.rules.cart_page.status === "Active" ? (
//                           <Badge tone="success">Active</Badge>
//                         ) : (
//                           <Badge>Inactive</Badge>
//                         )}
//                       </InlineStack>
//                     </Text>
//                   </div>
//                   <div style={{ float: "right" }}>
//                     <InlineStack>
//                       {openStates.informativeCookieBanner ? (
//                         <> </>
//                       ) : (
//                         <div style={{ marginTop: "2px" }}>
//                           <Text variant="bodySm" as="p">
//                             Show settings
//                           </Text>
//                         </div>
//                       )}
//                       <Icon source={ChevronDownIcon} tone="base" />
//                     </InlineStack>
//                   </div>
//                 </div>
//                 <Text variant="bodySm" as="p">
//                   If your visitors are not required to give permission before
//                   their data can be used, you can display an informative banner.
//                   It will notify the visitors that by using your service, they
//                   accept your Privacy Policy.
//                   <Link href="#">
//                     <Text variant="headingSm" as="h5">
//                       Preview
//                     </Text>
//                   </Link>
//                 </Text>
//               </BlockStack>
//             </div>

//             <Collapsible
//               open={openStates.informativeCookieBanner}
//               id="basic-collapsible"
//               transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
//               expandOnPrint
//             >
//               <BlockStack gap="400">
//                 <Select
//                   label="Status"
//                   options={informative_Status_options}
//                   onChange={(e) => {
//                     handleChange(e, "cart_page", "status");
//                   }}
//                   value={formData.rules.cart_page.status}
//                 />
//                 <TextField
//                   label="Product suggestion format when there is a discount"
//                   onChange={(e) => {
//                     handleChange(e, "cart_page", "format");
//                   }}
//                   value={formData.rules.cart_page.format}
//                   autoComplete="off"
//                   helpText="Default is: You are eligible to get {{ quantity }} x {{ product }} with
// {{ value }} OFF!'"
//                 />

//                 <Divider />

//                 <Text variant="headingSm" as="h6">
//                   Button
//                 </Text>
//                 <div className="aios-product-appearnce">
//                   <label>Type</label>
//                   <RadioButton
//                     label="
//                    Auto-detect theme style"
//                     id="disabled"
//                     name="accounts"
//                     onChange={(e) =>
//                       handleChange("auto-detect", "cart_page", "button_style")
//                     }
//                     checked={
//                       formData.rules.cart_page.button_style === "auto-detect"
//                     }
//                   />
//                   <RadioButton
//                     label="Custom"
//                     onChange={(e) =>
//                       handleChange("custom", "cart_page", "button_style")
//                     }
//                     checked={formData.rules.cart_page.button_style === "custom"}
//                     id="optional"
//                     name="accounts"
//                   />
//                 </div>
//               </BlockStack>
//             </Collapsible>
//           </BlockStack>
//         </Card>
//       </div>
//     );
//     //     const ThankuPage = (
//     //       <div>
//     //         <Card sectioned>
//     //           <BlockStack gap="500">
//     //             <div className="arrow-sign">
//     //               <BlockStack gap={200}>
//     //                 <div
//     //                   onClick={() => handleToggle("thankubanner")}
//     //                   style={{ display: "inline-block", cursor: "pointer" }}
//     //                 >
//     //                   <div style={{ float: "left" }}>
//     //                     <Text variant="headingSm" as="h6">
//     //                       <InlineStack gap={300}>
//     //                         Post Purchase on Thank you page
//     //                         {formData.informative_banner_status === "Active" ? (
//     //                           <Badge tone="success">Active</Badge>
//     //                         ) : (
//     //                           <Badge>Inactive</Badge>
//     //                         )}
//     //                       </InlineStack>
//     //                     </Text>
//     //                   </div>
//     //                   <div style={{ float: "right" }}>
//     //                     <InlineStack>
//     //                       {openStates.thankubanner ? (
//     //                         <> </>
//     //                       ) : (
//     //                         <div style={{ marginTop: "2px" }}>
//     //                           <Text variant="bodySm" as="p">
//     //                             Show settings
//     //                           </Text>
//     //                         </div>
//     //                       )}
//     //                       <Icon source={ChevronDownIcon} tone="base" />
//     //                     </InlineStack>
//     //                   </div>
//     //                 </div>
//     //               </BlockStack>
//     //             </div>

//     //             <Collapsible
//     //               open={openStates.thankubanner}
//     //               id="basic-collapsible"
//     //               transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
//     //               expandOnPrint
//     //             >
//     //               <BlockStack gap="400">
//     //                 <Select
//     //                   label="Status"
//     //                   options={informative_Status_options}
//     //                   onChange={(e) => {
//     //                     handleFocus("informative_banner_status");
//     //                     handleChange(e, "informative_banner_status");
//     //                   }}
//     //                   value={formData.informative_banner_status}
//     //                 />
//     //                 <TextField
//     //                   label="Post Purchase offer title"
//     //                   onChange={(e) => {
//     //                     handleFocus("informative_banner_text");
//     //                     handleChange(e, "informative_banner_text");
//     //                   }}
//     //                   value={formData.informative_banner_text}
//     //                   autoComplete="off"
//     //                   helpText="Default is: Last chance to get {{ value }} OFF, if you buy {{ quantity }}"
//     //                 />

//     //                 <TextField label={`"Accept" button`} autoComplete="off" />
//     //                 <Divider />
//     //                 <BlockStack gap={200}>
//     //                   <div
//     //                     onClick={() => handleToggle("generalDesignSettings")}
//     //                     style={{ display: "inline-block", cursor: "pointer" }}
//     //                   >
//     //                     <div style={{ float: "left" }}>
//     //                       <Text variant="headingMd" as="h6">
//     //                         Appearance
//     //                       </Text>
//     //                       <Text variant="bodyMd" as="h6">
//     //                         Accent
//     //                       </Text>
//     //                     </div>
//     //                   </div>
//     //                   <Grid>
//     //                     <Grid.Cell
//     //                       columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
//     //                     >
//     //                       <div className="color_section">
//     //                         <TextField
//     //                           label="Background"
//     //                           type="text"
//     //                           onChange={(e) => {
//     //                             handleFocus("Accent_color");
//     //                             handleChange(e, "Accent_color");
//     //                           }}
//     //                           value={formData.Accent_color}
//     //                           autoComplete="off"
//     //                           connectedLeft={
//     //                             <input
//     //                               type="color"
//     //                               value={formData.Accent_color}
//     //                               onChange={(e) => {
//     //                                 handleFocus("Accent_color");
//     //                                 handleColorChange(e, "Accent_color");
//     //                               }}
//     //                             />
//     //                           }
//     //                         />
//     //                       </div>
//     //                     </Grid.Cell>
//     //                     <Grid.Cell
//     //                       columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
//     //                     >
//     //                       <div className="color_section">
//     //                         <TextField
//     //                           label="Text"
//     //                           type="text"
//     //                           onChange={(e) => {
//     //                             handleFocus("text_color");
//     //                             handleChange(e, "text_color");
//     //                           }}
//     //                           value={formData.text_color}
//     //                           autoComplete="off"
//     //                           connectedLeft={
//     //                             <input
//     //                               type="color"
//     //                               value={formData.text_color}
//     //                               onChange={(e) => {
//     //                                 handleFocus("reject_text_color");
//     //                                 handleColorChange(e, "reject_text_color");
//     //                               }}
//     //                             />
//     //                           }
//     //                         />
//     //                       </div>
//     //                     </Grid.Cell>
//     //                   </Grid>
//     //                   <Text variant="bodyMd" as="h6">
//     //                     Widget Position
//     //                   </Text>
//     //                   <Divider />
//     //                   <Text variant="headingMd" as="h6">
//     //                     Advanced Settings
//     //                   </Text>
//     //                   <TextField
//     //                     label="Maximum acceptable discount
//     // "
//     //                     autoComplete="off"
//     //                     helpText="This setting will protect against situations where the discount would make the upsell unprofitable."
//     //                   />
//     //                   <TextField
//     //                     label="Bonus disclaimer text"
//     //                     multiline={4}
//     //                     autoComplete="off"
//     //                   />
//     //                 </BlockStack>
//     //               </BlockStack>
//     //             </Collapsible>
//     //           </BlockStack>
//     //         </Card>
//     //       </div>
//     //     );
//     const addCart = (
//       <div>
//         <Card sectioned>
//           <BlockStack gap="500">
//             <div className="arrow-sign">
//               <BlockStack gap={200}>
//                 <div
//                   onClick={() => handleToggle("addCart")}
//                   style={{ display: "inline-block", cursor: "pointer" }}
//                 >
//                   <div style={{ float: "left" }}>
//                     <Text variant="headingSm" as="h6">
//                       <InlineStack gap={300}>
//                         Pop-up on Add to Cart button
//                         {formData.rules.popup_cart.status === "Active" ? (
//                           <Badge tone="success">Active</Badge>
//                         ) : (
//                           <Badge>Inactive</Badge>
//                         )}
//                       </InlineStack>
//                     </Text>
//                   </div>
//                   <div style={{ float: "right" }}>
//                     <InlineStack>
//                       {openStates.addCart ? (
//                         <> </>
//                       ) : (
//                         <div style={{ marginTop: "2px" }}>
//                           <Text variant="bodySm" as="p">
//                             Show settings
//                           </Text>
//                         </div>
//                       )}
//                       <Icon source={ChevronDownIcon} tone="base" />
//                     </InlineStack>
//                   </div>
//                 </div>
//                 <Text variant="bodySm" as="p">
//                   Remind customers about this offer, if they missed the Classic
//                   widget on the product page.
//                   <Link href="#">
//                     <Text variant="headingSm" as="h5">
//                       Preview
//                     </Text>
//                   </Link>
//                 </Text>
//               </BlockStack>
//             </div>

//             <Collapsible
//               open={openStates.addCart}
//               id="basic-collapsible"
//               transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
//               expandOnPrint
//             >
//               <BlockStack gap="400">
//                 <Select
//                   label="Status"
//                   options={informative_Status_options}
//                   onChange={(e) => {
//                     handleChange(e, "popup_cart", "status");
//                   }}
//                   value={formData.rules.popup_cart.status}
//                 />
//                 <TextField
//                   label="Pop-up title"
//                   onChange={(e) => {
//                     handleChange(e, "popup_cart", "title");
//                   }}
//                   value={formData.rules.popup_cart.title}
//                   autoComplete="off"
//                 />
//                 <TextField
//                   label="Button text"
//                   onChange={(e) => {
//                     handleChange(e, "popup_cart", "text");
//                   }}
//                   value={formData.rules.popup_cart.text}
//                   autoComplete="off"
//                 />

//                 <Divider />

//                 <Text variant="headingSm" as="h6">
//                   Appearance
//                 </Text>
//                 <Text variant="headingSm" as="h6">
//                   Overlay
//                 </Text>
//                 <Grid>
//                   <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
//                     <div className="color_section">
//                       <TextField
//                         label="Background"
//                         type="text"
//                         onChange={(e) => {
//                           handleChange(e, "popup_cart", "overlay_bgColor");
//                         }}
//                         value={formData.rules.popup_cart.overlay_bgColor}
//                         autoComplete="off"
//                         connectedLeft={
//                           <input
//                             type="color"
//                             style={{
//                               boxShadow:
//                                 formData.rules.popup_cart.overlay_bgColor ===
//                                 "#ffffff"
//                                   ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
//                                   : "none",
//                               width:
//                                 formData.rules.popup_cart.overlay_bgColor ===
//                                 "#ffffff"
//                                   ? "34px"
//                                   : "38px",
//                               height:
//                                 formData.rules.popup_cart.overlay_bgColor ===
//                                 "#ffffff"
//                                   ? "34px"
//                                   : "38px",
//                             }}
//                             value={formData.rules.popup_cart.overlay_bgColor}
//                             onChange={(e) =>
//                               handleColorChange(
//                                 e,
//                                 "overlay_bgColor",
//                                 "popup_cart",
//                                 "overlay_bgColor",
//                               )
//                             }
//                           />
//                         }
//                       />
//                     </div>
//                   </Grid.Cell>
//                   <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
//                     <div className="color_section">
//                       <TextField
//                         label="Text"
//                         type="text"
//                         onChange={(e) => {
//                           handleChange(e, "popup_cart", "overlay_textColor");
//                         }}
//                         value={formData.rules.popup_cart.overlay_textColor}
//                         autoComplete="off"
//                         connectedLeft={
//                           <input
//                             style={{
//                               boxShadow:
//                                 formData.rules.popup_cart.overlay_textColor ===
//                                 "#ffffff"
//                                   ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
//                                   : "none",
//                               width:
//                                 formData.rules.popup_cart.overlay_textColor ===
//                                 "#ffffff"
//                                   ? "34px"
//                                   : "38px",
//                               height:
//                                 formData.rules.popup_cart.overlay_textColor ===
//                                 "#ffffff"
//                                   ? "34px"
//                                   : "38px",
//                             }}
//                             type="color"
//                             value={formData.rules.popup_cart.overlay_textColor}
//                             onChange={(e) =>
//                               handleColorChange(
//                                 e,
//                                 "overlay_textColor",
//                                 "popup_cart",
//                                 "overlay_textColor",
//                               )
//                             }
//                           />
//                         }
//                       />
//                     </div>
//                   </Grid.Cell>
//                 </Grid>
//                 <Text variant="headingSm" as="h6">
//                   Button
//                 </Text>
//                 <Grid>
//                   <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
//                     <div className="color_section">
//                       <TextField
//                         label="Background"
//                         type="text"
//                         onChange={(e) => {
//                           handleChange(e, "popup_cart", "button_bgColor");
//                         }}
//                         value={formData.rules.popup_cart.button_bgColor}
//                         autoComplete="off"
//                         connectedLeft={
//                           <input
//                             type="color"
//                             style={{
//                               boxShadow:
//                                 formData.rules.popup_cart.button_bgColor ===
//                                 "#ffffff"
//                                   ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
//                                   : "none",
//                               width:
//                                 formData.rules.popup_cart.button_bgColor ===
//                                 "#ffffff"
//                                   ? "34px"
//                                   : "38px",
//                               height:
//                                 formData.rules.popup_cart.button_bgColor ===
//                                 "#ffffff"
//                                   ? "34px"
//                                   : "38px",
//                             }}
//                             value={formData.rules.popup_cart.button_bgColor}
//                             onChange={(e) =>
//                               handleColorChange(
//                                 e,
//                                 "button_bgColor",
//                                 "popup_cart",
//                                 "button_bgColor",
//                               )
//                             }
//                           />
//                         }
//                       />
//                     </div>
//                   </Grid.Cell>
//                   <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
//                     <div className="color_section">
//                       <TextField
//                         label="Text"
//                         type="text"
//                         onChange={(e) => {
//                           handleChange(e, "popup_cart", "button_textColor");
//                         }}
//                         value={formData.rules.popup_cart.button_textColor}
//                         autoComplete="off"
//                         connectedLeft={
//                           <input
//                             type="color"
//                             style={{
//                               boxShadow:
//                                 formData.rules.popup_cart.button_textColor ===
//                                 "#ffffff"
//                                   ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
//                                   : "none",
//                               width:
//                                 formData.rules.popup_cart.button_textColor ===
//                                 "#ffffff"
//                                   ? "34px"
//                                   : "38px",
//                               height:
//                                 formData.rules.popup_cart.button_textColor ===
//                                 "#ffffff"
//                                   ? "34px"
//                                   : "38px",
//                             }}
//                             value={formData.rules.popup_cart.button_textColor}
//                             onChange={(e) =>
//                               handleColorChange(
//                                 e,
//                                 "button_textColor",
//                                 "popup_cart",
//                                 "button_textColor",
//                               )
//                             }
//                           />
//                         }
//                       />
//                     </div>
//                   </Grid.Cell>
//                 </Grid>
//                 <Text variant="headingSm" as="h6">
//                   Variant selector
//                 </Text>
//                 <Grid>
//                   <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
//                     <div className="color_section">
//                       <TextField
//                         label="Background"
//                         type="text"
//                         onChange={(e) => {
//                           handleChange(e, "popup_cart", "variant_bgColor");
//                         }}
//                         value={formData.rules.popup_cart.variant_bgColor}
//                         autoComplete="off"
//                         connectedLeft={
//                           <input
//                             type="color"
//                             style={{
//                               boxShadow:
//                                 formData.rules.popup_cart.variant_bgColor ===
//                                 "#ffffff"
//                                   ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
//                                   : "none",
//                               width:
//                                 formData.rules.popup_cart.variant_bgColor ===
//                                 "#ffffff"
//                                   ? "34px"
//                                   : "38px",
//                               height:
//                                 formData.rules.popup_cart.variant_bgColor ===
//                                 "#ffffff"
//                                   ? "34px"
//                                   : "38px",
//                             }}
//                             value={formData.rules.popup_cart.variant_bgColor}
//                             onChange={(e) =>
//                               handleColorChange(
//                                 e,
//                                 "variant_bgColor",
//                                 "popup_cart",
//                                 "variant_bgColor",
//                               )
//                             }
//                           />
//                         }
//                       />
//                     </div>
//                   </Grid.Cell>
//                   <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
//                     <div className="color_section">
//                       <TextField
//                         label="Text"
//                         type="text"
//                         onChange={(e) => {
//                           handleChange(e, "popup_cart", " variant_textColor");
//                         }}
//                         value={formData.rules.popup_cart.variant_textColor}
//                         autoComplete="off"
//                         connectedLeft={
//                           <input
//                             type="color"
//                             style={{
//                               boxShadow:
//                                 formData.rules.popup_cart.variant_textColor ===
//                                 "#ffffff"
//                                   ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
//                                   : "none",
//                               width:
//                                 formData.rules.popup_cart.variant_textColor ===
//                                 "#ffffff"
//                                   ? "34px"
//                                   : "38px",
//                               height:
//                                 formData.rules.popup_cart.variant_textColor ===
//                                 "#ffffff"
//                                   ? "34px"
//                                   : "38px",
//                             }}
//                             value={formData.rules.popup_cart.variant_textColor}
//                             onChange={(e) =>
//                               handleColorChange(
//                                 e,
//                                 "variant_textColor",
//                                 "popup_cart",
//                                 "variant_textColor",
//                               )
//                             }
//                           />
//                         }
//                       />
//                     </div>
//                   </Grid.Cell>
//                 </Grid>
//               </BlockStack>
//             </Collapsible>
//           </BlockStack>
//         </Card>
//       </div>
//     );

//     const ApperanceDataTab = (
//       <div style={{ padding: "10px" }} className="SettingsDataTab_container">
//         <BlockStack gap={500}>
//           <div className="upper_section">
//             <Layout>
//               <Layout.Section variant="oneThird"></Layout.Section>
//               <Layout.Section variant="oneThird">{Productpage}</Layout.Section>
//               <Layout.Section variant="oneThird">{CartPage}</Layout.Section>
//               {/* <Layout.Section variant="oneThird">{ThankuPage}</Layout.Section> */}
//               <Layout.Section variant="oneThird">{addCart}</Layout.Section>
//             </Layout>
//           </div>
//         </BlockStack>
//       </div>
//     );

//     return (
//       <div className="aios_layout_spacer">
//         <Layout>
//           <Layout.Section variant="oneHalf">
//             <Layout>
//               <Layout.Section>{ApperanceDataTab}</Layout.Section>
//             </Layout>
//           </Layout.Section>
//           <Layout.Section variant="oneHalf">{leftPreviewLayout}</Layout.Section>
//         </Layout>
//         <PageActions
//           primaryAction={{
//             content: "Continue to Review",
//             onClick: handleContinueClick,
//           }}
//         />
//       </div>
//     );
//   };

  // const ReviewsLayout = () => {
  //   const options = [
  //     { label: "Draft", value: "Draft" },
  //     { label: "Active", value: "Active" },
  //   ];
  //   return (
  //     <div className="aios_layout_spacer">
  //       <Layout>
  //         <Layout.Section>
  //           <Layout>
  //             <Layout.Section>
  //               <Layout>
  //                 <Layout.Section variant="oneThird">
  //                   <Card>
  //                     <InlineStack wrap={false} align="space-between">
  //                       <Text variant="headingSm" as="h6">
  //                         Products
  //                       </Text>
  //                       <div>
  //                         <Button
  //                           variant="plain"
  //                           onClick={() => handleTab(1)}
  //                           icon={EditIcon}
  //                         />
  //                       </div>
  //                     </InlineStack>
  //                     <Text variant="bodySm" as="p">
  //                       Customer buys: {getCustomerBuysText()}
  //                     </Text>
  //                     Customer gets: {getCustomerGetsText()}
  //                   </Card>
  //                 </Layout.Section>
  //                 <Layout.Section>
  //                   <Card>
  //                     <InlineStack wrap={false} align="space-between">
  //                       <Text variant="headingSm" as="h6">
  //                         Discount details
  //                       </Text>
  //                       <div>
  //                         <Button
  //                           variant="plain"
  //                           onClick={() => handleTab(2)}
  //                           icon={EditIcon}
  //                         />
  //                       </div>
  //                     </InlineStack>
  //                     {formData?.rules?.discount?.discount_amount}
  //                     {formData?.rules?.discount?.discount_symbol} Discount
  //                   </Card>
  //                 </Layout.Section>
  //                 <Layout.Section>
  //                   <Card>
  //                     <InlineStack wrap={false} align="space-between">
  //                       <Text variant="headingSm" as="h6">
  //                         Placements & Appearance
  //                       </Text>
  //                       <div>
  //                         <Button
  //                           variant="plain"
  //                           onClick={() => handleTab(3)}
  //                           icon={EditIcon}
  //                         />
  //                       </div>
  //                     </InlineStack>
  //                     <Box
  //                       background="bg-surface"
  //                       borderColor="border"
  //                       borderWidth="025"
  //                       borderRadius="100"
  //                     >
  //                       <a>
  //                         <div className="aios_placements_reviews">
  //                           <BlockStack gap="500">
  //                             <InlineStack wrap={false} align="space-between">
  //                               <Text variant="bodyMd" as="p">
  //                                 BOGO on Product Page
  //                               </Text>
  //                               <div>
  //                                 <Badge tone="success">Active</Badge>
  //                               </div>
  //                             </InlineStack>
  //                           </BlockStack>
  //                         </div>
  //                       </a>
  //                     </Box>
  //                     <Box
  //                       background="bg-surface"
  //                       borderColor="border"
  //                       borderWidth="025"
  //                       borderRadius="100"
  //                     >
  //                       <a>
  //                         <div className="aios_placements_reviews">
  //                           <BlockStack gap="500">
  //                             <InlineStack wrap={false} align="space-between">
  //                               <Text variant="bodyMd" as="p">
  //                                 Cart Suggestion on Cart page Success
  //                               </Text>
  //                               <div>
  //                                 <Badge tone="success">Active</Badge>
  //                               </div>
  //                             </InlineStack>
  //                           </BlockStack>
  //                         </div>
  //                       </a>
  //                     </Box>
  //                     <Box
  //                       background="bg-surface"
  //                       borderColor="border"
  //                       borderWidth="025"
  //                       borderRadius="100"
  //                     >
  //                       <a>
  //                         <div className="aios_placements_reviews">
  //                           <BlockStack gap="500">
  //                             <InlineStack wrap={false} align="space-between">
  //                               <Text variant="bodyMd" as="p">
  //                                 Post Purchase on Thank you page
  //                               </Text>
  //                               <div>
  //                                 <Badge tone="success">Active</Badge>
  //                               </div>
  //                             </InlineStack>
  //                           </BlockStack>
  //                         </div>
  //                       </a>
  //                     </Box>
  //                     <Box
  //                       background="bg-surface"
  //                       borderColor="border"
  //                       borderWidth="025"
  //                       borderRadius="100"
  //                     >
  //                       <a>
  //                         <div className="aios_placements_reviews">
  //                           <BlockStack gap="500">
  //                             <InlineStack wrap={false} align="space-between">
  //                               <Text variant="bodyMd" as="p">
  //                                 Pop-up on Add to Cart button
  //                               </Text>
  //                               <div>
  //                                 <Badge tone="success">Inactive</Badge>
  //                               </div>
  //                             </InlineStack>
  //                           </BlockStack>
  //                         </div>
  //                       </a>
  //                     </Box>
  //                   </Card>
  //                 </Layout.Section>
  //               </Layout>
  //             </Layout.Section>
  //           </Layout>
  //         </Layout.Section>
  //         <Layout.Section variant="oneThird">
  //           <Layout>
  //             <Layout.Section>
  //               <Card>
  //                 <Text variant="headingMd" as="h6">
  //                   Offer status
  //                 </Text>
  //                 <Select
  //                   options={options}
  //                   value={formData.offer_status}
  //                   onChange={(value) => handleChange(value, "offer_status")}
  //                 />
  //               </Card>
  //             </Layout.Section>
  //             <Layout.Section variant="oneThird">
  //               <Card>
  //                 <Text variant="headingMd" as="h6">
  //                   Internal name
  //                 </Text>
  //                 <TextField
  //                   onChange={(e) => handleChange(e, "internal_name")}
  //                   value={formData.internal_name}
  //                   autoComplete="off"
  //                 />
  //               </Card>
  //             </Layout.Section>
  //             <Layout.Section variant="oneThird">
  //               <Card>
  //                 <Text variant="headingMd" as="h6">
  //                   Cart Label
  //                 </Text>
  //                 <TextField
  //                   onChange={(e) => handleChange(e, "cart_label")}
  //                   value={formData.cart_label}
  //                   helpText="Customize the text that shows up near the discount on the Cart page."
  //                   autoComplete="off"
  //                 />
  //               </Card>
  //             </Layout.Section>
  //           </Layout>
  //         </Layout.Section>
  //       </Layout>
  //       <PageActions
  //         primaryAction={{
  //           content: "Continue to Appearance",
  //           onClick: handleContinueClick,
  //         }}
  //         secondaryActions={<Button onClick={handleSave}>Save</Button>}
  //       />
  //     </div>
  //   );
  // };
  const handleDiscard = () => { 
    setFormData(lastSavedData);
     toggleModal();
  };

  return (
    <Page>
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
                  Products in the offer
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
                <div className="aios-upsell_step_heading">Discount</div>
                <div className="aios-upsell_step_sub_title">
                  Discount types & amounts
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
                <div className="aios-upsell_step_heading">Appearance</div>
                <div className="aios-upsell_step_sub_title">
                  Where & how to display
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
                <div className="aios-upsell_step_heading">Review Order</div>
                <div className="aios-upsell_step_sub_title">
                  Review the products
                </div>
              </BlockStack>
            </InlineStack>
          </a>
        </InlineGrid>
      </Box>

      {activeTab === 1 && (
        <div>
          {type === "bogo" && <AllCustomer getCollections={getCollections} buyCollections ={buyCollections} getProduct={getProduct} buyProduct={buyProduct}   selectProduct={selectProduct} selectCollection={selectCollection}  handleContinueClick={handleContinueClick}  leftPreviewLayout={leftPreviewLayout} handleDelete={handleDelete}  handleChange={handleChange} formData={formData}  handleCollectionDelete={handleCollectionDelete}/>}
          {/* {type === "other" && <AllCustomer />} */}
        </div>
      )}
      {activeTab === 2 && (
        <div>
          {type === "bogo" && (
            <Discount
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
      {activeTab === 3 && <div>{type === "bogo" && <Appearance openStates ={openStates } handleToggle={handleToggle} leftPreviewLayout={leftPreviewLayout}handleContinueClick={handleContinueClick} handleChange={handleChange} formData={formData}  handleColorChange={handleColorChange}/>}</div>}
      {activeTab === 4 && (
        <div>
          {type === "bogo" && (
            <ReviewsLayout  handleTab ={handleTab} handleSave={handleSave} getCollections={getCollections} buyCollections ={buyCollections} getProduct={getProduct} buyProduct={buyProduct}handleChange={handleChange} formData={formData} />
          )}
        </div>
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

export default BuilderCreate;
