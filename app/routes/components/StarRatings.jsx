import { BlockStack, Button, ButtonGroup, Card, RadioButton, ContextualSaveBar, ChoiceList, Text, Page, InlineGrid, Listbox, Select, Tooltip, Checkbox, TextField, Tabs, Box, Layout, Toast, Grid, Frame, InlineStack, Link, Popover, ActionList, Icon } from '@shopify/polaris';

function ReviewsWidget({ formData, handleFocus, handleChange, handleColorChange }) {
    const star_alignment_options = [
        { id: 'Left', label: 'Left' },
        { id: 'Center', label: 'Center' },
        { id: 'Right', label: 'Right' },
    ]

    return (
        <div className=''>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Star rating on product page</Text>
                        <Checkbox
                            label="Display stars under the product name"
                            checked={formData.display_star_productpage}
                            onChange={(e) => {
                                handleFocus("display_star_productpage")
                                handleChange(e, "display_star_productpage")
                            }}
                            helpText="Display your review count and rating under the product name on the product page. This snippet will not appear if the product doesn't have any reviews."
                        />
                        <TextField
                            type='number'
                            label={`Star size`}
                            value={formData.star_size_productpage}
                            onChange={(e) => {
                                handleFocus("star_size_productpage")
                                handleChange(e, "star_size_productpage")
                            }
                            }
                        />
                        <div className="btn-grp-radio">
                            <ChoiceList
                                title="Star alignment"
                                choices={star_alignment_options.map(option => ({
                                    label: (
                                        <span className={formData.star_alignment_productpage == option.id ? "labelchecked labelmain" : "labelmain"}>
                                            <span>{option.label}</span>
                                        </span>
                                    ),
                                    value: option.id,
                                }))}
                                selected={formData.star_alignment_productpage}
                                onChange={(selected) => {
                                    handleFocus("star_alignment_productpage");
                                    handleChange(selected, "star_alignment_productpage")
                                }}
                            />
                        </div>

                        <TextField
                            label={`Star rating format`}
                            value={formData.star_rating_format_productpage}
                            onChange={(e) => {
                                handleFocus("star_rating_format_productpage")
                                handleChange(e, "star_rating_format_productpage")
                            }}
                            helpText="You can customize the look & feel of your review snippet on product pages. Make sure you use the correct tags: {{ stars }}, {{ averageRating }}, {{ totalReviews }}, {{ reviewsTranslation }}."
                        />
                        <InlineGrid columns={{  sm:"2" }} gap={300}>
                            <TextField
                                type='number'
                                label={`Margin top`}
                                value={formData.margin_top_productpage}
                                onChange={(e) => {
                                    handleFocus("margin_top_productpage")
                                    handleChange(e, "margin_top_productpage")
                                }
                                }
                            />
                            <TextField
                                type='number'
                                label={`Margin bottom`}
                                value={formData.margin_bottom_productpage}
                                onChange={(e) => {
                                    handleFocus("margin_bottom_productpage")
                                    handleChange(e, "margin_bottom_productpage")
                                }}
                            />
                        </InlineGrid>
                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Star rating on homepage and collection pages</Text>
                        <Checkbox
                            label="Display stars on homepage and collection pages"
                            checked={formData.display_star_homepage}
                            onChange={(e) => {
                                handleFocus("display_star_homepage")
                                handleChange(e, "display_star_homepage")
                            }}
                            helpText="Display your products review count and rating under the product name on the homepage and collection pages. This snippet will not appear if the product doesn't have any reviews."
                        />
                        <TextField
                            type='number'
                            label={`Star size`}
                            value={formData.star_size_homepage}
                            onChange={(e) => {
                                handleFocus("star_size_homepage")
                                handleChange(e, "star_size_homepage")
                            }
                            }
                        />
                        <div className="btn-grp-radio">
                            <ChoiceList
                                title="Star alignment"
                                choices={star_alignment_options.map(option => ({
                                    label: (
                                        <span className={formData.star_alignment_homepage == option.id ? "labelchecked labelmain" : "labelmain"}>
                                            <span>{option.label}</span>
                                        </span>
                                    ),
                                    value: option.id,
                                }))}
                                selected={formData.star_alignment_homepage}
                                onChange={(selected) => {
                                    handleFocus("star_alignment_homepage");
                                    handleChange(selected, "star_alignment_homepage")
                                }}
                            />
                        </div>
                        <TextField
                            label={`Star rating format`}
                            value={formData.star_rating_format_homepage}
                            onChange={(e) => {
                                handleFocus("star_rating_format_homepage")
                                handleChange(e, "star_rating_format_homepage")
                            }}
                            helpText="You can customize the look & feel of your review snippet on collection pages or the homepage. Make sure you use the correct tags: {{ stars }}, {{ averageRating }}, {{ totalReviews }, {{ reviewsTranslation }}."
                        />
                        <InlineGrid columns={{  sm:"2" }} gap={300}>
                            <TextField
                                type='number'
                                label={`Margin top`}
                                value={formData.margin_top_homepage}
                                onChange={(e) => {
                                    handleFocus("margin_top_homepage")
                                    handleChange(e, "margin_top_homepage")
                                }
                                }
                            />
                            <TextField
                                type='number'
                                label={`Margin bottom`}
                                value={formData.margin_bottom_homepage}
                                onChange={(e) => {
                                    handleFocus("margin_bottom_homepage")
                                    handleChange(e, "margin_bottom_homepage")
                                }
                                }
                            />
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

        </div>
    );
}

export default ReviewsWidget;