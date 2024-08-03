import { json } from "@remix-run/node";
import db from "../db.server";
import { authenticate } from "../shopify.server";
import { renderToString } from "react-dom/server";
import HappyCustomers from "./components/HappyCustomers";
export let loader = async ({ request }) => {
  const { admin, session } =
    await authenticate.public.appProxy(request);

 

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
    form_allow_img: 0,
    form_text_color: "#5e5e5e",
    form_bg_color: "red",
    form_btn_text: "#ffffff",
    form_btn_bg: "#000000",

   

    //happy customers
    activate_happy_customer_page: 1,
    happy_customer_page_title: "Happy Customers",
    happy_customer_page_description:
      "Customers from all over the world love our products!",
    happy_customer_reviews_layout: "Grid_view",
    happy_customer_show_filterbar: 1,
    happy_customer_min_reviews_desktop: 20,
    happy_customer_min_reviews_mobile: 10,

   

   
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
  const featuredReviews = await db.Reviews.findMany({
    where: {
      store_name: session.shop,
      featured: true,
    },
  });

  const htmlContent =<HappyCustomers data={data} reviews={featuredReviews} />
  ;
  return new Response(htmlContent, {
    headers: {
      "Content-Type": "application/liquid",
    },
  });
};
