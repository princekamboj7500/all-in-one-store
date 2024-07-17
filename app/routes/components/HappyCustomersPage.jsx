import { BlockStack, Button, ButtonGroup, Card, ChoiceList, Text, Page, InlineGrid, Checkbox, TextField, Tabs, Box, Layout, Toast, Grid, Frame, InlineStack, Link, Popover, ActionList, Icon } from '@shopify/polaris';
import {ExternalIcon, XIcon} from '@shopify/polaris-icons';
import gridimg from "./../assets/product_review/grid.png"
import listimg from "./../assets/product_review/list.png"

function HappyCustomers({ formData, handleFocus, handleChange, handleColorChange, shopname }) {
    const review_layout_options = [
        { id: 'Grid_view', label: 'Grid View', imgSrc: gridimg },
        { id: 'List_view', label: 'List View', imgSrc: listimg }
    ];
    let  pagelink = `https://${shopname}/a/aios/page/top-reviews`;

    return (
        <>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <InlineGrid columns="1fr auto">
                            <Text variant="headingMd" as="h6" fontWeight='semibold'>Show featured reviews on a dedicated page</Text>
                           
                        </InlineGrid>

                        <Checkbox
                            label="Activate the Happy Customers Page with featured reviews"
                            checked={formData.activate_happy_customer_page}
                            onChange={(e) => {
                                handleFocus("activate_happy_customer_page")
                                handleChange(e, "activate_happy_customer_page")
                            }}
                        />
                        {formData.activate_happy_customer_page ? <Text>Happy Customers Page link: <Link url={pagelink}target='_blank'>{pagelink}</Link></Text> : ""}
                        <TextField
                            label={`Page title`}
                            value={formData.happy_customer_page_title}
                            onChange={(e) => {
                                handleFocus("happy_customer_page_title")
                                handleChange(e, "happy_customer_page_title")
                            }
                            }
                        />
                        <TextField
                            label={`Page description`}
                            value={formData.happy_customer_page_description}
                            onChange={(e) => {
                                handleFocus("happy_customer_page_description")
                                handleChange(e, "happy_customer_page_description")
                            }}
                        />

                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Layout</Text>
                        <div className='img-choicelist'>
                            <ChoiceList
                                title="Reviews layout"
                                choices={review_layout_options.map(option => ({
                                    label: (
                                        <span className={formData.happy_customer_reviews_layout == option.id ? "labelchecked labelmain" : "labelmain"}>
                                            {option.label}
                                            <img src={option.imgSrc} alt={option.label} />
                                        </span>
                                    ),
                                    value: option.id,
                                }))}
                                selected={formData.happy_customer_reviews_layout}
                                onChange={(selected) => {
                                    handleFocus("happy_customer_reviews_layout");
                                    handleChange(selected, "happy_customer_reviews_layout")
                                }}
                                helpText="You can change the design settings for this layout in the Layout design settings section below."
                            />
                        </div>
                        <Checkbox
                            label="Show rating filter bars"
                            checked={formData.happy_customer_show_filterbar}
                            onChange={(e) => {
                                handleFocus("happy_customer_show_filterbar")
                                handleChange(e, "happy_customer_show_filterbar")
                            }}
                            helpText="Display a breakdown of all reviews using progress bars at the top of the reviews list, allowing easy filtering."
                        />
                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Number of reviews</Text>
                        <InlineGrid columns={{  sm:"2" }} gap={200}>
                            <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                                <BlockStack gap="200">
                                    <Text variant="headingSm" as="h6" fontWeight='semibold'>Desktop</Text>
                                    <TextField
                                        type='number'
                                        label={`Number of reviews before showing more`}
                                        value={formData.happy_customer_min_reviews_desktop}
                                        onChange={(e) => {
                                            handleFocus("happy_customer_min_reviews_desktop")
                                            handleChange(e, "happy_customer_min_reviews_desktop")
                                        }
                                        }
                                    />
                                </BlockStack>
                            </Box>
                            <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                                <BlockStack gap="200">
                                    <Text variant="headingSm" as="h6" fontWeight='semibold'>Mobile</Text>
                                    <TextField
                                        type='number'
                                        label={`Number of reviews before showing more`}
                                        value={formData.happy_customer_min_reviews_mobile}
                                        onChange={(e) => {
                                            handleFocus("happy_customer_min_reviews_mobile")
                                            handleChange(e, "happy_customer_min_reviews_mobile")
                                        }
                                        }
                                    />
                                </BlockStack>
                            </Box>
                        </InlineGrid>
                    </BlockStack>
                </Card>
            </Layout.Section>
        </>
    );
}

export default HappyCustomers;