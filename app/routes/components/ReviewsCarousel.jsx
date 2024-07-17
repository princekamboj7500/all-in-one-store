import { BlockStack, Button, ButtonGroup, Card, RangeSlider, RadioButton, ContextualSaveBar, ChoiceList, Text, Page, InlineGrid, Listbox, Select, Tooltip, Checkbox, TextField, Tabs, Box, Layout, Toast, Grid, Frame, InlineStack, Link, Popover, ActionList, Icon } from '@shopify/polaris';
import { AlertCircleIcon} from '@shopify/polaris-icons';
import textcards_img from "./../assets/product_review/textcard.png"
import imagecards_img from "./../assets/product_review/imagecard.png"
import testimonial_img from "./../assets/product_review/testimonial.png"
import arrow1 from "./../assets/product_review/arrow1.png"
import arrow2 from "./../assets/product_review/arrow2.png"
import arrow3 from "./../assets/product_review/arrow3.png"
import arrow4 from "./../assets/product_review/arrow4.png"
import arrow5 from "./../assets/product_review/arrow5.png"
import arrow6 from "./../assets/product_review/arrow6.png"
import arrow7 from "./../assets/product_review/arrow7.png"

function ReviewsCarousel({ formData, handleFocus, handleChange, handleColorChange }) {
    const layout_options = [
        { id: 'imagecards', label: 'Image Cards', imgSrc: imagecards_img },
        { id: 'textcards', label: 'Text Cards', imgSrc: textcards_img },
        { id: 'testimonial', label: 'Testimonial', imgSrc: testimonial_img }
    ];
    const alignment_options = [
        { id: 'Left', label: 'Left' },
        { id: 'Center', label: 'Center' },
        { id: 'Right', label: 'Right' },
    ];
    const ratio_options = [
        { id: 'Square', label: 'Square' },
        { id: 'Potrait', label: 'Potrait' },
    ]
    const arrow_style_options = [
        { id: 'arrow1', imgSrc: arrow1 },
        { id: 'arrow2', imgSrc: arrow2 },
        { id: 'arrow3', imgSrc: arrow3 },
        { id: 'arrow4', imgSrc: arrow4 },
        { id: 'arrow5', imgSrc: arrow5 },
        { id: 'arrow6', imgSrc: arrow6 },
        { id: 'arrow7', imgSrc: arrow7 },
    ]
    return (
        <>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="300">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Publish a Reviews Carousel</Text>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <BlockStack gap={200}>
                                <Text variant="headingSm" as="h6" fontWeight='semibold'> Send reviews to carousel</Text>
                                <BlockStack>
                                    <RadioButton
                                        label="Automatically - Display the most recent 5-star reviews"
                                        checked={formData.reviews_carousel_option === 'automatically'}
                                        id="automatically"
                                        name="reviews_carousel_option"
                                        onChange={() => {
                                            handleChange('automatically', 'reviews_carousel_option')
                                            handleFocus('reviews_carousel_option')
                                        }}
                                    />
                                    <RadioButton
                                        label="Manually by sending reviews to the carousel"
                                        helpText='To curate reviews for carousel display, navigate to the Reviews tab, choose the relevant product, select the desired reviews, and opt for "Send reviews to carousel" under More actions. The most recently sent 15 reviews will be prioritized.'
                                        checked={formData.reviews_carousel_option === 'manually'}
                                        id="manually"
                                        name="reviews_carousel_option"
                                        onChange={() => {
                                            handleChange('manually', 'reviews_carousel_option')
                                            handleFocus('reviews_carousel_option')
                                        }}
                                    />
                                </BlockStack>
                            </BlockStack>
                        </Box>
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Publish and position</Text>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <Checkbox
                                label="Display a Reviews Carousel automatically on your homepage"
                                checked={formData.display_carousel_homepage}
                                onChange={(e) => {
                                    handleFocus("display_carousel_homepage")
                                    handleChange(e, "display_carousel_homepage")
                                }}
                                helpText="This places the Reviews carousel automatically near the end of the homepage. If you want a specific position on the page or you want to place it on other pages, use the editor instead."
                            />
                        </Box>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <BlockStack gap={200}>
                                <Text variant="headingSm" as="h6" fontWeight='regular'>Display manually</Text>
                                <Text variant="headingSm" as="p" fontWeight='regular' tone="subdued" >Place the Reviews Carousel manually on your homepage or other pages using the Shopify editor or Vitals Editor.</Text>
                                <InlineStack align="start">
                                    <ButtonGroup>
                                        <Button onClick={() => { }} accessibilityLabel="Go to editor"> Go to Shopify Editor</Button>
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
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Carousel title </Text>
                        <TextField
                            label={`Title`}
                            value={formData.carousel_title}
                            onChange={(e) => {
                                handleFocus("carousel_title")
                                handleChange(e, "carousel_title")
                            }}
                        />
                        <div className="btn-grp-radio">
                            <ChoiceList
                                title="Title alignment"
                                choices={alignment_options.map(option => ({
                                    label: (
                                        <span className={formData.carousel_title_alignment == option.id ? "labelchecked labelmain" : "labelmain"}>
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
                            label={"Title font size"}
                            min={18}
                            max={44}
                            prefix="18px"
                            suffix="44px"
                            value={formData.carousel_title_size}
                            onChange={(e) => {
                                handleFocus("carousel_title_size")
                                handleChange(e, "carousel_title_size")
                            }}
                        />
                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Layout and design</Text>
                        <div className='img-choicelist'>
                            <ChoiceList
                                title="Layout"
                                choices={layout_options.map(option => ({
                                    label: (
                                        <span className={formData.carousel_layout == option.id ? "labelchecked labelmain" : "labelmain"}>
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
                            <Text >The "Image Cards" layout can only display reviews that contain images. Choose "Text Cards" or "Testimonial" layout for text-only reviews.</Text>
                        </div>
                        <RangeSlider
                            output
                            label={<InlineStack style={{ "margin": "0px" }} >Carousel maximum width
                                <Tooltip content={`This is the maximum width that the carousel can have. It will not exceed the width of its container (section).`}>
                                    <Icon source={AlertCircleIcon} tone='base'></Icon>
                                </Tooltip></InlineStack>}
                            min={800}
                            max={1800}
                            prefix="800px"
                            suffix="1800px"
                            value={formData.carousel_max_width}
                            onChange={(e) => {
                                handleFocus("carousel_max_width")
                                handleChange(e, "carousel_max_width")
                            }}
                        />
                        {(formData.carousel_layout !== "testimonial") &&
                            <RangeSlider
                                output
                                label={"Number of columns on desktop"}
                                min={1}
                                max={6}
                                prefix="1"
                                suffix="6"
                                value={formData.carousel_columns_desktop}
                                onChange={(e) => {
                                    handleFocus("carousel_columns_desktop")
                                    handleChange(e, "carousel_columns_desktop")
                                }}
                            />
                        }
                        <RangeSlider
                            output
                            label={"Maximum number of text rows"}
                            min={1}
                            max={6}
                            prefix="1"
                            suffix="6"
                            value={formData.carousel_max_text_rows}
                            onChange={(e) => {
                                handleFocus("carousel_max_text_rows")
                                handleChange(e, "carousel_max_text_rows")
                            }}
                        />

                        <div className="btn-grp-radio">
                            <ChoiceList
                                title="Reviews alignment"
                                choices={alignment_options.map(option => ({
                                    label: (
                                        <span className={formData.carousel_reviews_alignment == option.id ? "labelchecked labelmain" : "labelmain"}>
                                            <span>{option.label}</span>
                                        </span>
                                    ),
                                    value: option.id,
                                }))}
                                selected={[formData.carousel_reviews_alignment]}
                                onChange={(selected) => {
                                    handleFocus("carousel_reviews_alignment");
                                    handleChange(selected[0], "carousel_reviews_alignment")
                                }}
                            />
                        </div>
                        {(formData.carousel_layout === "imagecards") &&
                            <div className="btn-grp-radio">
                                <ChoiceList
                                    title="Image aspect ratio"
                                    choices={ratio_options.map(option => ({
                                        label: (
                                            <span className={formData.carousel_img_ratio == option.id ? "labelchecked labelmain" : "labelmain"}>
                                                <span>{option.label}</span>
                                            </span>
                                        ),
                                        value: option.id,
                                    }))}
                                    selected={formData.carousel_img_ratio}
                                    onChange={(selected) => {
                                        handleFocus("carousel_img_ratio");
                                        handleChange(selected, "carousel_img_ratio")
                                    }}
                                />
                            </div>
                        }

                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Carousel margins</Text>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <InlineGrid columns={{  sm:"2" }} gap={300}>
                                <TextField
                                    type='number'
                                    label={`Margin top`}
                                    suffix="px"
                                    value={formData.carousel_margin_top}
                                    onChange={(e) => {
                                        handleFocus("carousel_margin_top")
                                        handleChange(e, "carousel_margin_top")
                                    }}
                                />
                                <TextField
                                    type='number'
                                    suffix="px"
                                    label={`Margin bottom`}
                                    value={formData.carousel_margin_bottom}
                                    onChange={(e) => {
                                        handleFocus("carousel_margin_bottom")
                                        handleChange(e, "carousel_margin_bottom")
                                    }}
                                />
                            </InlineGrid>
                        </Box>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <InlineGrid columns={{  sm:"2" }} gap={300}>
                                <TextField
                                    type='number'
                                    label={<Text>Margin top <b>(Mobile)</b></Text>}
                                    suffix="px"
                                    value={formData.carousel_margin_top_mobile}
                                    onChange={(e) => {
                                        handleFocus("carousel_margin_top_mobile")
                                        handleChange(e, "carousel_margin_top_mobile")
                                    }}
                                />
                                <TextField
                                    type='number'
                                    suffix="px"
                                    label={<Text>Margin bottom <b>(Mobile)</b></Text>}
                                    value={formData.carousel_margin_bottom_mobile}
                                    onChange={(e) => {
                                        handleFocus("carousel_margin_bottom_mobile")
                                        handleChange(e, "carousel_margin_bottom_mobile")
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
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Card settings</Text>
                        <InlineGrid columns={{  sm:"2" }} gap={200}>
                            <div className='color_section'>
                                <TextField
                                    label="Text color"
                                    type="text"
                                    onChange={(e) =>{
                                        handleFocus("carouselcard_text_color")
                                        handleChange(e, "carouselcard_text_color ")
                                    }    
                                    }
                                    value={formData.carouselcard_text_color}
                                    autoComplete="off"
                                    connectedLeft={
                                        <input
                                            type="color"
                                            value={formData.carouselcard_text_color}
                                            onChange={(e) =>{
                                                handleFocus("carouselcard_text_color")
                                                handleColorChange(e, "carouselcard_text_color")
                                            } }
                                        />
                                    }
                                />
                            </div>
                            <div className='color_section'>
                                <TextField
                                    label="Background color"
                                    type="text"
                                    onChange={(e) =>{
                                        handleFocus("carouselcard_bg_color")
                                        handleChange(e, "carouselcard_bg_color ")
                                    }}
                                    value={formData.carouselcard_bg_color}
                                    autoComplete="off"
                                    connectedLeft={
                                        <input
                                            type="color"
                                            value={formData.carouselcard_bg_color}
                                            onChange={(e) =>{
                                                handleFocus("carouselcard_bg_color")
                                                handleColorChange(e, "carouselcard_bg_color")
                                            }}
                                        />
                                    }
                                />
                            </div>
                            <div className='color_section'>
                                <TextField
                                    label="Stars color"
                                    type="text"
                                    onChange={(e) =>{
                                        handleFocus("carouselcard_stars_color")
                                        handleChange(e, "carouselcard_stars_color ")
                                    }  }
                                    value={formData.carouselcard_stars_color}
                                    autoComplete="off"
                                    connectedLeft={
                                        <input
                                            type="color"
                                            value={formData.carouselcard_stars_color}
                                            onChange={(e) =>{
                                                handleFocus("carouselcard_stars_color")
                                                handleColorChange(e, "carouselcard_stars_color")
                                            }
                                            }
                                        />
                                    }
                                />
                            </div>
                        </InlineGrid>
                        <hr style={{
                            "height": "1px", "margin": "0px", "border": "none", "background": "#d9d9d9"
                        }} />
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Border</Text>
                        <Checkbox
                            label={"Show shadow"}
                            checked={formData.carouselcard_show_shadow}
                            onChange={(e) => {
                                handleFocus("carouselcard_show_shadow")
                                handleChange(e, "carouselcard_show_shadow")
                            }}
                        />
                        <Checkbox
                            label={"Show border"}
                            checked={formData.carouselcard_show_border}
                            onChange={(e) => {
                                handleFocus("carouselcard_show_border")
                                handleChange(e, "carouselcard_show_border")
                            }}
                        />
                        {formData.carouselcard_show_border &&
                            <div className='color_section'>
                                <TextField
                                    label="Border color"
                                    type="text"
                                    onChange={(e) =>{
                                        handleFocus("carouselcard_border_color")
                                        handleChange(e, "carouselcard_border_color ")
                                    } }
                                    value={formData.carouselcard_border_color}
                                    autoComplete="off"
                                    connectedLeft={
                                        <input
                                            type="color"
                                            value={formData.carouselcard_border_color}
                                            onChange={(e) =>{
                                                handleFocus("carouselcard_border_color")
                                                handleColorChange(e, "carouselcard_border_color")
                                            } }
                                        />
                                    }
                                />
                            </div>
                        }
                        <RangeSlider
                            output
                            label={"Rounded corners"}
                            min={0}
                            max={50}
                            prefix="0px"
                            suffix="50px"
                            value={formData.carouselcard_radius}
                            onChange={(e) => {
                                handleFocus("carouselcard_radius")
                                handleChange(e, "carouselcard_radius")
                            }}
                        />
                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card>
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Carousel arrows</Text>
                        <div className='img-choicelist arrows-choicelist'>
                            <ChoiceList
                                choices={arrow_style_options.map(option => ({
                                    label: (
                                        <span className={formData.carousel_arrow == option.id ? "labelchecked labelmain" : "labelmain"}>
                                            {option.label}
                                            <img src={option.imgSrc} alt={option.label} />
                                        </span>
                                    ),
                                    value: option.id,
                                }))}
                                selected={formData.carousel_arrow}
                                onChange={(selected) => {
                                    handleFocus("carousel_arrow");
                                    handleChange(selected, "carousel_arrow")
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