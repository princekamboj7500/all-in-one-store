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
  Text,
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
  Layout,
  Toast,
  Grid,
  Frame,
  InlineStack,
  Link,
  Popover,
  ActionList,
  EmptyState,
  Icon,
  Thumbnail,
} from "@shopify/polaris";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  ViewIcon,
  ImageIcon,
  ImportIcon,
  StarIcon,
  CalendarIcon,
  ExportIcon,
  ArrowDownIcon,
} from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import { useNavigate, useLoaderData, useLocation } from "@remix-run/react";
import DeactivatePopover from "./components/DeactivatePopover";
import "./assets/style.css";
import ReviewsWidget from "./components/ReviewsWidget";
import StarRatings from "./components/StarRatings";
import HappyCustomers from "./components/HappyCustomersPage";
import FeaturedReviews from "./components/FeaturedReviews";
import Translations from "./components/Translations";
import AllreviewsBadge from "./components/AllReviewsBadge";
import ReviewsCarousel from "./components/ReviewsCarousel";
import DiscardModal from "./components/DiscardModal";
import PublishingSeo from "./components/PublishingSeo";
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
import DateRangePicker from "./components/DateRangePicker";

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
    app_name: "ProductReviews",
    app_status: false,
    star_shape: "Rounded",
    widget_star_color: "#ffce07",

    reviews_layout: "Grid_view",
    show_rating_filterbar: 1,
    show_reviewbox_whenzero: 1,
    hide_review_mainwidget: 0,
    desktop_min_reviews: 20,
    desktop_max_reviews: 100,
    mobile_min_reviews: 10,
    mobile_max_reviews: 50,

    show_reviews_date: 1,

    date_format: "yyyy-mm-dd",
    reviewer_name_display: "Show full names",
    verified_icon: 1,
    verified_icon_color: "#00a332",
    reviewer_name_color: "#222222",
    reviewer_text_color: "#5e5e5e",
    review_card_bg: "#ffffff",
    review_card_shadow: "#eaeaea",
    review_date: "#737373",

    avatar_bg: "#ffce07",
    avatar_icon_color: "#222222",
    storyreply_title_color: "#5e5e5e",
    storyreply_text_color: "#5e5e5e",
    storyreply_card_bg: "#f7f7f7",
    form_allow_img: 1,
    form_text_color: "#5e5e5e",
    form_bg_color: "#ffffff",
    form_btn_text: "#ffffff",
    form_btn_bg: "#000000",

    // all reviews badge
   
    badge_layout: "horizontal",
    badge_style: "light",
    custom_widget_alignment: "Center",
    badge_show_bg: 1,
    custom_bg_color: "#f8f8f8",
    badge_show_border: 1,
    custom_border_color: "#aeaeae",
    show_review_count: 1,
    review_count_color: "#222222",
    badge_radius: 12,
    rating_box_text_color: "#ffffff",
    rating_box_bg_color: "#222222",
    badge_star_color: "#ffce07",
    show_collected_by_vitals: 1,
    badge_margin_left: 16,
    badge_margin_right: 16,
    badge_margin_top: 24,
    badge_margin_bottom: 24,

    //happy customers
    activate_happy_customer_page: 0,
    happy_customer_page_title: "Happy Customers",
    happy_customer_page_description:
      "Customers from all over the world love our products!",
    happy_customer_reviews_layout: "Grid_view",
    happy_customer_show_filterbar: 0,
    happy_customer_min_reviews_desktop: 20,
    happy_customer_min_reviews_mobile: 10,

    // starRatings
    display_star_productpage: 1,
    star_size_productpage: 19,
    star_alignment_productpage: "Left",
    star_rating_format_productpage:
      "{{ stars }} {{ averageRating }} ({{ totalReviews }} {{ reviewsTranslation }})",
    margin_top_productpage: 10,
    margin_bottom_productpage: 10,
    display_star_homepage: 1,
    star_size_homepage: 19,
    star_alignment_homepage: "Center",
    star_rating_format_homepage: "{{ stars }} ({{ totalReviews }})",
    margin_top_homepage: 10,
    margin_bottom_homepage: 10,
    // publishing
    autopublish_reviews:"Don't auto Publish",


    // reviewscarousel
    reviews_carousel_option: "automatically",
   
    carousel_title: "Our Customers Love Us",
    carousel_title_alignment: "Center",
    carousel_title_size: 28,
    carousel_layout: "textcards",
    carousel_max_width: 1200,
    carousel_columns_desktop: 3,
    carousel_max_text_rows: 3,
    carousel_reviews_alignment: "Center",
    carousel_img_ratio: "Square",
    carousel_margin_top: 4,
    carousel_margin_bottom: 4,
    carousel_margin_top_mobile: 4,
    carousel_margin_bottom_mobile: 4,
    carouselcard_text_color: "#000000",
    carouselcard_bg_color: "#ffffff",
    carouselcard_stars_color: "#000000",
    carouselcard_show_shadow: 0,
    carouselcard_show_border: 1,
    carouselcard_border_color: "#7d4343",
    carouselcard_radius: 4,
    carousel_arrow: "arrow2",

    // translation
    translation_reviews: "reviews",
    translation_see_more_reviews: "See more reviews",
    translation_write_review: "Write a Review",
    translation_share_experience: "Share your experience",
    translation_rating: "Rating",
    translation_name: "Name",
    translation_review: "Review",
    translation_love_to_see_picture: "We'd love to see a picture",
    translation_submit_review: "Submit Review",
    translation_cancel: "cancel",
    translation_no_reviews_yet: "No reviews yet. Be the first to add a review.",
    translation_thankyou_for_review: "Thank you for adding your review!",
    translation_only_image_supported:
      "Only image file types are supported for upload",
    translation_email: "E-mail",
    translation_review_not_added:
      "The review could not be added. If the problem persists, please contact us.",
    translation_store_reply: "Store reply",
    translation_verified_buyer: "Verified buyer",
    translation_collected_by: "Collected by",
    translation_From_no_of_reviews: "From {{reviews_count}} reviews",

    //Featured Reviews
    featured_reviews_layout: "Grid_view",
    featured_show_filterbar: 1,
    featured_desktop_min_reviews: 20,
    featured_desktop_max_reviews: 100,
    featured_mobile_min_reviews: 10,
    featured_mobile_max_reviews: 50,
  };

  const appName =
    metafielData.length > 0
      ? metafielData.filter((item) => item.node.namespace === "ProductReviews")
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
  const reviews = await prisma.reviews.findMany({
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

  return {
    data,
    shopName,
    totalReviews,
    publishReviews,
    averageRating,
    productReviews,
    analyticsData,
    collectionData,
  };
};

export function ReviewList({ reviews }) {
  const navigate = useNavigate();

  const [data, setData] = useState(reviews);

  let products = [];
  if (data.length > 0) {
    products = data.map((item) => ({
      id: item.product_id,
      url: `/app/productreview/`,
      title: item.product_title,
      totalRating: item.averageRating,
      image: item.product_image,
      reviews: item.count,
    }));
  }
  const emptyStateMarkup =
    data.length === 0 ? (
      <EmptyState
        heading="No product reviews yet"
        
        image="https://cdn.shopify.com/s/files/1/0854/6615/3247/files/reviews.svg?v=1721279077"
      >
        <p>Please add reviews</p>
      </EmptyState>
    ) : undefined;

  const resourceName = { singular: "product", plural: "products" };
  const handleReviewNavigate = (url, id) =>{
    shopify.loading(true)
    navigate(`${url}${id}`)
  
  }

  return (
    <Card padding={0}>
      <ResourceList
        items={products}
        emptyState={emptyStateMarkup}
        renderItem={function renderItem(item) {
          const { id, url, title, totalRating, image, reviews } = item;
          const media = (
            <Thumbnail
              source={image || ImageIcon}
              size="small"
              alt="Black choker necklace"
            />
          );

          return (
            <ResourceItem
              id={id}
              key={id}
              onClick={() =>handleReviewNavigate(url, id)}
              media={media}
              accessibilityLabel={`View details for ${title}`}
            >
              <Text variant="bodyMd" fontWeight="bold" as="h3">
                {" "}
                {title}{" "}
              </Text>
              <div style={{ marginTop: "5px", display: "flex", gap: "12px" }}>
                <Badge>
                  Reviews <b>{reviews}</b>
                </Badge>
                <Badge>
                  Rating <b>{totalRating}</b>
                </Badge>
              </div>
            </ResourceItem>
          );
        }}
        resourceName={resourceName}
        alternateTool={<Button variant="primary">Import reviews</Button>}
      />
    </Card>
  );
}

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
    console.log("handleStartInputValueChange, validDate", value);
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

    countOccurrences(dailyArray, data?.count ?? [], "count");
    countOccurrences(dailyArray, data?.imageclick ?? [], "imageclick");
    countOccurrences(dailyArray, data?.starclick ?? [], "starclick");
    countOccurrences(dailyArray, reviews ?? [], "reviews");
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
    // setImpressionCount(data.count)
    // setImagecount(data.imageclick)
    // setStarcount(data.starclick)
    // setReviewscount(reviews.length)
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
  countOccurrences(hourlyArray, data?.count ?? [], "count");
  countOccurrences(hourlyArray, data?.imageclick ?? [], "imageclick");
  countOccurrences(hourlyArray, data?.starclick ?? [], "starclick");
  countOccurrences(hourlyArray, reviews ?? [], "reviews");

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

function ProductReviews() {
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
  } = useLoaderData();
  const [Analyticsdata, setAnalyticsdata] = useState();
  const [Reviewdata, setReviewdata] = useState(collectionData);
  const [Filterdata, setFilterData] = useState([]);
  const [analyticsChartData, setAnalyticsChartData] = useState([]);
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
  const [selectedWidget, setSelectedWidget] = useState("ReviewsWidget");

  const handleOptionChange = (selected) => {
    setSelectedWidget(selected[0]);
  };

  const widgetoptions = [
    { value: "ReviewsWidget", label: "Reviews Widget" },
    { value: "StarRatings", label: "Star Ratings" },
    { value: "ReviewsCarousel", label: "Reviews Carousel" },
    { value: "HappyCustomers", label: "Happy Customers Page" },
    { value: "FeaturedReviews", label: "Featured Reviews" },
    { value: "AllReviewsBadge", label: "All Reviews Badge" },
    { value: "Publishing", label: "Publishing" },
    { value: "Translations", label: "Translations" },
  ];

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
      console.log(dataToSend, "dataToSend");
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

  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const SettingsDataTab = (
    <div style={{ padding: "10px" }} className="product-review-settings">
      <BlockStack gap="400">
        <InlineGrid
          gap="400"
          columns={{
            sm: "100%",
            md: "2fr 5fr",
          }}
        >
          <Layout>
            <Layout.Section>
              <BlockStack gap={300}>
                <Card roundedAbove="sm" padding="200">
                  <BlockStack gap={300}>
                    <OptionList
                      title={<b>Widgets</b>}
                      onChange={handleOptionChange}
                      options={widgetoptions}
                      selected={[selectedWidget]}
                    />
                  </BlockStack>
                </Card>
              </BlockStack>
            </Layout.Section>
          </Layout>

          <Layout>
            {selectedWidget === "ReviewsWidget" && (
              <ReviewsWidget
              shop={shopName}
                formData={formData}
                handleChange={handleChange}
                handleFocus={handleFocus}
                handleColorChange={handleColorChange}
              />
            )}
            {selectedWidget === "StarRatings" && (
              <StarRatings
                formData={formData}
                handleChange={handleChange}
                handleFocus={handleFocus}
                handleColorChange={handleColorChange}
              />
            )}
            {selectedWidget === "ReviewsCarousel" && (
              <ReviewsCarousel
              shop={shopName}
                formData={formData}
                handleChange={handleChange}
                handleFocus={handleFocus}
                handleColorChange={handleColorChange}
              />
            )}
            {selectedWidget === "HappyCustomers" && (
              <HappyCustomers
                formData={formData}
                shopname={shopName}
                handleChange={handleChange}
                handleFocus={handleFocus}
                handleColorChange={handleColorChange}
              />
            )}
            {selectedWidget === "FeaturedReviews" && (
              <FeaturedReviews
              shop={shopName}
                formData={formData}
                handleChange={handleChange}
                handleFocus={handleFocus}
                handleColorChange={handleColorChange}
              />
            )}
            {selectedWidget === "AllReviewsBadge" && (
              <AllreviewsBadge
              shop={shopName}
                formData={formData}
                handleChange={handleChange}
                handleFocus={handleFocus}
                handleColorChange={handleColorChange}
              />
            )}
            {selectedWidget === "Publishing" && (
              <PublishingSeo
                formData={formData}
                handleChange={handleChange}
                handleFocus={handleFocus}
                handleColorChange={handleColorChange}
              />
            )}
            {selectedWidget === "Translations" && (
              <Translations
                formData={formData}
                handleChange={handleChange}
                handleFocus={handleFocus}
                handleColorChange={handleColorChange}
              />
            )}
          </Layout>
        </InlineGrid>
      </BlockStack>
    </div>
  );

  const Dashboard = () => {
    return (
      <div style={{ padding: "10px" }} className="product-review">
        <BlockStack gap="200">
          <Text variant="headingMd" fontWeight="bold">
            Popular Actions
          </Text>
          <Card>
            <BlockStack gap={300} inlineAlign="start">
              <InlineGrid columns="45px 1fr" gap="200" alignItems="start">
                <Thumbnail source={ViewIcon} size="small" />
                <BlockStack gap="100">
                  <Text fontWeight="bold">See reviews</Text>
                  <Text variant="p">See all products with reviews.</Text>
                </BlockStack>
              </InlineGrid>
              <Button
                onClick={() => {
                  setSelected(1);
                }}
              >
                See Reviews
              </Button>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap={300} inlineAlign="start">
              <InlineGrid columns="45px 1fr" gap="200" alignItems="start">
                <Thumbnail source={ImportIcon} size="small" />
                <BlockStack gap="100">
                  <Text fontWeight="bold">Import reviews</Text>
                  <Text variant="p">
                    Add reviews to your store by importing from other platforms,
                    CSV or Aliexpress.
                  </Text>
                </BlockStack>
              </InlineGrid>
              <Button
                onClick={() => {
                  setSelected(2);
                }}
              >
                Import Reviews
              </Button>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap={300} inlineAlign="start">
              <InlineGrid columns="45px 1fr" gap="200" alignItems="start">
                <Thumbnail source={ImportIcon} size="small" />
                <BlockStack gap="100">
                  <Text fontWeight="bold">Customize appearance & settings</Text>
                  <Text variant="p">
                    Customize how the product reviews widget looks on your store
                    and edit other settings.
                  </Text>
                </BlockStack>
              </InlineGrid>
              <Button
                onClick={() => {
                  setSelected(3);
                }}
              >
                Go to settings
              </Button>
            </BlockStack>
          </Card>
        </BlockStack>
      </div>
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
                    Import reviews from a CSV file in the Vitals format:
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
                    Export all reviews from Vitals to a CSV file.
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
      id: "dashboard",
      content: "Dashboard",
      accessibilityLabel: "Dashboard",
      panelID: "Dashboard",
      component: <Dashboard />,
      dummy: "",
    },
    {
      id: "Reviews",
      content: "Reviews",
      panelID: "Reviews",
      component: <ReviewList reviews={productReviews} />,
      dummy: "",
    },
    {
      id: "Import",
      content: "Import",
      panelID: "Import",
      component: <Importtab />,
      dummy: "",
    },
    {
      id: "settings",
      content: "Settings",
      panelID: "settings",
      component: <>{SettingsDataTab}</>,
      dummy: "",
    },
    {
      id: "Analytics",
      content: "Analytics",
      panelID: "Analytics",
      component: (
        <AnalyticsDataTab data={analyticsData} reviews={collectionData} />
      ),
      dummy: "",
    },
  ];

  useEffect(()=>{
    shopify.loading(false)
  },[])
  const handleClick = () => {
    navigate("/app");
    shopify.loading(true);
  };
 const appName = "Product Reviews"

  return (
    <div className="Produyct-reviews">
      <Page
        backAction={{ content: "Back", onAction: handleClick }}
        title="Product Reviews"
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
                    md: "3",
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
                        Reviews collected
                      </Text>
                      <Text as="p" variant="headingLg">
                        {totalReviews}
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
                        Reviews published
                      </Text>
                      <Text as="p" variant="headingLg">
                        {publishReviews}
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
                        Average star rating
                      </Text>
                      <InlineStack align="start" gap="200" blockAlign="center">
                        <span>
                          <Icon source={StarIcon} tone="base" />
                        </span>
                        <Text as="p" variant="headingLg">
                          {averageRating}
                        </Text>
                      </InlineStack>
                      <span
                        style={{ paddingBottom: "10px", display: "block" }}
                      ></span>
                    </BlockStack>
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
}
export default ProductReviews;
