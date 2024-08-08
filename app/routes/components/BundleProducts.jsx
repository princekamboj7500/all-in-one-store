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
import {
  
  SearchIcon,
  DeleteIcon,

 
} from "@shopify/polaris-icons";
const BundleProducts = ({
  formData,
  handleChange,
  handleFocus,
  handleColorChange,
  leftPreviewLayout,
  handleContinueClick,
  handleDelete,
  selectProduct,
  product,
}) => {
 
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
                    checked={formData.rules.customer_buy.chosen_type === "any"}
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
                    <InlineStack wrap={false} gap="200">
                      <div style={{ width: "100%" }}>
                        <TextField
                          placeholder="Search Products or Collections"
                          type="text"
                          prefix={<Icon source={SearchIcon} tone="base" />}
                          autoComplete="off"
                        />
                      </div>
                      <Button onClick={() => selectProduct("customer_buy")}>
                        Browse
                      </Button>
                    </InlineStack>
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
                  {formData.rules.customer_buy.chosen_type === "specific" &&
                  product.length === 0 ? (
                    <InlineError
                      message="A product or collection selection is required"
                      fieldID="myFieldID"
                    />
                  ) : (
                    <BlockStack gap="200">
                       <Text as="p" fontWeight="bold">
                        You have selected one product
                      </Text>
                      {product.length > 0 &&
                        product.map((index, item) => {
                          return (
                            <div className="upsell_products_bundles_list" key={index}>
                              <Box >
                                <InlineStack  wrap={false}align="space-between">
                                <Box padding="200" >
                                <InlineStack align="space-between">
                                  <Thumbnail
                                    source={item.productImage}
                                    alt={item.productTitle}
                                  />
                                  <Text variant="bodySm" as="p">{item.productTitle}</Text>
                                  </InlineStack>
                                  <Button icon={DeleteIcon} accessibilityLabel="Add theme" />
                                   </Box>
                                </InlineStack>
                              </Box>
                            </div>
                          );
                        })}
                    </BlockStack>
                  )}
                </BlockStack>
              </Card>
            </Layout.Section>
            <Layout.Section>
              <Card>
                <BlockStack gap={300} inlineAlign="start">
                  <BlockStack gap={200}>
                    <Text variant="headingMd" as="h6" fontWeight="semibold">
                      Customer gets
                    </Text>
                    <BlockStack>
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
                        label="Same collection"
                        id="same-collection-slotB"
                        name="products-slotB"
                        checked={
                          formData.rules.customer_get.chosen_type === "specific"
                        }
                        onChange={(e) =>
                          handleChange(
                            "specific",
                            "customer_get",
                            "chosen_type",
                          )
                        }
                      />
                    </BlockStack>

                    <BlockStack gap={200}>
                      {formData.rules.customer_get.chosen_type ===
                      "specific" ? (
                        <InlineStack wrap={false} gap="200">
                          <div>
                            <TextField
                              placeholder="Search Products or Collections"
                              type="text"
                              prefix={<Icon source={SearchIcon} tone="base" />}
                              autoComplete="off"
                            />
                          </div>
                          <Button onClick={() => selectProduct("customer_get")}>
                            Browse
                          </Button>
                        </InlineStack>
                      ) : (
                        ""
                      )}

                      <TextField
                        label="Quantity"
                        type="number"
                        onChange={(e) => handleChange(e, "customer_get", "qty")}
                        autoComplete="off"
                        value={formData.rules.customer_get.qty}
                        // onChange={(e) => handleChange(e, "get_quantity")}
                      />
                    </BlockStack>
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
          <Button onClick={handleDelete} variant="primary" tone="critical">
            Delete
          </Button>
        }
      />
    </>
  );
};

export default BundleProducts;
