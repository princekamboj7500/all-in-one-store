// src/components/TopReviews.js
import React, { useEffect, useRef, useState } from "react";

import "../assets/review.css";
import Masonry from "react-masonry-css";
import ReviewsModel from "./ReviewsModel";
const reviews = [
  {
    image: [],
    name: "Jane Smith",
    text: "I recently upgraded to the XYZ Smartphone Pro, and overall, I am quite pleased with the performance. The battery life is impressive, lasting me through a full day of heavy use. The camera quality is exceptional, producing clear and vibrant photos even in low light. The screen is bright and crisp, making it perfect for watching videos and browsing the web. My only complaint is that the phone can feel a bit slippery without a case. Nonetheless, it’s a great investment for anyone looking for a high-end smartphone.",
    date: "2024-06-14",
    rate: 5,
    verified: false,
  },
  {
    image: [
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100x200",
      "https://via.placeholder.com/200x300",
      "https://via.placeholder.com/100x300",
    ],
    name: "John Doe",
    text: "The SuperBlend 5000 has completely transformed my kitchen experience. It blends smoothies, soups, and even ice effortlessly. The powerful motor and sharp blades make quick work of any ingredients I throw in. I also appreciate the sleek design and sturdy build quality. Cleanup is a breeze since most parts are dishwasher safe. This blender is worth every penny and a must-have for any kitchen.",
    date: "2024-06-13",
    rate: 5,
    verified: true,
  },
  {
    image: [
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100x200",
      "https://via.placeholder.com/100x50",
    ],
    name: "Alice Johnson",
    text: "I recently purchased the CozyWarm Winter Jacket, and it has quickly become my go-to for cold weather. The insulation is top-notch, keeping me warm even in freezing temperatures. The jacket is also stylish and fits well, with plenty of pockets for storage. My only gripe is that it can be a bit bulky, which might not be ideal for those looking for a more streamlined look. However, for warmth and comfort, this jacket is fantastic.",
    date: "2024-06-12",
    rate: 4,
    verified: true,
  },
  {
    image: [
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100x200",
      "https://via.placeholder.com/100x50",
    ],
    name: "Michael Brown",
    text: "I've been using the SpeedRunner 3000 T treadmill for a few weeks now, and I'm very satisfied with its performance. The motor is quiet yet powerful, and the running surface is spacious and cushioned, making my workouts comfortable. The built-in workout programs are varied and challenging, providing great options for different fitness levels. The only downside is that the assembly process was a bit time-consuming. Despite this, the treadmill is an excellent addition to my home gym.",
    date: "2024-06-11",
    rate: 4,
    verified: false,
  },
];

