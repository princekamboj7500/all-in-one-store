import { BlockStack, Button, ButtonGroup, Card, RadioButton, ContextualSaveBar, ChoiceList, Text, Page, InlineGrid, Listbox, Select, Tooltip, Checkbox, TextField, Tabs, Box, Layout, Toast, Grid, Frame, InlineStack, Link, Popover, ActionList, Icon } from '@shopify/polaris';
import {
    ExternalIcon, XIcon, AlertCircleIcon
} from '@shopify/polaris-icons';
import rounded from "./../assets//product_review/rounded.svg"
import pointed from "./../assets/product_review/pointed.svg"
import hearts from "./../assets/product_review/hearts.svg"
import gridimg from "./../assets/product_review/grid.png"
import listimg from "./../assets/product_review/list.png"
import { useTranslation } from "react-i18next";

function ReviewsWidget({ shop, formData, handleFocus, handleChange, handleColorChange }) {
    let { t } = useTranslation();
    const star_shape_options = [
        { id: 'Rounded', label: t('Widget.Roundedcorners'), imgSrc: rounded },
        { id: 'Pointed', label: t('Widget.Pointedcorners'), imgSrc: pointed },
        { id: 'Hearts', label: t('Widget.Hearts'), imgSrc: hearts },
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
    const handleCarouselClick = () => {
        window.open(
            `https://admin.shopify.com/store/${shop.replace(".myshopify.com", "")}/admin/themes/current/editor?&addAppBlockId=8177ef1b-fb1c-4ebb-a686-d743f22ea714/productreviews&target=newAppsSection`,
            "__blank",
          );
      
    }
    return (
        <>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>{t('Widget.General')}</Text>
                        <div className='img-choicelist star-shape'>
                            <ChoiceList
                                title={t('Widget.Star')}
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
                                label={<InlineStack style={{ "margin": "0px" }} gap={300}>{t('Widget.Star2')}
                                    <Tooltip content={t('Widget.Star3')}>
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
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>{t('Widget.Product')}</Text>
                        <div className='img-choicelist'>
                            <ChoiceList
                                title={t('Widget.layout')}
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
                                helpText={t('Widget.change')}
                            />
                        </div>
                        <Checkbox
                            label={t('Widget.rating')}
                            checked={formData.show_rating_filterbar}
                            onChange={(e) => {
                                handleFocus("show_rating_filterbar")
                                handleChange(e, "show_rating_filterbar")
                            }}
                            helpText={t('Widget.Display')}
                        />
                        <Checkbox
                            label={t('Widget.Show')}
                            checked={formData.show_reviewbox_whenzero}
                            onChange={(e) => {
                                handleFocus("show_reviewbox_whenzero")
                                handleChange(e, "show_reviewbox_whenzero")
                            }}
                        />
                      
                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>{t('Widget.Number')}</Text>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <BlockStack gap="200">
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>{t('Widget.Desktop')}</Text>
                                <InlineGrid columns={{  sm:"2" }} gap={200}>
                                    <TextField
                                        type='number'
                                        label={t('Widget.before')}
                                        value={formData.desktop_min_reviews}
                                        onChange={(e) => {
                                            handleFocus("desktop_min_reviews")
                                            handleChange(e, "desktop_min_reviews")
                                        }}
                                    />
                                    <TextField
                                        type='number'
                                        label={t('Widget.Maximum')}
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
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>{t('Widget.Mobile')}</Text>
                                <InlineGrid  columns={{  sm:"2" }} gap={200}>
                                    <TextField
                                        type='number'
                                        label={t('Widget.of')}
                                        value={formData.mobile_min_reviews}
                                        onChange={(e) => {
                                            handleFocus("mobile_min_reviews")
                                            handleChange(e, "mobile_min_reviews")
                                        }}
                                    />
                                    <TextField
                                        type='number'
                                        label={t('Widget.reviews')}
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
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>{t('Widget.information')}</Text>
                       
                        <Checkbox
                            label={t('Widget.Show2')}
                            checked={formData.show_reviews_date}
                            onChange={(e) => {
                                handleFocus("show_reviews_date")
                                handleChange(e, "show_reviews_date")
                            }}
                        />
                        
                        <Select
                            label={t('Widget.Date')}
                            options={date_format_options}
                            onChange={(e) => {
                                handleFocus("date_format")
                                handleChange(e, "date_format")
                            }}
                            value={formData.date_format}
                        />
                        <Select
                            label={t('Widget.method')}
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
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>{t('Widget.Verified')}</Text>
                        <Checkbox
                            label={<InlineStack gap="200">{t('Widget.icon')}
                                <Tooltip
                                    content={t('Widget.enabled')}>
                                    <Icon source={AlertCircleIcon} tone='base'></Icon></Tooltip></InlineStack>}
                            checked={formData.verified_icon}
                            onChange={(e) => {
                                handleFocus("verified_icon")
                                handleChange(e, "verified_icon")
                            }}
                        />
                        <div className='color_section'>
                            <TextField
                                label={t('Widget.color')}
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
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>{t('Widget.settings')}</Text>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <BlockStack gap="200">
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>{t('Widget.Grid')}</Text>
                                <InlineGrid  columns={{  sm:"2" }} gap={200}>
                                    <div className='color_section'>
                                        <TextField
                                            label={t('Widget.Reviewer')}
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
                                            label={t('Widget.text')}
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
                                            label={t('Widget.background')}
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
                                            label={t('Widget.Pro')}
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
                                            label={t('Widget.Prodate')}
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
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>{t('Widget.List')}</Text>
                                <InlineGrid columns={{  sm:"2" }} gap={200}>
                                    <div className='color_section'>
                                        <TextField
                                            label={t('Widget.Avatar')}
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
                                            label={t('Widget.Avatar2')}
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
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>{t('Widget.List2')}</Text>
                                <InlineGrid  columns={{  sm:"2" }} gap={200}>
                                    <div className='color_section'>
                                        <TextField
                                            label={t('Widget.reply')}
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
                                            label={t('Widget.Store')}
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
                                            label={t('Widget.Store2')}
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
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>{t('Widget.form')}</Text>
                        <Checkbox
                            label={t('Widget.Allow')}
                            checked={formData.form_allow_img}
                            onChange={(e) => {
                                handleFocus("form_allow_img")
                                handleChange(e, "form_allow_img")
                            }}
                        />
                        <InlineGrid  columns={{  sm:"2" }} gap={200}>
                            <div className='color_section'>
                                <TextField
                                    label={t('Widget.Form')}
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
                                    label={t('Widget.Form2')}
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
                                    label={<InlineStack gap={200}>{t('Widget.Button')}
                                        <Tooltip content={t('Widget.Button2')}>
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
                                    label={<InlineStack gap={200} >{t('Widget.bg')}
                                        <Tooltip content={t('Widget.Controls')}>
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
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>{t('Widget.Position')}</Text>
                        <Box background="bg-surface-secondary" padding="300" borderRadius="200">
                            <BlockStack gap={200}>
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>{t('Widget.app')}</Text>
                                <Text variant="headingSm" as="p" fontWeight='regular' tone="subdued" >{t('Widget.Click')}</Text>
                                <InlineStack align="start">
                                    <ButtonGroup>
                                        <Button onClick={handleCarouselClick} accessibilityLabel="Go to editor">{t('Widget.gut')} </Button>
                                       
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
