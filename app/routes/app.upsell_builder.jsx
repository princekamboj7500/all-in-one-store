import {
  BlockStack,
  Button,
  Banner,
  ButtonGroup,
  ResourceItem,
  ResourceList,
  Avatar,
  Spinner,
  Badge,
  DatePicker,
  Card,
  EmptySearchResult,
  IndexTable,
  Text,
  ChoiceList,
  useIndexResourceState,
  OptionList,
  Page,
  TextField,
  useBreakpoints,
  Scrollable,
  Select,
  ContextualSaveBar,
  InlineGrid,
  Listbox,
  Tabs,
  Box,
  Filters,
  Layout,
  Toast,
  Grid,
  Frame,
  InlineStack,
  Link,
  Popover,
  ActionList,
  Icon,
  Thumbnail,
  Checkbox,
  Divider,
} from "@shopify/polaris";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  ViewIcon,
  ImageIcon,
  ImportIcon,
  StarIcon,
  SearchIcon,
  CalendarIcon,
  ExportIcon,
  ArrowDownIcon,
  DeleteIcon,
} from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import { useNavigate, useLoaderData, useLocation } from "@remix-run/react";
import DeactivatePopover from "./components/DeactivatePopover";
import "./assets/style.css";
import { product_bundle, bogo } from "./assets";
import DiscardModal from "./components/DiscardModal";
import db from "../db.server";
import {
  LineChart,
  Line,
  XAxis,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const shopName = session.shop;

  const response = await admin.graphql(`query {
            currentAppInstallation {
              id
              metafields(first: 40) {
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
    app_name: "UpsellBuilder",
    app_status: false,
    discount: true,
    variantbgcolor: "#ffffff",
    variantactivebgcolor: "#f6f6f6",
    varianttextcolor: "#f4f4f4",
    show_compare_price: true,
    desktop_margin_top: 10,
    desktop_margin_bottom: 16,
    mobile_margin_top: 10,
    mobile_margin_bottom: 16,
    translation_you_save: "You save:",
    translation_stock: "Out of stock",
    translation_item: "This item:",
    translation_total_price: "Total Price:",
    translation_cart: "Add to cart",
    translation_for: "for",
    translation_with: "with",
    translation_off: "Off",
    translation_each: "each",
    translation_buy: "Buy",
    translation_subtotal: "Subtotal",
    translation_discount: "Discount",
    translation_price: "Old price",
    translation_quantity: "Quantity",
    translation_and: "and",
    translation_charge: "Free of charge",
    translation_free: "Free",
    translation_claim: "Claim gift",
    translation_gift: "Gift",
    translation_msg: "Your product has been added to the cart.",
    translation_save: "save",
    translation_per_item: "Per item:",
    translation_swap: "Swap item",
    translation_see: "See more",
    translation_less: "See less",
  };

  const appName =
    metafielData.length > 0
      ? metafielData.filter((item) => item.node.namespace === "UpsellBuilder")
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

  const totalReviews = await db.Reviews.count({
    where: {
      store_name: session.shop,
    },
  });

  const publishReviews = await db.Reviews.count({
    where: {
      status: "Published",
      store_name: session.shop,
    },
  });
  const reviews = await db.Reviews.findMany({
    where: {
      store_name: session.shop,
    },
  });
  const productStats = reviews.reduce((acc, product) => {
    const { product_id, rating } = product;
    const ratingNumber = parseFloat(rating);

    if (!isNaN(ratingNumber)) {
      if (acc[product_id]) {
        acc[product_id].count++;
        acc[product_id].totalRating += ratingNumber;
        acc[product_id].averageRating =
          acc[product_id].totalRating / acc[product_id].count;
      } else {
        acc[product_id] = {
          ...product,
          count: 1,
          totalRating: ratingNumber,
          averageRating: ratingNumber,
        };
      }
    }
    return acc;
  }, {});
  const productReviews = Object.values(productStats);
  let averageRating;
  if (reviews.length > 0) {
    const ratings = reviews.map((review) => parseFloat(review.rating));
    const validRatings = ratings.filter((rating) => !isNaN(rating));
    const roundedAverageRating =
      validRatings.reduce((sum, rating) => sum + rating, 0) /
      validRatings.length;

    averageRating = roundedAverageRating.toFixed(2);
  } else {
    averageRating = 0;
  }
  // Analytics Data

  const analyticsData = await db.ReviewAnalytics.findFirst({
    where: {
      store_name: session.shop,
    },
  });
  const collectionData = await db.Reviews.findMany({
    where: {
      store_name: session.shop,
    },
    select: {
      createdAt: true,
    },
  });

  const getUpsells = await db.UpsellBuilder.findMany({
    where: {
      store: session.shop,
    },
  });

  return {
    data,
    getUpsells,
    shopName,
    totalReviews,
    publishReviews,
    averageRating,
    productReviews,
    analyticsData,
    collectionData,
  };
};

export function GeneralSettings({
  data,
  handleChange,
  handleColorChange,
  handleFocus,
}) {
  return (
    <div className="SettingsDataTab_container">
      <BlockStack gap="400">
        <InlineGrid columns={["oneThird", "twoThirds"]}>
          <Text variant="headingMd" as="h6">
            Combine discount
          </Text>
          <Layout>
            <Layout.Section>
              <Card roundedAbove="sm">
                <BlockStack gap="300">
                  <div className="checkbox_section">
                    <BlockStack gap="400">
                      <Checkbox
                        checked={data.discount}
                        onChange={(e) => {
                          handleFocus("discount");
                          handleChange(e, "discount");
                        }}
                        label="Allow customers to combine the  All-In-One Store discounts with other discount codes"
                        helpText="Only combinable discounts can be used together. Some combinations, such as multiple discounts on the same product"
                      />
                    </BlockStack>
                  </div>
                </BlockStack>
              </Card>
            </Layout.Section>
          </Layout>
        </InlineGrid>
        <InlineGrid columns={["oneThird", "twoThirds"]}>
          <Text variant="headingMd" as="h6">
            Look and Feel
          </Text>
          <Layout>
            <Layout.Section>
              <Card roundedAbove="sm">
                <BlockStack gap="300">
                  <div className="checkbox_section">
                    <BlockStack gap="400">
                      <div className="color_section">
                        <TextField
                          label="Variant selector background color"
                          type="text"
                          onChange={(e) => {
                            handleFocus("variantbgcolor");
                            handleChange(e, "variantbgcolor");
                          }}
                          value={data.variantbgcolor}
                          autoComplete="off"
                          connectedLeft={
                            <input
                              type="color"
                              style={{
                                boxShadow:
                                  data.variantbgcolor === "#ffffff"
                                    ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                                    : "none",
                                width:
                                  data.variantbgcolor === "#ffffff"
                                    ? "34px"
                                    : "38px",
                                height:
                                  data.variantbgcolor === "#ffffff"
                                    ? "34px"
                                    : "38px",
                              }}
                              value={data.variantbgcolor}
                              onChange={(e) => {
                                handleFocus("variantbgcolor");
                                handleColorChange(e, "variantbgcolor");
                              }}
                            />
                          }
                        />
                      </div>
                      <div className="color_section">
                        <TextField
                          label="Variant selector active background color"
                          type="text"
                          onChange={(e) => {
                            handleFocus("variantactivebgcolor");
                            handleChange(e, "variantactivebgcolor");
                          }}
                          value={data.variantactivebgcolor}
                          autoComplete="off"
                          connectedLeft={
                            <input
                              type="color"
                              value={data.variantactivebgcolor}
                              onChange={(e) => {
                                handleFocus("variantactivebgcolor");
                                handleColorChange(e, "variantactivebgcolor");
                              }}
                              style={{
                                boxShadow:
                                  data.variantactivebgcolor === "#ffffff"
                                    ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                                    : "none",
                                width:
                                  data.variantactivebgcolor === "#ffffff"
                                    ? "34px"
                                    : "38px",
                                height:
                                  data.variantactivebgcolor === "#ffffff"
                                    ? "34px"
                                    : "38px",
                              }}
                            />
                          }
                        />
                      </div>
                      <div className="color_section">
                        <TextField
                          label="Variant selector text color"
                          type="text"
                          onChange={(e) => {
                            handleFocus("varianttextcolor");
                            handleChange(e, "varianttextcolor");
                          }}
                          value={data.varianttextcolor}
                          autoComplete="off"
                          connectedLeft={
                            <input
                              type="color"
                              value={data.varianttextcolor}
                              onChange={(e) => {
                                handleFocus("varianttextcolor");
                                handleColorChange(e, "varianttextcolor");
                              }}
                              style={{
                                boxShadow:
                                  data.varianttextcolor === "#ffffff"
                                    ? "inset 0 0 0 1px rgba(0, 0, 0, .19)"
                                    : "none",
                                width:
                                  data.varianttextcolor === "#ffffff"
                                    ? "34px"
                                    : "38px",
                                height:
                                  data.varianttextcolor === "#ffffff"
                                    ? "34px"
                                    : "38px",
                              }}
                            />
                          }
                        />
                      </div>
                      <Checkbox
                        checked={data.show_compare_price}
                        onChange={(e) => {
                          handleFocus("show_compare_price");
                          handleChange(e, "show_compare_price");
                        }}
                        label="Show the Compare-at price next to the Current price"
                        helpText="Only combinable discounts can be used together. Some combinations, such as multiple discounts on the same product"
                      />
                      <Divider />
                      <Text variant="bodyLg" as="p">
                        Volume Discounts
                      </Text>
                      <BlockStack gap="200">
                        <Box
                          background="bg-surface-secondary"
                          padding="300"
                          borderRadius="200"
                        >
                          <BlockStack gap="200">
                            <Text
                              variant="headingMd"
                              as="h6"
                              fontWeight="regular"
                            >
                              On desktop
                            </Text>
                            <InlineGrid
                              columns={{
                                sm: "2",
                              }}
                              gap={300}
                            >
                              <TextField
                                type="number"
                                onChange={(e) => {
                                  handleFocus("desktop_margin_top");
                                  handleChange(e, "desktop_margin_top");
                                }}
                                value={data.desktop_margin_top}
                                label={`Margin top`}
                              />
                              <TextField
                                type="number"
                                onChange={(e) => {
                                  handleFocus("desktop_margin_bottom");
                                  handleChange(e, "desktop_margin_bottom");
                                }}
                                value={data.desktop_margin_bottom}
                                label={`Margin bottom`}
                              />
                            </InlineGrid>
                          </BlockStack>
                        </Box>
                        <Box
                          background="bg-surface-secondary"
                          padding="300"
                          borderRadius="200"
                        >
                          <BlockStack gap="200">
                            <Text
                              variant="headingMd"
                              as="h6"
                              fontWeight="regular"
                            >
                              On Mobile
                            </Text>
                            <InlineGrid
                              columns={{
                                sm: "2",
                              }}
                              gap={300}
                            >
                              <TextField
                                type="number"
                                onChange={(e) => {
                                  handleFocus("mobile_margin_top");
                                  handleChange(e, "mobile_margin_top");
                                }}
                                value={data.mobile_margin_top}
                                label={`Margin top`}
                              />
                              <TextField
                                type="number"
                                onChange={(e) => {
                                  handleFocus("mobile_margin_bottom");
                                  handleChange(e, "mobile_margin_bottom");
                                }}
                                value={data.mobile_margin_bottom}
                                label={`Margin bottom`}
                              />
                            </InlineGrid>
                          </BlockStack>
                        </Box>
                      </BlockStack>
                    </BlockStack>
                  </div>
                </BlockStack>
              </Card>
            </Layout.Section>
            <Layout.Section>
              <Card roundedAbove="sm">
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h5">
                    Translations
                  </Text>
                  <div className="checkbox_section">
                    <BlockStack gap="400">
                      <TextField
                        label="You Save "
                        onChange={(e) => {
                          handleFocus("translation_you_save");
                          handleChange(e, "translation_you_save");
                        }}
                        value={data.translation_you_save}
                        autoComplete="off"
                      />
                      <TextField
                        label="Out of stock "
                        onChange={(e) => {
                          handleFocus("translation_stock");
                          handleChange(e, "translation_stock");
                        }}
                        value={data.translation_stock}
                        autoComplete="off"
                      />
                      <TextField
                        label="This Item "
                        onChange={(e) => {
                          handleFocus("translation_item");
                          handleChange(e, "translation_item");
                        }}
                        value={data.translation_item}
                        autoComplete="off"
                      />
                      <TextField
                        label="Total price "
                        onChange={(e) => {
                          handleFocus("translation_total_price");
                          handleChange(e, "translation_total_price");
                        }}
                        value={data.translation_total_price}
                        autoComplete="off"
                      />
                      <TextField
                        label="Add to cart "
                        onChange={(e) => {
                          handleFocus("translation_cart");
                          handleChange(e, "translation_cart");
                        }}
                        value={data.translation_cart}
                        autoComplete="off"
                      />
                      <TextField
                        label="For "
                        onChange={(e) => {
                          handleFocus("translation_for");
                          handleChange(e, "translation_for");
                        }}
                        value={data.translation_for}
                        autoComplete="off"
                      />
                      <TextField
                        label="With "
                        onChange={(e) => {
                          handleFocus("translation_with");
                          handleChange(e, "translation_with");
                        }}
                        value={data.translation_with}
                        autoComplete="off"
                      />
                      <TextField
                        label="Off "
                        onChange={(e) => {
                          handleFocus("translation_off");
                          handleChange(e, "translation_off");
                        }}
                        value={data.translation_off}
                        autoComplete="off"
                      />
                      <TextField
                        label="Each"
                        onChange={(e) => {
                          handleFocus("translation_each");
                          handleChange(e, "translation_each");
                        }}
                        value={data.translation_each}
                        autoComplete="off"
                      />
                      <TextField
                        label="Buy "
                        onChange={(e) => {
                          handleFocus("translation_buy");
                          handleChange(e, "translation_buy");
                        }}
                        value={data.translation_buy}
                        autoComplete="off"
                      />
                      <TextField
                        label="Subtotal "
                        onChange={(e) => {
                          handleFocus("translation_subtotal");
                          handleChange(e, "translation_subtotal");
                        }}
                        value={data.translation_subtotal}
                        autoComplete="off"
                      />
                      <TextField
                        label="Discount "
                        onChange={(e) => {
                          handleFocus("translation_discount");
                          handleChange(e, "translation_discount");
                        }}
                        value={data.translation_discount}
                        autoComplete="off"
                      />

                      <TextField
                        label="Old price "
                        onChange={(e) => {
                          handleFocus("translation_price");
                          handleChange(e, "translation_price");
                        }}
                        value={data.translation_price}
                        autoComplete="off"
                      />
                      <TextField
                        label="Quantity "
                        onChange={(e) => {
                          handleFocus("translation_quantity");
                          handleChange(e, "translation_quantity");
                        }}
                        value={data.translation_quantity}
                        autoComplete="off"
                      />
                      <TextField
                        label="And"
                        onChange={(e) => {
                          handleFocus("translation_and");
                          handleChange(e, "translation_and");
                        }}
                        value={data.translation_and}
                        autoComplete="off"
                      />
                      <TextField
                        label="Free of charge"
                        onChange={(e) => {
                          handleFocus("translation_charge");
                          handleChange(e, "translation_charge");
                        }}
                        value={data.translation_charge}
                        autoComplete="off"
                      />
                      <TextField
                        label="Free "
                        onChange={(e) => {
                          handleFocus("translation_free");
                          handleChange(e, "translation_free");
                        }}
                        value={data.translation_free}
                        autoComplete="off"
                      />
                      <TextField
                        label="Claim gift "
                        onChange={(e) => {
                          handleFocus("translation_claim");
                          handleChange(e, "translation_claim");
                        }}
                        value={data.translation_claim}
                        autoComplete="off"
                      />
                      <TextField
                        label="Gift "
                        onChange={(e) => {
                          handleFocus("translation_gift");
                          handleChange(e, "translation_gift");
                        }}
                        value={data.translation_gift}
                        autoComplete="off"
                      />
                      <TextField
                        label="Your product has been added to cartt "
                        onChange={(e) => {
                          handleFocus("translation_msg");
                          handleChange(e, "translation_msg");
                        }}
                        value={data.translation_msg}
                        autoComplete="off"
                      />
                      <TextField
                        label="Save "
                        onChange={(e) => {
                          handleFocus("translation_save");
                          handleChange(e, "translation_save");
                        }}
                        value={data.translation_save}
                        autoComplete="off"
                      />
                      <TextField
                        label="Per item "
                        onChange={(e) => {
                          handleFocus("translation_per_item");
                          handleChange(e, "translation_per_item");
                        }}
                        value={data.translation_per_item}
                        autoComplete="off"
                      />
                      <TextField
                        label="Swap item "
                        onChange={(e) => {
                          handleFocus("translation_swap");
                          handleChange(e, "translation_swap");
                        }}
                        value={data.translation_swap}
                        autoComplete="off"
                      />
                      <TextField
                        label="See more "
                        onChange={(e) => {
                          handleFocus("translation_see");
                          handleChange(e, "translation_see");
                        }}
                        value={data.translation_see}
                        autoComplete="off"
                      />
                      <TextField
                        label="See less "
                        onChange={(e) => {
                          handleFocus("translation_less");
                          handleChange(e, "translation_less");
                        }}
                        value={data.translation_less}
                        autoComplete="off"
                      />
                    </BlockStack>
                  </div>
                </BlockStack>
              </Card>
            </Layout.Section>
          </Layout>
        </InlineGrid>
      </BlockStack>
    </div>
  );
}

export   const Offers = ({data, handleCreate, handleUpsellBuilderClick, shopName}) => {
  const resourceName = {
    singular: "bundle",
    plural: "bundles",
  };
  const [upsellList, setUpsellList] = useState(data);
  const [queryValue, setQueryValue] = useState("");
  const [queryLoading, setQueryLoading] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [buttonLoader, setButtonLoader] = useState(false);
  const handleAvailabilityChange = useCallback(async (value) => {
    setAvailability(value);
   
    setQueryLoading(true);
    const payload = {
      action: "offer_types",
      type: value,
   
    };
    try {
      const response = await fetch(`/api/get-filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setUpsellList(data.data);
      setQueryLoading(false);
    } catch (error) {
      console.error("API call failed:", error);
    }
  }, []);

  const handleFiltersQueryChange = async(value) => {
    console.log("testingggg_____",value , queryValue);
    
    setQueryValue(value);
    
    try {
      // setButtonLoader(true);
      setQueryLoading(true);
      const response = await fetch(
        `/api/getfilter?type=${value}&from=upsell`,
      );
      const data = await response.json();
      if (data.success) {
        setUpsellList(data.data);
        setButtonLoader(false);
        setQueryLoading(false);
      } else {
        setUpsellList([]);
        setButtonLoader(false);
        setQueryLoading(false);
      }
    } catch (error) {
      setButtonLoader(false);
      setQueryLoading(false);
      console.error("Error fetching data:", error);
    }
  };
  const handleLinkClick = () => {
    shopify.loading(true);
  };
  const handleAvailabilityRemove = useCallback(() => {
    setAvailability([]);
    setFilteredReviews();
  }, []);


  useEffect(()=>{
    console.log("queryLoading" , queryLoading);
    
  },[queryLoading])

  const handleQueryValueRemove = useCallback(() => {
    setQueryValue("");
    setFilteredReviews();
  }, []);
  const handleFiltersClearAll = useCallback(() => {
    handleAvailabilityRemove();

    handleQueryValueRemove();
  }, [handleAvailabilityRemove, handleQueryValueRemove]);

  const handleAction = async (actionType, store) => {
    const selectedProductIds = selectedResources;
    setButtonLoader(true);
    setQueryLoading(true);
    const datasend = {
      offer_status: "Draft",
    };
    const data = {
      actionType,
      store: store,
      ids: selectedProductIds,
      data: datasend,
    };

    const response = await fetch("/api/upsell-save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    if (result.success) {
      setActive(true);
      setQueryLoading(false)
      setButtonLoader(false);
      setUpsellList(result.data);
      setMsgData(` ${actionType.toUpperCase()} Successfully`);
    } else {
      setButtonLoader(false);
      setActive(true);
      setUpsellList(data);
      setQueryLoading(false)
      setError(true);
      setMsgData("There is some error while update");
    }
  };

  const bulkActions = [
    {
      content: "Activate",
      loading: queryLoading,
      onAction: () => handleAction("activated", shopName),
    },
    {
      content: "Deactivate",
      loading: queryLoading,
      onAction: () => handleAction("deactivated", shopName),
    },
    {
      icon: DeleteIcon,
      destructive: true,
      content: "Delete ",
      loading: queryLoading,
      onAction: () => handleAction("deleted", shopName),
    },
  ];
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(upsellList);

  const filters = [
    {
      key: "offertypes",
      label: "Offer Types",
      filter: (
        <ChoiceList
          title="Offer Types"
          titleHidden
          choices={[
            { label: "Product bundle", value: "Product bundle" },
            { label: "Volume Discount", value: "Volume Discount" },
            { label: "Buy X Get Y", value: "BOGO" },
          ]}
          selected={availability || []}
          onChange={handleAvailabilityChange}
          allowMultiple
        />
      ),
    },
  ];

  const appliedFilters = [];
  if (!isEmpty(availability)) {
    const key = "rating";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, availability),
      onRemove: handleAvailabilityRemove,
    });
  }  const emptyStateMarkup = (
    <EmptySearchResult
      title={"No upsells found"}
     
      withIllustration
    />
  );

  const rowMarkup = upsellList.map(
    ({ id, discount_type, internal_name, rules, offer_status }, index) => {
      let bundleName;
      if (discount_type === "BOGO") {
        bundleName = "XY";
      }
      const buy_products = rules.customer_buy.products;
      const get_products = rules.customer_get.products;
      const customerBuySelectType = rules.customer_buy.chosen_type;
      const customerGetSelectType = rules.customer_get.chosen_type;
      const renderCustomerBuyContent = () => {
        if (customerBuySelectType === "any") {
          return (
            <div className="upsell_buy_bundles">
              <div className="">AnyProduct</div>
            </div>
          );
        } else if (customerBuySelectType === "specific") {
          return (
            <div className="upsell_buy_bundles">
              <div className="">{buy_products.length} Products Selected</div>
            </div>
          );
        }
      };
      const renderCustomerGetContent = () => {
        if (customerGetSelectType === "any") {
          return (
            <div className="upsell_buy_bundles">
              <div className="">AnyProduct</div>
            </div>
          );
        } else if (customerGetSelectType === "specific") {
          return (
            <div className="upsell_buy_bundles">
              <div className="">{get_products.length} Products Selected</div>
            </div>
          );
        }
      };

      return (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            <Link
              removeUnderline
              monochrome
              dataPrimaryLink
              url={`/app/edit/bogo/${id}`}
              onClick={handleLinkClick}
            >
              <div className="aios_upsell_list_name">
                <div
                  className={`upsell_bundle_name ${offer_status === "Active" ? `upsell_active_bundle` : ""} `}
                >
                  <span className="upsell_bundle_name_type">
                    {bundleName}
                  </span>
                </div>
              </div>
            </Link>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <BlockStack gap="200">
              <InlineStack wrap="false" gap="200" blockAlign="center">
                <Text variant="headingMd" as="h5">
                  {internal_name}
                </Text>
                {offer_status === "Active" ? (
                  <Badge tone="warning">
                    -{rules?.discount?.discount_amount}
                    {rules?.discount?.discount_symbol}
                  </Badge>
                ) : (
                  <Badge>
                    -{rules?.discount?.discount_amount}
                    {rules?.discount?.discount_symbol}
                  </Badge>
                )}
              </InlineStack>
              <InlineStack wrap="false" gap="200" blockAlign="center">
                {renderCustomerBuyContent()} + {renderCustomerGetContent()}
              </InlineStack>
            </BlockStack>
          </IndexTable.Cell>
          <IndexTable.Cell>{}</IndexTable.Cell>
          <IndexTable.Cell>
            <Text as="span" alignment="end" numeric>
              {discount_type}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>{}</IndexTable.Cell>
          <IndexTable.Cell>{}</IndexTable.Cell>
        </IndexTable.Row>
      );
    },
  );

  return (
    <div className="upsell-Offers">
      <Card>
        {/* {upsellList.length > 0 ? ( */}
          <>
            <Filters
              queryValue={queryValue}
              queryPlaceholder="Search items"
              filters={filters}
              appliedFilters={appliedFilters}
              onQueryChange={handleFiltersQueryChange}
              onQueryClear={handleQueryValueRemove}
              onClearAll={handleFiltersClearAll}
              loading={queryLoading}
            />
            <Button variant="primary" onClick={handleCreate}>
              Create Offer
            </Button>
            <div className="upsell_search_bar">
              {/* <InlineStack
                wrap={false}
                blockAlign="center"
                gap="200"
                align="space-between"
              >
                <div className="search_filter" style={{ width: "88%" }}>
                  <TextField
                    type="text"
                    prefix={<Icon source={SearchIcon} tone="base" />}
                    autoComplete="off"
                  />
                </div>
                <Button variant="primary" onClick={handleCreate}>
                  Create Offer
                </Button>
              </InlineStack> */}
              <IndexTable
                resourceName={resourceName}
                itemCount={upsellList.length}
                selectedItemsCount={
                  allResourcesSelected ? "All" : selectedResources.length
                }
                emptyState={emptyStateMarkup}
                loading={queryLoading}
                onSelectionChange={handleSelectionChange}
                headings={[
                  { title: "" },
                  { title: "Name" },
                  { title: "Impressions" },
                  { title: "Clicks" },
                  { title: "Click Rate" },
                  { title: "Orders" },
                  { title: "Revenue" },
                ]}
                bulkActions={bulkActions}
              >
                {rowMarkup}
              </IndexTable>
            </div>
          </>
        {/* ) : (
          <div className="aios-upsell-grid">
            <Box borderColor="border" borderRadius="100" borderWidth="025">
              <Box padding="400">
                <Text variant="headingSm" as="h6" alignment="center">
                  Buy X, Get Y
                </Text>
              </Box>
              <Link url="/app/create/bogo" onClick={handleLinkClick}>
                <Box padding="400">
                  <img src={bogo} className="upsell_bundle_images" />
                </Box>
              </Link>
            </Box>
          </div>
        )} */}
      </Card>
      <Layout.Section>
        <Card roundedAbove="sm">
          <BlockStack gap="300">
            <Text variant="headingSm" as="h6" fontWeight="semibold">
              Publish and position
            </Text>

            <Box
              background="bg-surface-secondary"
              padding="200"
              borderRadius="200"
            >
              <BlockStack gap={200}>
                <Text variant="headingSm" as="h6" fontWeight="regular">
                  Display manually
                </Text>
                <Text
                  variant="headingSm"
                  as="p"
                  fontWeight="regular"
                  tone="subdued"
                >
                  Place the Reviews Carousel manually on your homepage or
                  other pages using the Shopify editor .
                </Text>
                <InlineStack align="start">
                  <ButtonGroup>
                    <Button
                      onClick={handleUpsellBuilderClick}
                      accessibilityLabel="Go to editor"
                    >
                      Go to Shopify Editor
                    </Button>
                  </ButtonGroup>
                </InlineStack>
              </BlockStack>
            </Box>
          </BlockStack>
        </Card>
      </Layout.Section>
    </div>
  );
  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
  function disambiguateLabel(key, value) {
    switch (key) {
      case "rating":
        return `Rating is  ${value}`;
      case "source":
        return `Source is is  ${value}`;
      // return value.map((val) => `Source is   ${val}`).join(", ");
      case "status":
        return `Status is  ${value}`;
      default:
        return value.toString();
    }
  }
};