const HappyCustomers = ({ data, reviews }) => {
  const [filterReviews, setFilterReview] = useState(reviews);
  const [activeBar, setActiveBar] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(-1);
  const [activeImage, setActiveImage] = useState(0);

  const {
    reviewer_name_color,
    reviewer_name_display,
    avatar_bg,
    avatar_icon_color,

    storyreply_title_color,
    storyreply_text_color,
    form_btn_text,
    verified_icon_color,
    form_btn_bg,
    storyreply_card_bg,
    show_reviews_date,
    form_bg_color,
    form_text_color,

    reviewer_text_color,
    review_date,
    review_card_shadow,
    review_card_bg,
    date_format,
    featured_desktop_min_reviews,
    featured_desktop_max_reviews,
    featured_mobile_min_reviews,
    featured_mobile_max_reviews,
    happy_customer_min_reviews_desktop,
    translation_see_more_reviews,
    happy_customer_min_reviews_mobile,
    translation_store_reply,
    happy_customer_show_filterbar,
    translation_verified_buyer,
   happy_customer_page_title,
    happy_customer_page_description,
   happy_customer_reviews_layout,

 
  } = data;
  const [reviewsToShow, setReviewsToShow] = useState(
    happy_customer_min_reviews_desktop,
  );
    const starsDesign = Array.isArray(data?.star_shape) ? data.star_shape : [data.star_shape || "Pointed"];
  const starShape = starsDesign.join();
  const [isMobile, setIsMobile] = useState(false);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const openPortal = () => {
    setIsPortalOpen(true);
  };

  const closePortal = () => {
    setIsPortalOpen(false);
  };

  const averageRate = () => {
    if (filterReviews.length === 0) {
      return 0;
    }
    let totalRating = 0;
    filterReviews.forEach((review) => {
      totalRating += parseInt(review.rating);
    });
   
    return (totalRating / filterReviews.length).toFixed(2);
  };
  const starPaths = {
    Rounded:
      "M259.3 17.8 194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z",
    Pointed:
      "m8 0 1.796 5.528h5.813l-4.703 3.416 1.796 5.528L8 11.056l-4.702 3.416 1.796-5.528L.392 5.528h5.812L8 0Z",
    Hearts:
      "M462.3 62.7C407.5 15.9 332.3 24.3 288 79.3 243.7 24.3 168.5 15.9 113.7 62.7 47.3 118.7 24 191.3 47.6 256c20 55.6 60.5 100 118.7 134.9 23.4 13.9 48.3 27 74.9 39.9 26.6-12.9 51.5-26 74.9-39.9 58.2-34.9 98.7-79.3 118.7-134.9 23.6-64.7.3-137.3-66.1-193.3z",
  };

  const getViewBox = (shape) => {
    switch (shape) {
      case "Rounded":
        return "0 0 576 512";
      case "Pointed":
        return "0 0 16 14";
      case "Heart":
        return "0 0 20 16";
      default:
        return "0 0 576 512";
    }
  };

  const stars = (rate, shape) => {
    const starViews = [];

    for (let index = 1; index <= 5; index++) {
      const filled = index <= rate;

      starViews.push(
        <svg
          key={index}
          className={filled ? "aios-star-fill" : null}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={getViewBox(shape)}
        >
          <path
            fill={filled ? data?.widget_star_color || "#ffce07" : "#cecece"}
            d={starPaths[shape]}
          ></path>
        </svg>,
      );
    }

    return starViews;
  };

  const activeBarHandle = (bar) => {
    if (activeBar != bar) {
      setActiveBar(bar);
      const filter = filterReviews.filter((f) => f.rating == bar);
      setFilterReview(filter);
    } else {
      setActiveBar(false);
      setFilterReview(filterReviews);
    }
  };

  const barView = (shape) => {
    const view = [];
    let ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filterReviews.forEach((review) => {
      const rating = parseInt(review.rating);
      ratingsCount[rating]++;
    });
    const totalReviews = filterReviews.length;
    for (let rating in ratingsCount) {
      var percentage = ((ratingsCount[rating] / totalReviews) * 100).toFixed(2);
      var isClickable = parseFloat(percentage) > 0;
      var v = (
        <div
          className={
            activeBar == rating
              ? "aios-review-star__bar aios-review-star__bar--active"
              : "aios-review-star__bar "
          }
          key={rating}
          onClick={() => isClickable && activeBarHandle(rating)}
          style={{ cursor: isClickable ? "pointer" : "default" }}
        >
          <div className="aios-review-star__bar-star">
            <span>{rating}</span>
            <svg
              className="aios-star-fill"
              xmlns="http://www.w3.org/2000/svg"
              viewBox={getViewBox(shape)}
            >
              <path
                fill={data?.widget_star_color || "#ffce07"}
                d={starPaths[shape]}
              ></path>
            </svg>
          </div>
          <div className="aios-review-star__bar-progress">
            <div className="aios-review-star__bar-progress__ele">
              <div
                className="aios-review-star__bar-progress__ele-inner"
                style={{ width: percentage + "%",backgroundColor:
                  data?.widget_star_color || "#ffce07", }}
              ></div>
            </div>
          </div>
          <div className="aios-review-star__bar-percent">
            <span>({ratingsCount[rating]})</span>
          </div>
        </div>
      );
      view.push(v);
    }
    return view.reverse();
  };

  function processName(name, option) {
    let nameParts = name.split(" ");
    let firstName = nameParts[0];
    let lastName = nameParts[1] || "D";

    switch (option) {
      case "Show full names":
        return `${firstName} ${lastName}`;
      case "Show first name":
        return `${firstName} ${lastName.charAt(0)}.`;
      case "Show initials only":
        return `${firstName.charAt(0)}.${lastName.charAt(0)}.`;
      default:
        return `${firstName} ${lastName}`;
    }
  }
  const styles = {
    wrapper:{
      maxWidth:'1200px',
      margin:'0 auto',
      textAlign:"center"
    },
    heading:{
      fontWeight:"500",
      fontSize:"30px",
      color:"#000",
      margin:'20px 0'
    },
    reviewForm: {
      backgroundColor: form_bg_color,
    },
    gridReviewBackground: {
      backgroundColor: review_card_bg,
      boxShadow: `1px 1px 5px ${review_card_shadow}`,
    },
    reviewLabel: {
      color: form_text_color,
    },
    reviewBtn: {
      backgroundColor: form_btn_bg,
      color: form_btn_text,
    },
    gridReviewName: {
      color: reviewer_name_color,
    },
    gridReviewText: {
      color: reviewer_text_color,
    },
   
    gridReviewDate: {
      color: review_date,
    },
    listAvatarbgColor: {
      backgroundColor: avatar_bg,
      color: avatar_icon_color,
    },
    storeReplyBox: {
      backgroundColor: storyreply_card_bg,
      padding: "16px",
    },
    storeReplyTitle: {
      color: storyreply_title_color,
      textAlign: "left",
      fontWeight: "600",
      marginBottom: "4px",
    },
    storeReplyText: {
      color: storyreply_text_color,
      textAlign: "left",
      lineHeight: "1",
    },
  };
  const formatDate = (dateStr, format) => {
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(-2);

    switch (format) {
      case "yyyy-mm-dd":
        return `${yyyy}-${mm}-${dd}`;
      case "mm-dd-yyyy":
        return `${mm}-${dd}-${yyyy}`;
      case "mm-dd-yy":
        return `${mm}-${dd}-${yy}`;
      case "dd-mm-yyyy":
        return `${dd}-${mm}-${yyyy}`;
      default:
        return `${yyyy}-${mm}-${dd}`;
    }
  };
  

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setReviewsToShow(featured_mobile_min_reviews);
      } else {
        setIsMobile(false);
        setReviewsToShow(featured_desktop_min_reviews);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  const showMoreReviews = () => {
    
    if (isMobile) {
      setReviewsToShow((prev) => Math.min(prev + happy_customer_min_reviews_mobile));
    } else {
      setReviewsToShow((prev) => Math.min(prev + happy_customer_min_reviews_desktop));
    }
  
  };

  return (
    <>
      <div className="aios-happy-review-wrapper" style={styles.wrapper}>
        <div className="aios-happy-page-title" style={styles.heading}>{happy_customer_page_title}</div>
        <div className="aios-happy-page-description">
          {happy_customer_page_description}
        </div>
        <div className="aios-review-layout-header">
          <div className="aios-review-layout-side">
            <div className="aios-review__score">{averageRate()}</div>
            <div className="aios-review__total-star">
              {stars(averageRate(), starShape)}
            </div>
            <div className="aios-review__total-reviews">
              {filterReviews.length} reviews
            </div>
          </div>
          { happy_customer_show_filterbar ? (
            <div
              className={
                activeBar
                  ? "aios-review-layout-star bar-active"
                  : "aios-review-layout-star"
              }
            >
              {barView(starShape)}
            </div>
          ) : (
            ""
          )}
        </div>
      

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="aios-grid"
        columnClassName="aios-grid_column"
      >
        {happy_customer_reviews_layout == "Grid_view" &&
          filterReviews &&
          filterReviews.slice(0, reviewsToShow).map((review, index) => (
            <div
              className="aios-grid-item"
              key={index}
              style={styles.gridReviewBackground}
            >
              {/* {review.image.length > 0 && (
                <img
                  onClick={() => {
                    openPortal();
                    setSelectedReview(index);
                  }}
                  src={review.image[0]}
                  alt={review.name}
                  className="aios-review-image"
                />
              )} */}
              <div className="aios-review-content">
                <div className="aios-review-name" style={styles.gridReviewName}>
                  <span>{review.name}</span>
                  {review.verified && (
                    <div className="aios-review-verified">
                      <svg
                        aria-hidden="true"
                        
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentcolor"
                          d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="aioss-review-star">
                  {stars(parseInt(review.rating), starShape)}
                </div>
                {show_reviews_date ? (
                  <div
                    className="aioss-review-date"
                    style={styles.gridReviewDate}
                  >
                    {formatDate(review.createdAt, date_format)}
                  </div>
                ) : (
                  ""
                )}
                <div
                  className="aioss-review-text"
                  style={styles.gridReviewText}
                >
                  {review.reviewDesc}
                </div>
              </div>
              {review.storeReply == null ? (
                <div
                  className="aios-review-store-reply"
                  style={styles.storeReplyBox}
                >
                  <div className="aios-review-store">
                    <div className="aios-review-store-content">
                      <div
                        className="aios-review aios-review-store-title"
                        style={styles.storeReplyTitle}
                      >
                        Store Reply
                      </div>
                      <div
                        className="aios-review-store-reply-text"
                        style={styles.storeReplyText}
                      >
                        Dummy Text form data
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
      </Masonry>
      {happy_customer_reviews_layout == "List_view" && filterReviews && (
        <div className="aios-grid-list">
        {filterReviews.slice(0, reviewsToShow).map((review, index) => (
          <div className="aios-grid-item" key={index}>
            <div className="aios-review-layout-side">
              <div
                className="aios-review__profile"
                style={styles.listAvatarbgColor}
              >
                {review.name.charAt(0)}
              </div>
              <div className="aios-review-name">
                <span>{processName(review.name, reviewer_name_display)}</span>
                { review.verified && (
                  <div className="aios-review-verified">
                    <svg
                      aria-hidden="true"
                      class=""
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill={verified_icon_color}
                        d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="aios-review-content">
              <div className="aioss-review-star">
                {stars(parseInt(review.rating), starShape)}
              </div>
              {show_reviews_date ? (
                <div className="aioss-review-date">
                  {formatDate(review.createdAt, date_format)}
                </div>
              ) : (
                ""
              )}
              <div className="aioss-review-text">{review.reviewDesc}</div>
              {review.storeReply == null ? (
                <div
                  className="aios-review-store-reply"
                  style={styles.storeReplyBox}
                >
                  <div className="aios-review-store">
                    <div
                      className="aios-review-store__icon aios-review__profile"
                      style={styles.listAvatarbgColor}
                    >
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 616 512"
                      >
                        <path
                          fill={avatar_icon_color}
                          d="M602 118.6 537.1 15C531.3 5.7 521 0 510 0H106C95 0 84.7 5.7 78.9 15L14 118.6c-29.6 47.2-10 110.6 38 130.8v227.4c0 19.4 14.3 35.2 32 35.2h448c17.7 0 32-15.8 32-35.2V249.4c48-20.2 67.6-83.6 38-130.8zm-70 358.2c0 2-.8 3.1-.2 3.2l-446.6.3c-.3-.2-1.2-1.3-1.2-3.5V352h448zM84 320v-64h2.5c29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18.1 20.1 44.3 33.1 73.9 33.1h2.5v64zm494.2-126.5c-7.8 16.6-22.1 27.5-39.3 29.8-3.1.4-6.2.6-9.4.6-19.3 0-37-8-50-22.5L455.7 175l-23.8 26.6c-13 14.5-30.7 22.5-50 22.5s-37-8-50-22.5L308 175l-23.8 26.6c-13 14.5-30.7 22.5-50 22.5s-37-8-50-22.5L160.3 175l-23.8 26.6c-13 14.5-30.7 22.5-50 22.5-3.2 0-6.3-.2-9.4-.6-17.2-2.3-31.5-13.2-39.3-29.8-8.7-18.6-7.5-40.8 3.3-57.9L106 32h404l64.9 103.6c10.8 17.2 12 39.3 3.3 57.9z"
                        ></path>
                      </svg>
                    </div>
                    <div className="aios-review-store-content">
                      <div
                        className="aios-review aios-review-store-title"
                        style={styles.storeReplyTitle}
                      >
                     {translation_store_reply}
                      </div>
                      <div
                        className="aios-review-store-reply-text"
                        style={styles.storeReplyText}
                      >
                        Dummy Text form data
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            {/* <div
              className="aios-review-layout-side"
              onClick={() => {
                openPortal();
                setSelectedReview(index);
              }}
            >
              {review.image.length > 0 && (
                <img
                  src={review.image[0]}
                  alt={review.name}
                  className="aios-review-image"
                />
              )}
            </div> */}
          </div>
        ))}
      </div>
      )}
      <div className="aios-show-reviews-actions-holder">
        {reviewsToShow < filterReviews.length && (
          <button
            className="aios-buttons-show-reviews"
            onClick={showMoreReviews}
          >
           {translation_see_more_reviews}
          </button>
        )}
      </div>
      </div>
      {/* {isPortalOpen && selectedReview > -1 && (
        <ReviewsModel onClose={closePortal}>
          <div className="aios-review-quickview">
            <div className="aios-review-quickview__media">
              {reviews[selectedReview].image.length > 0 && (
                <>
                  <div className="aios-review-quickview__media__main">
                    <img src={reviews[selectedReview].image[activeImage]} />
                  </div>
                  <div className="aios-review-quickview__media__thumb">
                    {reviews[selectedReview].image.map((img, index) => (
                      <img src={img} onClick={() => setActiveImage(index)} />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="aios-review-quickview__info">
              <div className="aios-review-content">
                <div className="aios-review-name">
                  <span>{reviews[selectedReview].name}</span>
                  {reviews[selectedReview].verified && (
                    <div className="aios-review-verified">
                      <svg
                        aria-hidden="true"
                        class=""
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="aioss-review-star">
                  {stars(reviews[selectedReview].rate)}
                </div>
                <div className="aioss-review-date">
                  {reviews[selectedReview].date}
                </div>
                <div className="aioss-review-text">
                  {reviews[selectedReview].text}
                </div>
              </div>
            </div>
          </div>
        </ReviewsModel>
      )} */}
    </>
  );
};

export default HappyCustomers;
