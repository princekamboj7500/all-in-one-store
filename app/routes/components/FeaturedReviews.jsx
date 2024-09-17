import { BlockStack, Button, ButtonGroup, Card, RadioButton, ContextualSaveBar, ChoiceList, Text, Page, InlineGrid, Listbox, Select, Tooltip, Checkbox, TextField, Tabs, Box, Layout, Toast, Grid, Frame, InlineStack, Link, Popover, ActionList, Icon } from '@shopify/polaris';
import gridimg from "./../assets/product_review/grid.png"
import listimg from "./../assets/product_review/list.png"
import { useTranslation } from "react-i18next";
function FeaturedReviews({ shop, formData, handleFocus, handleChange, handleColorChange }) {
    let { t } = useTranslation();
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
                    <Text variant="headingSm" as="h6" fontWeight='semibold'>{t("featured.Layout")}</Text>
                    <div className='img-choicelist'>
                        <ChoiceList
                            title={t("featured.Reviews")}
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
                            helpText={t("featured.helptext")}
                        />
                    </div>
                    <Checkbox
                        label={t("featured.bars")}
                        checked={formData.featured_show_filterbar}
                        onChange={(e) => {
                            handleFocus("featured_show_filterbar")
                            handleChange(e, "featured_show_filterbar")
                        }}
                        helpText={t("featured.helptext2")}
                    />
                </BlockStack>
            </Card>
        </Layout.Section>
        <Layout.Section>
            <Card roundedAbove="sm">
                <BlockStack gap="400">
                    <Text variant="headingSm" as="h6" fontWeight='semibold'>{t("featured.Number")}</Text>
                    <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                        <BlockStack gap="200">
                            <Text variant="headingSm" as="h6" fontWeight='semibold'>{t("featured.Desktop")}</Text>
                            <InlineGrid columns={{  sm:"2" }} gap={200}>
                                <TextField
                                    type='number'
                                    label={t("featured.Reviews3")}
                                    value={formData.featured_desktop_min_reviews}
                                    onChange={(e) => {
                                        handleFocus("featured_desktop_min_reviews")
                                        handleChange(e, "featured_desktop_min_reviews")
                                    }
                                    }
                                />
                                <TextField
                                    type='number'
                                    label={t("featured.Reviews4")}
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
                            <Text variant="headingSm" as="h6" fontWeight='semibold'>{t("featured.Mobile")}</Text>
                            <InlineGrid columns={{  sm:"2" }} gap={200}>
                                <TextField
                                    type='number'
                                    label={t("featured.Reviews5")}
                                    value={formData.featured_mobile_min_reviews}
                                    onChange={(e) => {
                                        handleFocus("featured_mobile_min_reviews")
                                        handleChange(e, "featured_mobile_min_reviews")
                                    }
                                    }
                                />
                                <TextField
                                    type='number'
                                    label={t("featured.Reviews6")}
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
                    <Text variant="headingSm" as="h6" fontWeight='semibold'>{t("featured.Position")}</Text>
                    <Box background="bg-surface-secondary" padding="300" borderRadius="200">
                        <BlockStack gap={200}>
                            <Text variant="headingSm" as="h6" fontWeight='semibold'>{t("featured.Place")}</Text>
                            <Text variant="headingSm" as="p" fontWeight='regular' tone="subdued" >{t("featured.choose")}</Text>
                            <InlineStack align="start">
                                <ButtonGroup>
                                    <Button onClick={handleNavigate} accessibilityLabel="Go to editor">{t("featured.Go")}</Button>
                                    <Button variant="plain">{t("featured.learn")}</Button>
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