export const AnalyticsDataTab = ({ data, reviews }) => {
  const [activeLine, setActiveLine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Impressionscount, setImpressionCount] = useState(0);
  const [Imagecount, setImagecount] = useState(0);
  const [Starcount, setStarcount] = useState(0);
  const [Reviewscount, setReviewscount] = useState(0);
  const [analyticsChartData, setanalyticsChartData] = useState([]);
  const { mdDown, lgUp } = useBreakpoints();
  const shouldShowMultiMonth = lgUp;
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const yesterday = new Date(
    new Date(new Date().setDate(today.getDate() - 1)).setHours(0, 0, 0, 0),
  );

  const [custom, setCustom] = useState(today);

  const todayDate = new Date();
  const firstDayOfCurrentMonth = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    1,
  );
  const lastDayOfLastMonth = new Date(firstDayOfCurrentMonth.setDate(0));
  const firstDayOfLastMonth = new Date(
    lastDayOfLastMonth.getFullYear(),
    lastDayOfLastMonth.getMonth(),
    1,
  );

  const currentYear = todayDate.getFullYear();
  const firstDayOfLastYear = new Date(currentYear - 1, 0, 1); // January 1st of last year
  const lastDayOfLastYear = new Date(currentYear - 1, 11, 31, 23, 59, 59, 999); // December 31st of last year

  const ranges = [
    {
      title: "Custom",
      alias: "custom",
      period: {
        since: today,
        until: today,
      },
    },
    {
      title: "Today",
      alias: "today",
      period: {
        since: today,
        until: today,
      },
    },
    {
      title: "Yesterday",
      alias: "yesterday",
      period: {
        since: yesterday,
        until: yesterday,
      },
    },
    {
      title: "Last 7 days",
      alias: "last7days",
      period: {
        since: new Date(
          new Date(new Date().setDate(today.getDate() - 7)).setHours(
            0,
            0,
            0,
            0,
          ),
        ),
        until: yesterday,
      },
    },
  ];
  const [popoverActive, setPopoverActive] = useState(false);
  const [activeDateRange, setActiveDateRange] = useState(ranges[0]);

  const [inputValues, setInputValues] = useState({});
  const [{ month, year }, setDate] = useState({
    month: activeDateRange.period.since.getMonth(),
    year: activeDateRange.period.since.getFullYear(),
  });

  const datePickerRef = useRef(null);
  const VALID_YYYY_MM_DD_DATE_REGEX = /^\d{4}-\d{1,2}-\d{1,2}/;
  function isDate(date) {
    return !isNaN(new Date(date).getDate());
  }
  function isValidYearMonthDayDateString(date) {
    return VALID_YYYY_MM_DD_DATE_REGEX.test(date) && isDate(date);
  }
  function isValidDate(date) {
    return date.length === 10 && isValidYearMonthDayDateString(date);
  }
  function parseYearMonthDayDateString(input) {
    const [year, month, day] = input.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  function formatDateToYearMonthDayDateString(date) {
    const year = String(date.getFullYear());
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    if (month.length < 2) {
      month = String(month).padStart(2, "0");
    }
    if (day.length < 2) {
      day = String(day).padStart(2, "0");
    }
    return [year, month, day].join("-");
  }
  function formatDate(date) {
    return formatDateToYearMonthDayDateString(date);
  }
  function nodeContainsDescendant(rootNode, descendant) {
    if (rootNode === descendant) {
      return true;
    }
    let parent = descendant.parentNode;
    while (parent != null) {
      if (parent === rootNode) {
        return true;
      }
      parent = parent.parentNode;
    }
    return false;
  }
  function isNodeWithinPopover(node) {
    return datePickerRef?.current
      ? nodeContainsDescendant(datePickerRef.current, node)
      : false;
  }
  function handleStartInputValueChange(value) {
    setInputValues((prevState) => {
      return { ...prevState, since: value };
    });

    if (isValidDate(value)) {
      const newSince = parseYearMonthDayDateString(value);
      setActiveDateRange((prevState) => {
        const newPeriod =
          prevState.period && newSince <= prevState.period.until
            ? { since: newSince, until: prevState.period.until }
            : { since: newSince, until: newSince };
        return {
          ...prevState,
          period: newPeriod,
        };
      });
    }
  }
  function handleEndInputValueChange(value) {
    setInputValues((prevState) => ({ ...prevState, until: value }));
    if (isValidDate(value)) {
      const newUntil = parseYearMonthDayDateString(value);
      setActiveDateRange((prevState) => {
        const newPeriod =
          prevState.period && newUntil >= prevState.period.since
            ? { since: prevState.period.since, until: newUntil }
            : { since: newUntil, until: newUntil };
        return {
          ...prevState,
          period: newPeriod,
        };
      });
    }
  }
  function handleInputBlur({ relatedTarget }) {
    const isRelatedTargetWithinPopover =
      relatedTarget != null && isNodeWithinPopover(relatedTarget);

    if (isRelatedTargetWithinPopover) {
      return;
    }
    setPopoverActive(false);
  }
  function handleMonthChange(month, year) {
    setDate({ month, year });
  }
  function handleCalendarChange({ start, end }) {
    const newDateRange = ranges.find((range) => {
      return (
        range.period.since.valueOf() === start.valueOf() &&
        range.period.until.valueOf() === end.valueOf()
      );
    }) || {
      alias: "custom",
      title: "Custom",
      period: {
        since: start,
        until: end,
      },
    };
    setActiveDateRange(newDateRange);
  }
  function generateDailyArray(startDate, endDate) {
    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      days.push({
        name: formatDate(currentDate),
        impressions: 0,
        imageClicks: 0,
        starRatingClicks: 0,
        collectedReviews: 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }
  async function apply() {
    setLoading(true);
    function countOccurrences(dailyArray, data, key) {
      data.forEach((item) => {
        const dateStr = key === "reviews" ? item.createdAt : item;
        const date = new Date(dateStr);
        const day = formatDate(date);
        const dayEntry = dailyArray.find((entry) => entry.name === day);
        if (dayEntry) {
          switch (key) {
            case "count":
              dayEntry.impressions++;
              break;
            case "imageclick":
              dayEntry.imageClicks++;
              break;
            case "starclick":
              dayEntry.starRatingClicks++;
              break;
            case "reviews":
              dayEntry.collectedReviews++;
              break;
            default:
              break;
          }
        }
      });
    }

    const fromDate = inputValues.since;

    const untilDate = inputValues.until;

    const startDate = new Date(fromDate);
    const endDate = new Date(untilDate);
    const dailyArray = generateDailyArray(startDate, endDate);

    countOccurrences(dailyArray, data.count, "count");
    countOccurrences(dailyArray, data.imageclick, "imageclick");
    countOccurrences(dailyArray, data.starclick, "starclick");
    countOccurrences(dailyArray, reviews, "reviews");
    const totalImpressions = dailyArray.reduce(
      (sum, entry) => sum + entry.impressions,
      0,
    );
    const totalImage = dailyArray.reduce(
      (sum, entry) => sum + entry.imageClicks,
      0,
    );
    const totalRating = dailyArray.reduce(
      (sum, entry) => sum + entry.starRatingClicks,
      0,
    );
    const totalReviews = dailyArray.reduce(
      (sum, entry) => sum + entry.collectedReviews,
      0,
    );
    setImpressionCount(totalImpressions);
    setImagecount(totalImage);
    setStarcount(totalRating);
    setReviewscount(totalReviews);
    setLoading(false);
    setanalyticsChartData(dailyArray);
    setPopoverActive(false);
  }

  function cancel() {
    setPopoverActive(false);
  }
  useEffect(() => {
    if (activeDateRange) {
      setInputValues({
        since: formatDate(activeDateRange.period.since),
        until: formatDate(activeDateRange.period.until),
      });
      function monthDiff(referenceDate, newDate) {
        return (
          newDate.month -
          referenceDate.month +
          12 * (referenceDate.year - newDate.year)
        );
      }
      const monthDifference = monthDiff(
        { year, month },
        {
          year: activeDateRange.period.until.getFullYear(),
          month: activeDateRange.period.until.getMonth(),
        },
      );
      if (monthDifference > 1 || monthDifference < 0) {
        setDate({
          month: activeDateRange.period.until.getMonth(),
          year: activeDateRange.period.until.getFullYear(),
        });
      }
    }
  }, [activeDateRange]);
  const buttonValue =
    activeDateRange.title === "Custom"
      ? activeDateRange.period.since.toDateString() +
        " - " +
        activeDateRange.period.until.toDateString()
      : activeDateRange.title;

  const [date, setActiveDate] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    const get_only_date = (date) => {
      if (date && date.period) {
        const start_dateObj = new Date(date.period.since);
        const end_dateObj = new Date(date.period.until);
        const options = { year: "numeric", month: "long", day: "numeric" };
        const start_formattedDate = start_dateObj.toLocaleDateString(
          "en-US",
          options,
        );
        const end_formattedDate = end_dateObj.toLocaleDateString(
          "en-US",
          options,
        );

        setActiveDate({
          startDate: start_formattedDate,
          endDate: end_formattedDate,
        });
      }
    };

    get_only_date(activeDateRange);
  }, [activeDateRange]);

  const dateFilter = (
    <InlineStack gap={600}>
      <div>
        <Popover
          active={popoverActive}
          autofocusTarget="none"
          preferredAlignment="left"
          preferredPosition="below"
          fluidContent
          sectioned={false}
          fullHeight
          activator={
            <Button
              size="slim"
              icon={CalendarIcon}
              onClick={() => setPopoverActive(!popoverActive)}
            >
              <Text variant="headingSm" as="h6">
                {` ${date.startDate} - ${date.endDate}`}
              </Text>
            </Button>
          }
          onClose={() => setPopoverActive(false)}
        >
          <Popover.Pane fixed>
            <InlineGrid
              columns={{
                xs: "1fr",
                mdDown: "1fr",
                md: "max-content max-content",
              }}
              gap={0}
              ref={datePickerRef}
            >
              <Box padding={{ xs: 500 }} maxWidth={mdDown ? "320px" : "516px"}>
                <BlockStack gap="400">
                  <div>
                    <DatePicker
                      month={month}
                      year={year}
                      selected={{
                        start: activeDateRange.period.since,
                        end: activeDateRange.period.until,
                      }}
                      onMonthChange={handleMonthChange}
                      onChange={handleCalendarChange}
                      allowRange
                      disableDatesAfter={new Date()}
                    />
                  </div>
                </BlockStack>
              </Box>

              <BlockStack>
                <Box
                  maxWidth={mdDown ? "516px" : "100%"}
                  width={mdDown ? "100%" : "100%"}
                  padding={{ xs: 500 }}
                  paddingBlockEnd={{ xs: 100, md: 0 }}
                >
                  {mdDown ? (
                    <Scrollable style={{ height: "334px" }}>
                      <OptionList
                        options={ranges.map((range) => ({
                          value: range.alias,
                          label: range.title,
                        }))}
                        selected={activeDateRange.alias}
                        onChange={(value) => {
                          setActiveDateRange(
                            ranges.find((range) => range.alias === value[0]),
                          );
                        }}
                      />
                    </Scrollable>
                  ) : (
                    <Select
                      label="Date range"
                      //labelHidden
                      onChange={(value) => {
                        const result = ranges.find(
                          ({ title, alias }) =>
                            title === value || alias === value,
                        );
                        setActiveDateRange(result);
                      }}
                      value={
                        activeDateRange?.title || activeDateRange?.alias || ""
                      }
                      options={ranges.map(({ alias, title }) => title || alias)}
                    />
                  )}
                </Box>

                <Box padding={{ xs: 500 }}>
                  <InlineStack gap="200">
                    <div style={{ flexGrow: 1 }}>
                      <TextField
                        role="combobox"
                        label={"Start date"}
                        // labelHidden
                        //prefix={<Icon source={CalendarIcon} />}
                        value={inputValues.since}
                        onChange={handleStartInputValueChange}
                        onBlur={handleInputBlur}
                        autoComplete="off"
                      />
                    </div>

                    <div style={{ flexGrow: 1 }}>
                      <TextField
                        role="combobox"
                        label={"End date"}
                        //labelHidden
                        //prefix={<Icon source={CalendarIcon} />}
                        value={inputValues.until}
                        onChange={handleEndInputValueChange}
                        onBlur={handleInputBlur}
                        autoComplete="off"
                      />
                    </div>
                  </InlineStack>
                </Box>
              </BlockStack>
            </InlineGrid>
          </Popover.Pane>
          <Popover.Pane fixed>
            <Popover.Section>
              <InlineStack align="end">
                <Button onClick={cancel}>Cancel</Button>
                <Button primary onClick={apply}>
                  Apply
                </Button>
              </InlineStack>
            </Popover.Section>
          </Popover.Pane>
        </Popover>
      </div>

      <div style={{ marginTop: "7px" }}>
        <Text>{`compared to ${date.startDate} - ${date.endDate}`}</Text>
      </div>
    </InlineStack>
  );
  const toggleLine = (dataKey) => {
    if (activeLine === dataKey) {
      setActiveLine(null);
    } else {
      setActiveLine(dataKey);
    }
  };

  // Function to count occurrences in each hour
  function countOccurrences(hourlyArray, data, key) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    data.forEach((item) => {
      const dateStr = key === "reviews" ? item.createdAt : item;
      const date = new Date(dateStr);

      if (date >= startOfDay && date <= endOfDay) {
        const hour = date.getHours();
        switch (key) {
          case "count":
            hourlyArray[hour].impressions++;
            break;
          case "imageclick":
            hourlyArray[hour].imageClicks++;
            break;
          case "starclick":
            hourlyArray[hour].starRatingClicks++;
            break;
          case "reviews":
            hourlyArray[hour].collectedReviews++;
            break;
          default:
            break;
        }
      }
    });
  }
  function generateHourlyArray() {
    const hours = [];
    const currentDate = new Date();
    for (let i = 0; i < 24; i++) {
      const date = new Date(currentDate);
      date.setHours(i, 0, 0, 0);
      const timeString = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      hours.push({
        name: timeString,
        impressions: 0,
        imageClicks: 0,
        starRatingClicks: 0,
        collectedReviews: 0,
      });
    }
    return hours;
  }
  const hourlyArray = generateHourlyArray();
  countOccurrences(hourlyArray, data.count, "count");
  countOccurrences(hourlyArray, data.imageclick, "imageclick");
  countOccurrences(hourlyArray, data.starclick, "starclick");
  countOccurrences(hourlyArray, data.starclick, "starclick");
  countOccurrences(hourlyArray, reviews, "reviews");

  const totalImpressions = hourlyArray.reduce(
    (sum, entry) => sum + entry.impressions,
    0,
  );
  const totalImage = hourlyArray.reduce(
    (sum, entry) => sum + entry.imageClicks,
    0,
  );
  const totalRating = hourlyArray.reduce(
    (sum, entry) => sum + entry.starRatingClicks,
    0,
  );
  const totalReviews = hourlyArray.reduce(
    (sum, entry) => sum + entry.collectedReviews,
    0,
  );
  useEffect(() => {
    setImpressionCount(totalImpressions);
    setImagecount(totalImage);
    setStarcount(totalRating);
    setReviewscount(totalReviews);
    setanalyticsChartData(hourlyArray);
  }, []);

  const chartData = [
    {
      name: "Jun 19",
      impressions: 0,
      imageClicks: 0,
      starRatingClicks: 0,

      collectedReviews: 0,
    },
    {
      name: "Jun 20",
      impressions: 1,
      imageClicks: 0,
      starRatingClicks: 4,

      collectedReviews: 0,
    },
    {
      name: "Jun 21",
      impressions: 1,
      imageClicks: 0,
      starRatingClicks: 1,

      collectedReviews: 0,
    },
    {
      name: "Jun 22",
      impressions: 1,
      imageClicks: 0,
      starRatingClicks: 1,

      collectedReviews: 0,
    },
    {
      name: "Jun 23",
      impressions: 1,
      imageClicks: 0,
      starRatingClicks: 2,

      collectedReviews: 0,
    },
    {
      name: "Jun 24",
      impressions: 16,
      imageClicks: 0,
      starRatingClicks: 1,

      collectedReviews: 0,
    },
    {
      name: "Jun 25",
      impressions: 12,
      imageClicks: 0,
      starRatingClicks: 1,
      reviewRequestEmails: 0,
      collectedReviews: 0,
    },
  ];

  return (
    <BlockStack gap={400}>
      <InlineStack gap="300">
        <div>
          {dateFilter}
          {/* <DateRangePicker/> */}
        </div>
      </InlineStack>
      <Card padding={0}>
        {loading ? (
          <Spinner accessibilityLabel="Spinner example" size="large" />
        ) : (
          <>
            <InlineGrid gap="0" columns={{ md: "4", sm: "3", xs: "2" }}>
              <div
                style={{ background: "#7E5AFA", color: "#fff" }}
                className="upper-chart-box"
              >
                <Box padding="400">
                  <BlockStack
                    gap="200"
                    align="start"
                    blockAlign="start"
                    inlineAlign="start"
                  >
                    <Text
                      fontWeight="bold"
                      variant="headingMd"
                      as="h4"
                      tone="inherit"
                    >
                      Impressions
                    </Text>
                    <Text fontWeight="bold" variant="headingLg" tone="inherit">
                      {Impressionscount}
                    </Text>
                    {/* <InlineStack align="start" blockAlign="center" gap="100">
                    <span>
                      <Icon source={ArrowDownIcon} tone="text-inverse" />
                    </span>
                    <Text
                      fontWeight="medium"
                      as="p"
                      variant="bodySm"
                      tone="text-inverse"
                    >
                      -82.65%
                    </Text>
                  </InlineStack> */}
                  </BlockStack>
                </Box>
              </div>
              <div
                style={{ background: "#14BA88", color: "#fff" }}
                className="upper-chart-box"
              >
                <Box padding="400">
                  <BlockStack
                    gap="200"
                    align="start"
                    blockAlign="start"
                    inlineAlign="start"
                  >
                    <Text
                      fontWeight="bold"
                      variant="headingMd"
                      as="h4"
                      tone="inherit"
                    >
                      Image clicks
                    </Text>
                    <Text fontWeight="bold" variant="headingLg" tone="inherit">
                      {Imagecount}
                    </Text>
                    {/* <InlineStack align="start" blockAlign="center" gap="100">
                    <Text
                      fontWeight="medium"
                      as="p"
                      variant="bodySm"
                      tone="text-inverse"
                    >
                      No change
                    </Text>
                  </InlineStack> */}
                  </BlockStack>
                </Box>
              </div>
              <div
                style={{ background: "#9ACDE1", color: "#fff" }}
                className="upper-chart-box"
              >
                <Box padding="400">
                  <BlockStack
                    gap="200"
                    align="start"
                    blockAlign="start"
                    inlineAlign="start"
                  >
                    <Text
                      fontWeight="bold"
                      variant="headingMd"
                      as="h4"
                      tone="inherit"
                    >
                      Star rating clicks
                    </Text>
                    <Text fontWeight="bold" variant="headingLg" tone="inherit">
                      {Starcount}
                    </Text>
                    {/* <InlineStack align="start" blockAlign="center" gap="100">
                    <Text
                      fontWeight="medium"
                      as="p"
                      variant="bodySm"
                      tone="text-inverse"
                    >
                      -82.65%
                    </Text>
                  </InlineStack> */}
                  </BlockStack>
                </Box>
              </div>

              <div
                style={{ background: "#2C6ECB", color: "#fff" }}
                className="upper-chart-box"
              >
                <Box padding="400">
                  <BlockStack
                    gap="200"
                    align="start"
                    blockAlign="start"
                    inlineAlign="start"
                  >
                    <Text
                      fontWeight="bold"
                      variant="headingMd"
                      as="h4"
                      tone="inherit"
                    >
                      Collected reviews
                    </Text>
                    <Text fontWeight="bold" variant="headingLg" tone="inherit">
                      {Reviewscount}
                    </Text>
                    {/* <InlineStack align="start" blockAlign="center" gap="100">
                    <span>
                      <Icon source={ArrowDownIcon} tone="text-inverse" />
                    </span>
                    <Text
                      fontWeight="medium"
                      as="p"
                      variant="bodySm"
                      tone="text-inverse"
                    >
                      -100%
                    </Text>
                  </InlineStack> */}
                  </BlockStack>
                </Box>
              </div>
            </InlineGrid>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analyticsChartData}>
                <CartesianGrid
                  strokeDasharray="0 0"
                  vertical={false}
                  horizontal={true}
                />
                <XAxis
                  dataKey="name"
                  padding={{ left: 10, right: 10 }}
                  hide={false}
                />
                <YAxis hide />
                <Tooltip />

                <Legend
                  onClick={(event) => {
                    const { dataKey } = event.payload;
                    toggleLine(dataKey);
                  }}
                  formatter={(value, entry) => {
                    const { dataKey } = entry;
                    const opacity =
                      activeLine === dataKey || activeLine === null ? 1 : 0.3;
                    const textDecorationval =
                      activeLine === dataKey || activeLine === null
                        ? "none"
                        : "line-through";
                    return (
                      <span
                        style={{
                          opacity,
                          textDecoration: textDecorationval,
                          cursor: "pointer",
                        }}
                      >
                        {value}
                      </span>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  name="Impressions"
                  stroke="#7E5AFA"
                  activeDot={{ r: 8 }}
                  opacity={
                    activeLine === "impressions" || activeLine === null
                      ? 1
                      : 0.3
                  }
                />
                <Line
                  type="monotone"
                  dataKey="imageClicks"
                  name="Image Clicks"
                  stroke="#14BA88"
                  activeDot={{ r: 8 }}
                  opacity={
                    activeLine === "imageClicks" || activeLine === null
                      ? 1
                      : 0.3
                  }
                />
                <Line
                  type="monotone"
                  dataKey="starRatingClicks"
                  name="Star Rating Clicks"
                  stroke="#9ACDE1"
                  activeDot={{ r: 8 }}
                  opacity={
                    activeLine === "starRatingClicks" || activeLine === null
                      ? 1
                      : 0.3
                  }
                />
                <Line
                  type="monotone"
                  dataKey="reviewRequestEmails"
                  name="Review Request Emails"
                  stroke="#F4B207"
                  activeDot={{ r: 8 }}
                  opacity={
                    activeLine === "reviewRequestEmails" || activeLine === null
                      ? 1
                      : 0.3
                  }
                />
                <Line
                  type="monotone"
                  dataKey="collectedReviews"
                  name="Collected Reviews"
                  stroke="#2C6ECB"
                  activeDot={{ r: 8 }}
                  opacity={
                    activeLine === "collectedReviews" || activeLine === null
                      ? 1
                      : 0.3
                  }
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </Card>
    </BlockStack>
  );
};

function UpsellBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  const getTabFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get("tab");
  };
  const {
    data,
    shopName,
    reviews,
    totalReviews,
    publishReviews,
    analyticsData,
    collectionData,
    averageRating,
    productReviews,
    getUpsells,
  } = useLoaderData();
  const [upsellList, setUpsellList] = useState(getUpsells);

  const [formData, setFormData] = useState(data);
  const [status, setStatus] = useState(data.app_status);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const [msgData, setMsgData] = useState("");
  const [activeField, setActiveField] = useState(false);
  const [buttonloading, setButtonLoading] = useState(false);
  const [lastSavedData, setLastSavedData] = useState(data);
  const [activemodal, setActivemodal] = useState(false);
  const toggleModal = useCallback(
    () => setActivemodal((activemodal) => !activemodal),
    [],
  );
  const [buttonLoader, setButtonLoader] = useState(false);

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
    }
  };

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

  const handleChange = (value, property) => {
    setFormData((formData) => ({
      ...formData,
      [property]: value,
    }));
  };
  const initialTab = getTabFromUrl() || "dashboard";

  const tabMapping = {
    dashboard: 0,
    reviews: 1,
    import: 2,
    settings: 3,
    analytics: 4,
  };
  const initialSelected = tabMapping[initialTab] || 0;

  const [selected, setSelected] = useState(initialSelected);
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const handleColorChange = useCallback((e, fieldName) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: e.target.value,
    }));
  }, []);

  useEffect(() => {
    shopify.loading(false);
  });
  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };
 
  const handleCreate = () => {
    shopify.loading(true);
    navigate("/app/create/upsell_builder/all");
  };

  const handleUpsellBuilderClick = () => {
    window.open(
      `https://admin.shopify.com/store/${shopName.replace(".myshopify.com", "")}/admin/themes/current/editor?&addAppBlockId=8177ef1b-fb1c-4ebb-a686-d743f22ea714/upsellbuilder&target=newAppsSection`,
      "__blank",
    );
  };

  const Importtab = () => {
    const [importBanner, setImportBanner] = useState(true);
    return (
      <div className="import-tab">
        <BlockStack gap="400">
          {importBanner && (
            <Banner
              title="Ensure Regulatory Compliance in Review Imports"
              tone="info"
              onDismiss={() => {
                setImportBanner(false);
              }}
            >
              <p>
                Only import reviews about products sold by you and collected
                from your customers. Importing external reviews may violate
                regulations and mislead customers.
              </p>
            </Banner>
          )}
          <Card padding="400">
            <BlockStack gap="400">
              <Text variant="p" fontWeight="bold">
                Import reviews from a CSV export from another app:
              </Text>
              <ButtonGroup>
                <Button>Growave</Button>
                <Button>JudgeMe</Button>
                <Button>Loox</Button>
                <Button>Ryviu</Button>
                <Button>Shopify Product Reviews</Button>
                <Button>Stamped</Button>
                <Button>Yotpo</Button>
              </ButtonGroup>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap={300}>
              <InlineGrid
                columns={{ sm: "1fr auto", xs: "1fr" }}
                gap="200"
                alignItems="center"
                inlineAlign="start"
                align="start"
                style={{ width: "100%" }}
              >
                <InlineGrid columns="45px 1fr" alignItems="center" gap="200">
                  <Thumbnail
                    source={ImportIcon}
                    size="small"
                    color="base"
                    style={{ borderRadius: "8px" }}
                  />
                  <Text variant="p">
                    Import reviews from a CSV file in the All-In-One Store  format:
                  </Text>
                </InlineGrid>
                <Button>Import</Button>
              </InlineGrid>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap={300}>
              <InlineGrid
                columns={{ sm: "1fr auto", xs: "1fr" }}
                gap="200"
                alignItems="center"
                inlineAlign="start"
                align="start"
                style={{ width: "100%" }}
              >
                <InlineGrid columns="45px 1fr" alignItems="center" gap="200">
                  <Thumbnail source={ImportIcon} size="small" />
                  <Text variant="p">
                    Import reviews from AliExpress for a product:
                  </Text>
                </InlineGrid>
                <Button>Import from AliExpress</Button>
              </InlineGrid>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap={300}>
              <InlineGrid
                columns={{ sm: "1fr auto", xs: "1fr" }}
                gap="200"
                alignItems="center"
                inlineAlign="start"
                align="start"
                style={{ width: "100%" }}
              >
                <InlineGrid columns="45px 1fr" alignItems="center" gap="200">
                  <Thumbnail source={ExportIcon} size="small" />
                  <Text variant="p">
                    Export all reviews from All-In-One Store  to a CSV file.
                  </Text>
                </InlineGrid>
                <Button>Export</Button>
              </InlineGrid>
            </BlockStack>
          </Card>
        </BlockStack>
      </div>
    );
  };

  const tabs = [
    {
      id: "offers",
      content: "Offers",
      accessibilityLabel: "Offers",
      panelID: "Offers",
      component: <Offers data={getUpsells} handleCreate={handleCreate} handleUpsellBuilderClick={handleUpsellBuilderClick} shopName={shopName}/>,
      dummy: "",
    },
    {
      id: "General Settings",
      content: "General Settings",
      panelID: "General Settings",
      component: (
        <GeneralSettings
          data={formData}
          handleChange={handleChange}
          handleColorChange={handleColorChange}
          handleFocus={handleFocus}
        />
      ),
      dummy: "",
    },
    // {
    //   id: "Excluded Products",
    //   content: "Excluded Products",
    //   panelID: "Excluded Products",
    //   component: <Importtab />,
    //   dummy: "",
    // },

    // {
    //   id: "Analytics",
    //   content: "Analytics",
    //   panelID: "Analytics",
    //   component: (
    //     <AnalyticsDataTab data={analyticsData} reviews={collectionData} />
    //   ),
    //   dummy: "",
    // },
  ];
  const handleClick = () => {
    shopify.loading(true);
    navigate("/app");
  };
  const appName = "Upsell Builder";
 
  return (
    <div className="Produyct-reviews">
      <Page
        backAction={{ content: "Back", onAction: handleClick }}
        title="Upsell Builder"
        subtitle="Easily collect, import and display reviews with photos and boost trust and conversion rates with social proof."
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
        <div className="product-reviews">
          <BlockStack gap="200">
            {selected == "0" && (
              <BlockStack gap="200">
                <Text alignment="end" tone="subdued">
                  Results for the last 30 days.{" "}
                </Text>
                <InlineGrid
                  columns={{
                    sm: "2",
                    md: "4",
                  }}
                  gap="400"
                >
                  <Box
                    background="bg-surface"
                    borderRadius="200"
                    gap="200"
                    padding="400"
                    shadow="100"
                  >
                    <BlockStack gap="100">
                      <Text as="h2" variant="headingSm">
                        Impressions
                      </Text>
                      <Text as="p" variant="headingLg">
                        0
                      </Text>
                      <span
                        style={{ paddingBottom: "10px", display: "block" }}
                      ></span>
                    </BlockStack>
                  </Box>
                  <Box
                    background="bg-surface"
                    borderRadius="200"
                    gap="200"
                    padding="400"
                    shadow="100"
                  >
                    <BlockStack gap="100">
                      <Text as="h2" variant="headingSm">
                        Clicks
                      </Text>
                      <Text as="p" variant="headingLg">
                        0
                      </Text>
                      <span
                        style={{ paddingBottom: "10px", display: "block" }}
                      ></span>
                    </BlockStack>
                  </Box>
                  <Box
                    background="bg-surface"
                    borderRadius="200"
                    gap="200"
                    padding="400"
                    shadow="100"
                  >
                    <BlockStack gap="100">
                      <Text as="h2" variant="headingSm">
                        Orders
                      </Text>
                      <InlineStack align="start" gap="200" blockAlign="center">
                        <span>
                          <Icon source={StarIcon} tone="base" />
                        </span>
                        <Text as="p" variant="headingLg">
                          0
                        </Text>
                      </InlineStack>
                      <span
                        style={{ paddingBottom: "10px", display: "block" }}
                      ></span>
                    </BlockStack>
                  </Box>
                  <Box
                    background="bg-surface"
                    borderRadius="200"
                    gap="200"
                    padding="400"
                    shadow="100"
                  >
                    <BlockStack gap="100">
                      <Text as="h2" variant="headingSm">
                        Sales
                      </Text>
                      <Text as="p" variant="headingLg">
                        3
                      </Text>
                    </BlockStack>
                    <span
                      style={{ paddingBottom: "10px", display: "block" }}
                    ></span>
                  </Box>
                </InlineGrid>
              </BlockStack>
            )}
            <div className="product-reviews_container">
              <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                <Box padding={0}>{tabs[selected].dummy}</Box>
                <div>{tabs[selected].component}</div>
              </Tabs>
            </div>
          </BlockStack>
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

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}
export default UpsellBuilder;
