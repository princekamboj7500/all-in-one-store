import { BlockStack, Button, ButtonGroup, Card, RadioButton, ContextualSaveBar, ChoiceList, Text, Page, InlineGrid, Listbox, Select, Tooltip, Checkbox, TextField, Tabs, Box, Layout, Toast, Grid, Frame, InlineStack, Link, Popover, ActionList, Icon } from '@shopify/polaris';
import gridimg from "./../assets/product_review/grid.png"
import listimg from "./../assets/product_review/list.png"

function FeaturedReviews({ shop, formData, handleFocus, handleChange, handleColorChange }) {
    const review_layout_options = [
        { id: 'Grid_view', label: 'Grid View', imgSrc: gridimg },
        { id: 'List_view', label: 'List View', imgSrc: listimg }
    ];
    const handleNavigate = () => {
     
        window.open(
          `https://admin.shopify.com/store/${shop.replace(".myshopify.com", "")}/admin/themes/current/editor?&addAppBlockId=8177ef1b-fb1c-4ebb-a686-d743f22ea714/featuredreviews&target=newAppsSection`,
          "__blank",
        );
      };
    return (
        <>
        <Layout.Section>
            <Card roundedAbove="sm">
                <BlockStack gap="400">
                    <Text variant="headingSm" as="h6" fontWeight='semibold'>Layout</Text>
                    <div className='img-choicelist'>
                        <ChoiceList
                            title="Reviews layout"
                            choices={review_layout_options.map(option => ({
                                label: (
                                    <span className={formData.featured_reviews_layout == option.id ? "labelchecked labelmain" : "labelmain"}>
                                        {option.label}
                                        <img src={option.imgSrc} alt={option.label} />
                                    </span>
                                ),
                                value: option.id,
                            }))}
                            selected={formData.featured_reviews_layout}
                            onChange={(selected) => {
                                handleFocus("featured_reviews_layout");
                                handleChange(selected, "featured_reviews_layout")
                            }}
                            helpText="You can change the design settings for this layout in the Layout design settings section below."
                        />
                    </div>
                    <Checkbox
                        label="Show rating filter bars"
                        checked={formData.featured_show_filterbar}
                        onChange={(e) => {
                            handleFocus("featured_show_filterbar")
                            handleChange(e, "featured_show_filterbar")
                        }}
                        helpText="Display a breakdown of all reviews using progress bars at the top of the reviews list, allowing easy filtering."
                    />
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
                                    value={formData.featured_desktop_min_reviews}
                                    onChange={(e) => {
                                        handleFocus("featured_desktop_min_reviews")
                                        handleChange(e, "featured_desktop_min_reviews")
                                    }
                                    }
                                />
                                <TextField
                                    type='number'
                                    label={`Maximum number of reviews`}
                                    value={formData.featured_desktop_max_reviews}
                                    onChange={(e) => {
                                        handleFocus("featured_desktop_max_reviews")
                                        handleChange(e, "featured_desktop_max_reviews")
                                    }
                                    }
                                />
                            </InlineGrid>
                        </BlockStack>
                    </Box>
                    <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                        <BlockStack gap="200">
                            <Text variant="headingSm" as="h6" fontWeight='semibold'>Mobile</Text>
                            <InlineGrid columns={{  sm:"2" }} gap={200}>
                                <TextField
                                    type='number'
                                    label={`Number of reviews before showing more`}
                                    value={formData.featured_mobile_min_reviews}
                                    onChange={(e) => {
                                        handleFocus("featured_mobile_min_reviews")
                                        handleChange(e, "featured_mobile_min_reviews")
                                    }
                                    }
                                />
                                <TextField
                                    type='number'
                                    label={`Maximum number of reviews`}
                                    value={formData.featured_mobile_max_reviews}
                                    onChange={(e) => {
                                        handleFocus("featured_mobile_max_reviews")
                                        handleChange(e, "featured_mobile_max_reviews")
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
                    <Text variant="headingSm" as="h6" fontWeight='semibold'>Position</Text>
                    <Box background="bg-surface-secondary" padding="300" borderRadius="200">
                        <BlockStack gap={200}>
                            <Text variant="headingSm" as="h6" fontWeight='semibold'>Place or move this app using Shopify Editor</Text>
                            <Text variant="headingSm" as="p" fontWeight='regular' tone="subdued" >Choose where to show th app using the Theme Editor. Click 'Add Section' or 'Add Block', then find the All-In-One Store  app you need.</Text>
                            <InlineStack align="start">
                                <ButtonGroup>
                                    <Button onClick={handleNavigate} accessibilityLabel="Go to editor"> Go to editor</Button>
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

export default FeaturedReviews;