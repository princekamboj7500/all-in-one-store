import { BlockStack, Button, ButtonGroup, Card, RadioButton, ContextualSaveBar, ChoiceList, Text, Page, InlineGrid, Listbox, Select, Tooltip, Checkbox, TextField, Tabs, Box, Layout, Toast, Grid, Frame, InlineStack, Link, Popover, ActionList, Icon } from '@shopify/polaris';
import {
    ExternalIcon, XIcon, AlertCircleIcon
} from '@shopify/polaris-icons';
import rounded from "./../assets//product_review/rounded.svg"
import pointed from "./../assets/product_review/pointed.svg"
import hearts from "./../assets/product_review/hearts.svg"
import gridimg from "./../assets/product_review/grid.png"
import listimg from "./../assets/product_review/list.png"


function ReviewsWidget({ formData, handleFocus, handleChange, handleColorChange }) {

    const star_shape_options = [
        { id: 'Rounded', label: 'Rounded corners', imgSrc: rounded },
        { id: 'Pointed', label: 'Pointed corners', imgSrc: pointed },
        { id: 'Hearts', label: 'Hearts', imgSrc: hearts },
    ];
   
    const review_layout_options = [
        { id: 'Grid_view', label: 'Grid View', imgSrc: gridimg },
        { id: 'List_view', label: 'List View', imgSrc: listimg }
    ];
    const card_clickable_options = [
        { label: 'Select an option', value: 'Select an option', disabled: true },
        { label: 'Open modal by clicking on images', value: 'Open modal by clicking on images' },
        { label: 'Open modal by clicking anywhere on the review card', value: 'Open modal by clicking anywhere on the review card' },
    ]
    const review_date_options = [
        { label: 'Select an option', value: 'Select an option', disabled: true },
        { label: 'Show real dates', value: 'Show real dates' },
        { label: 'Show recent dates', value: 'Show recent dates' }
    ]
    const date_format_options = [
        { label: 'Select an option', value: 'Select an option', disabled: true },
        { label: 'yyyy-mm-dd', value: 'yyyy-mm-dd' },
        { label: 'mm-dd-yyyy', value: 'mm-dd-yyyy' },
        { label: 'mm-dd-yy', value: 'mm-dd-yy' },
        { label: 'dd-mm-yyyy', value: 'dd-mm-yyyy' },
    ]
    const reviewer_name_options = [
        { label: 'Select an option', value: 'Select an option', disabled: true },
        { label: 'Show full names', value: 'Show full names' },
       
        { label: 'Show first name (John Doe becomes John D.)', value: 'Show first name' },
        { label: 'Show initials only (John Doe becomes J.D.)', value: 'Show initials only' },
    ]
    const columns_on_mobile_options = [
        { label: 'Select an option', value: 'Select an option', disabled: true },
        { label: '1 column', value: '1 column' },
        { label: '2 columns', value: '2 columns' },
    ]
    return (
        <>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>General</Text>
                        <div className='img-choicelist star-shape'>
                            <ChoiceList
                                title="Star Shape"
                                choices={star_shape_options.map(option => ({
                                    label: (
                                        <span className={formData.star_shape == option.id ? "labelchecked labelmain" : "labelmain"}>
                                            {option.label}
                                            <img src={option.imgSrc} alt={option.label} />
                                        </span>
                                    ),
                                    value: option.id,
                                }))}
                                selected={formData.star_shape}
                                onChange={(selected) => {
                                    handleFocus("star_shape");
                                    handleChange(selected, "star_shape")
                                }}
                            />
                        </div>
                        <div className='color_section'>
                            <TextField
                                label={<InlineStack style={{ "margin": "0px" }} gap={300}>Star color
                                    <Tooltip content={`This controls the colors of the stars in every widget except the Reviews Carousel.`}>
                                        <Icon source={AlertCircleIcon} tone='base'></Icon>
                                    </Tooltip></InlineStack>}
                                type="text"
                                onChange={(e) => {
                                    handleFocus("widget_star_color")
                                    handleChange(e, "widget_star_color ")
                                }
                                }
                                value={formData.widget_star_color}
                                autoComplete="off"
                                connectedLeft={
                                    <input
                                        type="color"
                                        value={formData.widget_star_color}
                                        onChange={(e) => {
                                            handleFocus("widget_star_color")
                                            handleColorChange(e, "widget_star_color")
                                        }}
                                    />
                                }
                            />
                        </div>
                      
                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Product page layout</Text>
                        <div className='img-choicelist'>
                            <ChoiceList
                                title="Reviews layout"
                                choices={review_layout_options.map(option => ({
                                    label: (
                                        <span className={formData.reviews_layout == option.id ? "labelchecked labelmain" : "labelmain"}>
                                            {option.label}
                                            <img src={option.imgSrc} alt={option.label} />
                                        </span>
                                    ),
                                    value: option.id,
                                }))}
                                selected={formData.reviews_layout}
                                onChange={(selected) => {
                                    handleFocus("reviews_layout");
                                    handleChange(selected, "reviews_layout")
                                }}
                                helpText="You can change the design settings for this layout in the Layout design settings section below."
                            />
                        </div>
                        <Checkbox
                            label="Show rating filter bars"
                            checked={formData.show_rating_filterbar}
                            onChange={(e) => {
                                handleFocus("show_rating_filterbar")
                                handleChange(e, "show_rating_filterbar")
                            }}
                            helpText="Display a breakdown of all reviews using progress bars at the top of the reviews list, allowing easy filtering."
                        />
                        <Checkbox
                            label="Show review box for products with zero reviews"
                            checked={formData.show_reviewbox_whenzero}
                            onChange={(e) => {
                                handleFocus("show_reviewbox_whenzero")
                                handleChange(e, "show_reviewbox_whenzero")
                            }}
                        />
                        {/* <Checkbox
                            label="Hide the Product Reviews Main Widget on the product page"
                            checked={formData.hide_review_mainwidget}
                            onChange={(e) => {
                                handleFocus("hide_review_mainwidget")
                                handleChange(e, "hide_review_mainwidget")
                            }}
                            helpText="Check this option if you want to use other Product Reviews widgets (like Carousel) while hiding the Main Widget from the product page. However, this won't hide the widget if placed via Shopify or Vitals Editor."
                        /> */}
                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Number of reviews on product page</Text>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <BlockStack gap="200">
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>Desktop</Text>
                                <InlineGrid columns={{  sm:"2" }} gap={200}>
                                    <TextField
                                        type='number'
                                        label={`Number of reviews before showing more`}
                                        value={formData.desktop_min_reviews}
                                        onChange={(e) => {
                                            handleFocus("desktop_min_reviews")
                                            handleChange(e, "desktop_min_reviews")
                                        }}
                                    />
                                    <TextField
                                        type='number'
                                        label={`Maximum number of reviews`}
                                        value={formData.desktop_max_reviews}
                                        onChange={(e) => {
                                            handleFocus("desktop_max_reviews")
                                            handleChange(e, "desktop_max_reviews")
                                        }
                                        }
                                    />
                                </InlineGrid>
                            </BlockStack>
                            <div className="">

                            </div>
                        </Box>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <BlockStack gap="200">
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>Mobile</Text>
                                <InlineGrid  columns={{  sm:"2" }} gap={200}>
                                    <TextField
                                        type='number'
                                        label={`Number of reviews before showing more`}
                                        value={formData.mobile_min_reviews}
                                        onChange={(e) => {
                                            handleFocus("mobile_min_reviews")
                                            handleChange(e, "mobile_min_reviews")
                                        }}
                                    />
                                    <TextField
                                        type='number'
                                        label={`Maximum number of reviews`}
                                        value={formData.mobile_max_reviews}
                                        onChange={(e) => {
                                            handleFocus("mobile_max_reviews")
                                            handleChange(e, "mobile_max_reviews")
                                        }
                                        }
                                    />
                                </InlineGrid>
                            </BlockStack>
                        </Box>
                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Reviews information</Text>
                       
                        <Checkbox
                            label="Show review dates"
                            checked={formData.show_reviews_date}
                            onChange={(e) => {
                                handleFocus("show_reviews_date")
                                handleChange(e, "show_reviews_date")
                            }}
                        />
                        
                        <Select
                            label="Date format"
                            options={date_format_options}
                            onChange={(e) => {
                                handleFocus("date_format")
                                handleChange(e, "date_format")
                            }}
                            value={formData.date_format}
                        />
                        <Select
                            label="Reviewer name display method"
                            options={reviewer_name_options}
                            onChange={(e) => {
                                handleFocus("reviewer_name_display")
                                handleChange(e, "reviewer_name_display")
                            }}
                            value={formData.reviewer_name_display}
                        />
                        <hr style={{
                            "height": "1px", "margin": "6px", "border": "none", "background": "#d9d9d9"
                        }} />
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Verified purchase icon</Text>
                        <Checkbox
                            label={<InlineStack gap="200">Show "Verified purchase” icon
                                <Tooltip
                                    content={`If enabled, it will show a Verified icon after the reviewer's name for those reviews that are deemed to be made by verified buyers. When customers leave feedback on your products and we are able to match their data to your orders, we tag the reviews as verified automatically. You can also mark any review as verified.`}>
                                    <Icon source={AlertCircleIcon} tone='base'></Icon></Tooltip></InlineStack>}
                            checked={formData.verified_icon}
                            onChange={(e) => {
                                handleFocus("verified_icon")
                                handleChange(e, "verified_icon")
                            }}
                        />
                        <div className='color_section'>
                            <TextField
                                label="Verified icon color"
                                type="text"
                                onChange={(e) =>{
                                    handleFocus("verified_icon_color")
                                    handleChange(e, "verified_icon_color ")
                                }}
                                value={formData.verified_icon_color}
                                autoComplete="off"
                                connectedLeft={
                                    <input
                                        type="color"
                                        value={formData.verified_icon_color}
                                        onChange={(e) =>{
                                            handleFocus("verified_icon_color")
                                            handleColorChange(e, "verified_icon_color")
                                        } }
                                    />
                                }
                            />
                        </div>

                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Layout design settings</Text>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <BlockStack gap="200">
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>Grid</Text>
                                <InlineGrid  columns={{  sm:"2" }} gap={200}>
                                    <div className='color_section'>
                                        <TextField
                                            label="Reviewer name"
                                            type="text"
                                            value={formData.reviewer_name_color}
                                            onChange={(e) => {
                                                handleFocus("reviewer_name_color")
                                                handleChange(e, "reviewer_name_color")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={formData.reviewer_name_color}
                                                    onChange={(e) => {
                                                        handleFocus("reviewer_name_color")
                                                        handleColorChange(e, "reviewer_name_color")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                    <div className='color_section'>
                                        <TextField
                                            label="Review text"
                                            type="text"
                                            value={formData.reviewer_text_color}
                                            onChange={(e) => {
                                                handleFocus("reviewer_text_color")
                                                handleChange(e, "reviewer_text_color")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={formData.reviewer_text_color}
                                                    onChange={(e) => {
                                                        handleFocus("reviewer_text_color")
                                                        handleColorChange(e, "reviewer_text_color")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                    <div className='color_section'>
                                        <TextField
                                            label="Review card background"
                                            type="text"
                                            value={formData.review_card_bg}
                                            onChange={(e) => {
                                                handleFocus("review_card_bg")
                                                handleChange(e, "review_card_bg")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={formData.review_card_bg}
                                                    onChange={(e) => {
                                                        handleFocus("review_card_bg")
                                                        handleColorChange(e, "review_card_bg")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                    <div className='color_section'>
                                        <TextField
                                            label="Review card shadow"
                                            type="text"
                                            value={formData.review_card_shadow}
                                            onChange={(e) => {
                                                handleFocus("review_card_shadow")
                                                handleChange(e, "review_card_shadow")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={formData.review_card_shadow}
                                                    onChange={(e) => {
                                                        handleFocus("review_card_shadow")
                                                        handleColorChange(e, "review_card_shadow")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                    <div className='color_section'>
                                        <TextField
                                            label="Review date"
                                            type="text"
                                            value={formData.review_date}
                                            onChange={(e) => {
                                                handleFocus("review_date")
                                                handleChange(e, "review_date")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={formData.review_date}
                                                    onChange={(e) => {
                                                        handleFocus("review_date")
                                                        handleColorChange(e, "review_date")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                </InlineGrid>
                                </BlockStack>
                        </Box>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <BlockStack gap="200">
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>List</Text>
                                <InlineGrid columns={{  sm:"2" }} gap={200}>
                                    <div className='color_section'>
                                        <TextField
                                            label="Avatar background"
                                            type="text"
                                            value={formData.avatar_bg}
                                            onChange={(e) => {
                                                handleFocus("avatar_bg")
                                                handleChange(e, "avatar_bg")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={formData.avatar_bg}
                                                    onChange={(e) => {
                                                        handleFocus("avatar_bg")
                                                        handleColorChange(e, "avatar_bg")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                    <div className='color_section'>
                                        <TextField
                                            label="Avatar icon"
                                            type="text"
                                            value={formData.avatar_icon_color}
                                            onChange={(e) => {
                                                handleFocus("avatar_icon_color")
                                                handleChange(e, "avatar_icon_color")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={formData.avatar_icon_color}
                                                    onChange={(e) => {
                                                        handleFocus("avatar_icon_color")
                                                        handleColorChange(e, "avatar_icon_color")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                </InlineGrid>
                            </BlockStack>
                        </Box>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <BlockStack gap="200">
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>List</Text>
                                <InlineGrid  columns={{  sm:"2" }} gap={200}>
                                    <div className='color_section'>
                                        <TextField
                                            label="Store reply title"
                                            type="text"
                                            value={formData.storyreply_title_color}
                                            onChange={(e) => {
                                                handleFocus("storyreply_title_color")
                                                handleChange(e, "storyreply_title_color")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={formData.storyreply_title_color}
                                                    onChange={(e) => {
                                                        handleFocus("storyreply_title_color")
                                                        handleColorChange(e, "storyreply_title_color")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                    <div className='color_section'>
                                        <TextField
                                            label="Store reply text"
                                            type="text"
                                            value={formData.storyreply_text_color}
                                            onChange={(e) => {
                                                handleFocus("storyreply_text_color")
                                                handleChange(e, "storyreply_text_color")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={formData.storyreply_text_color}
                                                    onChange={(e) => {
                                                        handleFocus("storyreply_text_color")
                                                        handleColorChange(e, "storyreply_text_color")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                    <div className='color_section'>
                                        <TextField
                                            label="Store reply card background"
                                            type="text"
                                            value={formData.storyreply_card_bg}
                                            onChange={(e) => {
                                                handleFocus("storyreply_card_bg")
                                                handleChange(e, "storyreply_card_bg")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={formData.storyreply_card_bg}
                                                    onChange={(e) => {
                                                        handleFocus("storyreply_card_bg")
                                                        handleColorChange(e, "storyreply_card_bg")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                </InlineGrid>
                            </BlockStack>
                        </Box>
                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Write a review form</Text>
                        <Checkbox
                            label="Allow customers to upload a photo"
                            checked={formData.form_allow_img}
                            onChange={(e) => {
                                handleFocus("form_allow_img")
                                handleChange(e, "form_allow_img")
                            }}
                        />
                        <InlineGrid  columns={{  sm:"2" }} gap={200}>
                            <div className='color_section'>
                                <TextField
                                    label="Form text"
                                    type="text"
                                    value={formData.form_text_color}
                                    onChange={(e) => {
                                        handleFocus("form_text_color")
                                        handleChange(e, "form_text_color")
                                    }}
                                    autoComplete="off"
                                    connectedLeft={
                                        <input
                                            type="color"
                                            value={formData.form_text_color}
                                            onChange={(e) => {
                                                handleFocus("form_text_color")
                                                handleColorChange(e, "form_text_color")
                                            }
                                            }
                                        />
                                    }
                                />
                            </div>
                            <div className='color_section'>
                                <TextField
                                    label="Form background"
                                    type="text"
                                    value={formData.form_bg_color}
                                    onChange={(e) => {
                                        handleFocus("form_bg_color")
                                        handleChange(e, "form_bg_color")
                                    }}
                                    autoComplete="off"
                                    connectedLeft={
                                        <input
                                            type="color"
                                            value={formData.form_bg_color}
                                            onChange={(e) => {
                                                handleFocus("form_bg_color")
                                                handleColorChange(e, "form_bg_color")
                                            }
                                            }
                                        />
                                    }
                                />
                            </div>
                            <div className='color_section'>
                                <TextField
                                    label={<InlineStack gap={200}>Button text
                                        <Tooltip content={`Controls the color of 2 buttons:
                                                            - Write review button
                                                            - Submit review button
                                                            `}>
                                            <Icon source={AlertCircleIcon} tone='base'></Icon></Tooltip></InlineStack>}
                                    type="text"
                                    value={formData.form_btn_text}
                                    onChange={(e) => {
                                        handleFocus("form_btn_text")
                                        handleChange(e, "form_btn_text")
                                    }}
                                    autoComplete="off"
                                    connectedLeft={
                                        <input
                                            type="color"
                                            value={formData.form_btn_text}
                                            onChange={(e) => {
                                                handleFocus("form_btn_text")
                                                handleColorChange(e, "form_btn_text")
                                            }
                                            }
                                        />
                                    }
                                />
                            </div>
                            <div className='color_section'>
                                <TextField
                                    label={<InlineStack gap={200} >Button background
                                        <Tooltip content={`Controls the color of 2 buttons:
                                                            - Write review button
                                                            - Submit review button
                                                            `}>
                                            <Icon source={AlertCircleIcon} tone='base'></Icon></Tooltip></InlineStack>}
                                    type="text"
                                    value={formData.form_btn_bg}
                                    onChange={(e) => {
                                        handleFocus("form_btn_bg")
                                        handleChange(e, "form_btn_bg")
                                    }}
                                    autoComplete="off"
                                    connectedLeft={
                                        <input
                                            type="color"
                                            value={formData.form_btn_bg}
                                            onChange={(e) => {
                                                handleFocus("form_btn_bg")
                                                handleColorChange(e, "form_btn_bg")
                                            }
                                            }
                                        />
                                    }
                                />
                            </div>
                        </InlineGrid>
                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Position</Text>
                        <Box background="bg-surface-secondary" padding="300" borderRadius="200">
                            <BlockStack gap={200}>
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>Place or move this app using Shopify Editor</Text>
                                <Text variant="headingSm" as="p" fontWeight='regular' tone="subdued" >Choose where to show the app using the Theme Editor. Click 'Add Section' or 'Add Block', then find the Vitals app you need.</Text>
                                <InlineStack align="start">
                                    <ButtonGroup>
                                        <Button onClick={() => { }} accessibilityLabel="Go to editor"> Go to editor</Button>
                                        <Button variant="plain">Learn more</Button>
                                    </ButtonGroup>
                                </InlineStack>
                            </BlockStack>
                        </Box>
                    </BlockStack>
                </Card>
            </Layout.Section>
        </>
    );
}

export default ReviewsWidget;
