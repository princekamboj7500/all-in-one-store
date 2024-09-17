import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  RangeSlider,
  RadioButton,
  ContextualSaveBar,
  ChoiceList,
  Text,
  Page,
  InlineGrid,
  Listbox,
  Select,
  Tooltip,
  Checkbox,
  TextField,
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
  Icon,
} from "@shopify/polaris";
import { AlertCircleIcon } from "@shopify/polaris-icons";
import textcards_img from "./../assets/product_review/textcard.png";
import imagecards_img from "./../assets/product_review/imagecard.png";
import testimonial_img from "./../assets/product_review/testimonial.png";
import arrow1 from "./../assets/product_review/arrow1.png";
import arrow2 from "./../assets/product_review/arrow2.png";
import arrow3 from "./../assets/product_review/arrow3.png";
import arrow4 from "./../assets/product_review/arrow4.png";
import arrow5 from "./../assets/product_review/arrow5.png";
import arrow6 from "./../assets/product_review/arrow6.png";
import arrow7 from "./../assets/product_review/arrow7.png";
import { useTranslation } from "react-i18next";
function ReviewsCarousel({
  shop,
  formData,
  handleFocus,
  handleChange,
  handleColorChange,
}) {
  let { t } = useTranslation();
  const layout_options = [
    { id: "imagecards", label: "Image Cards", imgSrc: imagecards_img },
    { id: "textcards", label: "Text Cards", imgSrc: textcards_img },
    { id: "testimonial", label: "Testimonial", imgSrc: testimonial_img },
  ];
  const alignment_options = [
    { id: "Left", label: "Left" },
    { id: "Center", label: "Center" },
    { id: "Right", label: "Right" },
  ];
  const ratio_options = [
    { id: "Square", label: "Square" },
    { id: "Potrait", label: "Potrait" },
  ];
  const arrow_style_options = [
    { id: "arrow1", imgSrc: arrow1 },
    { id: "arrow2", imgSrc: arrow2 },
    { id: "arrow3", imgSrc: arrow3 },
    { id: "arrow4", imgSrc: arrow4 },
    { id: "arrow5", imgSrc: arrow5 },
    { id: "arrow6", imgSrc: arrow6 },
    { id: "arrow7", imgSrc: arrow7 },
  ];

  const handleCarouselClick = () => {
    window.open(
      `https://admin.shopify.com/store/${shop.replace(".myshopify.com", "")}/admin/themes/current/editor?&addAppBlockId=8177ef1b-fb1c-4ebb-a686-d743f22ea714/productcarousel&target=newAppsSection`,
      "__blank",
    );
  };
  return (
    <>
      <Layout.Section>
        <Card roundedAbove="sm">
          <BlockStack gap="300">
            <Text variant="headingSm" as="h6" fontWeight="semibold">
            {t('carousel.position')}
            </Text>

            <Box
              background="bg-surface-secondary"
              padding="200"
              borderRadius="200"
            >
              <BlockStack gap={200}>
                <Text variant="headingSm" as="h6" fontWeight="regular">
                {t('carousel.Display')}
                </Text>
                <Text
                  variant="headingSm"
                  as="p"
                  fontWeight="regular"
                  tone="subdued"
                >
                 {t('carousel.pages')} 
                </Text>
                <InlineStack align="start">
                  <ButtonGroup>
                    <Button
                      onClick={handleCarouselClick}
                      accessibilityLabel={t('carousel.go')} 
                    >
                      {" "}
                      {t('carousel.Go')}
                    </Button>
                  </ButtonGroup>
                </InlineStack>
              </BlockStack>
            </Box>
          </BlockStack>
        </Card>
      </Layout.Section>
      <Layout.Section>
        <Card roundedAbove="sm">
          <BlockStack gap="400">
            <Text variant="headingSm" as="h6" fontWeight="semibold">
            {t('carousel.car')}{" "}
            </Text>
            <TextField
              label={t('carousel.Title2')}
              value={formData.carousel_title}
              onChange={(e) => {
                handleFocus("carousel_title");
                handleChange(e, "carousel_title");
              }}
            />
            <div className="btn-grp-radio">
              <ChoiceList
                title={t('carousel.Tit')}
                choices={alignment_options.map((option) => ({
                  label: (
                    <span
                      className={
                        formData.carousel_title_alignment == option.id
                          ? "labelchecked labelmain"
                          : "labelmain"
                      }
                    >
                      <span>{option.label}</span>
                    </span>
                  ),
                  value: option.id,
                }))}
                selected={[formData.carousel_title_alignment]}
                onChange={(selected) => {
                  handleFocus("carousel_title_alignment");
                  handleChange(selected[0], "carousel_title_alignment");
                }}
              />
            </div>
            <RangeSlider
              output
              label={t('carousel.Title')}
              min={18}
              max={44}
              prefix="18px"
              suffix="44px"
              value={formData.carousel_title_size}
              onChange={(e) => {
                handleFocus("carousel_title_size");
                handleChange(e, "carousel_title_size");
              }}
            />
          </BlockStack>
        </Card>
      </Layout.Section>
      <Layout.Section>
        <Card roundedAbove="sm">
          <BlockStack gap="400">
            <Text variant="headingSm" as="h6" fontWeight="semibold">
            {t('carousel.design')}
            </Text>
            <div className="img-choicelist">
              <ChoiceList
                title={t('carousel.lay')}
                choices={layout_options.map((option) => ({
                  label: (
                    <span
                      className={
                        formData.carousel_layout == option.id
                          ? "labelchecked labelmain"
                          : "labelmain"
                      }
                    >
                      {option.label}
                      <img src={option.imgSrc} alt={option.label} />
                    </span>
                  ),
                  value: option.id,
                }))}
                selected={[formData.carousel_layout]}
                onChange={(selected) => {
                  handleFocus("carousel_layout");
                  handleChange(selected[0], "carousel_layout");
                }}
              />
              <Text>
              {t('carousel.Cards')}
              </Text>
            </div>
            <RangeSlider
              output
              label={
                <InlineStack style={{ margin: "0px" }}>
                  {t('carousel.max')}
                  <Tooltip
                    content={t('carousel.width')}
                  >
                    <Icon source={AlertCircleIcon} tone="base"></Icon>
                  </Tooltip>
                </InlineStack>
              }
              min={800}
              max={1800}
              prefix="800px"
              suffix="1800px"
              value={formData.carousel_max_width}
              onChange={(e) => {
                handleFocus("carousel_max_width");
                handleChange(e, "carousel_max_width");
              }}
            />
            {formData.carousel_layout !== "testimonial" && (
              <RangeSlider
                output
                label={t('carousel.columns')}
                min={1}
                max={6}
                prefix="1"
                suffix="6"
                value={formData.carousel_columns_desktop}
                onChange={(e) => {
                  handleFocus("carousel_columns_desktop");
                  handleChange(e, "carousel_columns_desktop");
                }}
              />
            )}
            <RangeSlider
              output
              label={t('carousel.Maximum')}
              min={1}
              max={6}
              prefix="1"
              suffix="6"
              value={formData.carousel_max_text_rows}
              onChange={(e) => {
                handleFocus("carousel_max_text_rows");
                handleChange(e, "carousel_max_text_rows");
              }}
            />

            <div className="btn-grp-radio">
              <ChoiceList
                title={t('carousel.alignment')}
                choices={alignment_options.map((option) => ({
                  label: (
                    <span
                      className={
                        formData.carousel_reviews_alignment == option.id
                          ? "labelchecked labelmain"
                          : "labelmain"
                      }
                    >
                      <span>{option.label}</span>
                    </span>
                  ),
                  value: option.id,
                }))}
                selected={[formData.carousel_reviews_alignment]}
                onChange={(selected) => {
                  handleFocus("carousel_reviews_alignment");
                  handleChange(selected[0], "carousel_reviews_alignment");
                }}
              />
            </div>
            {formData.carousel_layout === "imagecards" && (
              <div className="btn-grp-radio">
                <ChoiceList
                  title={t('carousel.ratio')}
                  choices={ratio_options.map((option) => ({
                    label: (
                      <span
                        className={
                          formData.carousel_img_ratio == option.id
                            ? "labelchecked labelmain"
                            : "labelmain"
                        }
                      >
                        <span>{option.label}</span>
                      </span>
                    ),
                    value: option.id,
                  }))}
                  selected={formData.carousel_img_ratio}
                  onChange={(selected) => {
                    handleFocus("carousel_img_ratio");
                    handleChange(selected, "carousel_img_ratio");
                  }}
                />
              </div>
            )}
          </BlockStack>
        </Card>
      </Layout.Section>
      <Layout.Section>
        <Card roundedAbove="sm">
          <BlockStack gap="400">
            <Text variant="headingSm" as="h6" fontWeight="semibold">
            {t('carousel.margins')}
            </Text>
            <Box
              background="bg-surface-secondary"
              padding="200"
              borderRadius="200"
            >
              <InlineGrid columns={{ sm: "2" }} gap={300}>
                <TextField
                  type="number"
                  label={t('carousel.mt')}
                  suffix="px"
                  value={formData.carousel_margin_top}
                  onChange={(e) => {
                    handleFocus("carousel_margin_top");
                    handleChange(e, "carousel_margin_top");
                  }}
                />
                <TextField
                  type="number"
                  suffix="px"
                  label={t('carousel.mb')}
                  value={formData.carousel_margin_bottom}
                  onChange={(e) => {
                    handleFocus("carousel_margin_bottom");
                    handleChange(e, "carousel_margin_bottom");
                  }}
                />
              </InlineGrid>
            </Box>
            <Box
              background="bg-surface-secondary"
              padding="200"
              borderRadius="200"
            >
              <InlineGrid columns={{ sm: "2" }} gap={300}>
                <TextField
                  type="number"
                  label={
                    <Text>
                      {t('carousel.top')}
                    </Text>
                  }
                  suffix="px"
                  value={formData.carousel_margin_top_mobile}
                  onChange={(e) => {
                    handleFocus("carousel_margin_top_mobile");
                    handleChange(e, "carousel_margin_top_mobile");
                  }}
                />
                <TextField
                  type="number"
                  suffix="px"
                  label={
                    <Text>
                      {t('carousel.Margin')}
                    </Text>
                  }
                  value={formData.carousel_margin_bottom_mobile}
                  onChange={(e) => {
                    handleFocus("carousel_margin_bottom_mobile");
                    handleChange(e, "carousel_margin_bottom_mobile");
                  }}
                />
              </InlineGrid>
            </Box>
          </BlockStack>
        </Card>
      </Layout.Section>
      <Layout.Section>
        <Card roundedAbove="sm">
          <BlockStack gap="400">
            <Text variant="headingSm" as="h6" fontWeight="semibold">
            {t('carousel.Card')}
            </Text>
            <InlineGrid columns={{ sm: "2" }} gap={200}>
              <div className="color_section">
                <TextField
                  label={t('carousel.Text')}
                  type="text"
                  onChange={(e) => {
                    handleFocus("carouselcard_text_color");
                    handleChange(e, "carouselcard_text_color ");
                  }}
                  value={formData.carouselcard_text_color}
                  autoComplete="off"
                  connectedLeft={
                    <input
                      type="color"
                      value={formData.carouselcard_text_color}
                      onChange={(e) => {
                        handleFocus("carouselcard_text_color");
                        handleColorChange(e, "carouselcard_text_color");
                      }}
                    />
                  }
                />
              </div>
              <div className="color_section">
                <TextField
                  label={t('carousel.Background')}
                  type="text"
                  onChange={(e) => {
                    handleFocus("carouselcard_bg_color");
                    handleChange(e, "carouselcard_bg_color ");
                  }}
                  value={formData.carouselcard_bg_color}
                  autoComplete="off"
                  connectedLeft={
                    <input
                      type="color"
                      value={formData.carouselcard_bg_color}
                      onChange={(e) => {
                        handleFocus("carouselcard_bg_color");
                        handleColorChange(e, "carouselcard_bg_color");
                      }}
                    />
                  }
                />
              </div>
              <div className="color_section">
                <TextField
                  label={t('carousel.Stars')}
                  type="text"
                  onChange={(e) => {
                    handleFocus("carouselcard_stars_color");
                    handleChange(e, "carouselcard_stars_color ");
                  }}
                  value={formData.carouselcard_stars_color}
                  autoComplete="off"
                  connectedLeft={
                    <input
                      type="color"
                      value={formData.carouselcard_stars_color}
                      onChange={(e) => {
                        handleFocus("carouselcard_stars_color");
                        handleColorChange(e, "carouselcard_stars_color");
                      }}
                    />
                  }
                />
              </div>
            </InlineGrid>
            <hr
              style={{
                height: "1px",
                margin: "0px",
                border: "none",
                background: "#d9d9d9",
              }}
            />
            <Text variant="headingSm" as="h6" fontWeight="semibold">
            {t('carousel.Border2')}
            </Text>
            <Checkbox
              label={t('carousel.shadow')}
              checked={formData.carouselcard_show_shadow}
              onChange={(e) => {
                handleFocus("carouselcard_show_shadow");
                handleChange(e, "carouselcard_show_shadow");
              }}
            />
            <Checkbox
              label={t('carousel.Show')}
              checked={formData.carouselcard_show_border}
              onChange={(e) => {
                handleFocus("carouselcard_show_border");
                handleChange(e, "carouselcard_show_border");
              }}
            />
            {formData.carouselcard_show_border && (
              <div className="color_section">
                <TextField
                  label={t('carousel.Border')}
                  type="text"
                  onChange={(e) => {
                    handleFocus("carouselcard_border_color");
                    handleChange(e, "carouselcard_border_color ");
                  }}
                  value={formData.carouselcard_border_color}
                  autoComplete="off"
                  connectedLeft={
                    <input
                      type="color"
                      value={formData.carouselcard_border_color}
                      onChange={(e) => {
                        handleFocus("carouselcard_border_color");
                        handleColorChange(e, "carouselcard_border_color");
                      }}
                    />
                  }
                />
              </div>
            )}
            <RangeSlider
              output
              label={t('carousel.corners')}
              min={0}
              max={50}
              prefix="0px"
              suffix="50px"
              value={formData.carouselcard_radius}
              onChange={(e) => {
                handleFocus("carouselcard_radius");
                handleChange(e, "carouselcard_radius");
              }}
            />
          </BlockStack>
        </Card>
      </Layout.Section>
      <Layout.Section>
        <Card>
          <BlockStack gap="400">
            <Text variant="headingSm" as="h6" fontWeight="semibold">
            {t('carousel.arrows')}
            </Text>
            <div className="img-choicelist arrows-choicelist">
              <ChoiceList
                choices={arrow_style_options.map((option) => ({
                  label: (
                    <span
                      className={
                        formData.carousel_arrow == option.id
                          ? "labelchecked labelmain"
                          : "labelmain"
                      }
                    >
                      {option.label}
                      <img src={option.imgSrc} alt={option.label} />
                    </span>
                  ),
                  value: option.id,
                }))}
                selected={formData.carousel_arrow}
                onChange={(selected) => {
                  handleFocus("carousel_arrow");
                  handleChange(selected, "carousel_arrow");
                }}
              />
            </div>
          </BlockStack>
        </Card>
      </Layout.Section>
    </>
  );
}

export default ReviewsCarousel;
