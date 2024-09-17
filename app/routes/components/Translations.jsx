import { BlockStack, Button, Card, Text,TextField, Tabs, Box, Layout, Icon } from '@shopify/polaris';
import { useTranslation } from "react-i18next";
function Translations({ formData, handleFocus, handleChange, handleColorChange }) {
    let { t } = useTranslation();
    return (
        <>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingMd" as="h6" fontWeight='semibold'>{t("Translations.Translations")}</Text>
                        <BlockStack gap="300">
                            <TextField
                                label={t("Translations.Reviews")}
                                value={formData.translation_reviews}
                                onChange={(e) => {
                                    handleFocus("reviews")
                                    handleChange(e, "reviews")
                                }
                                }
                            />
                            <TextField
                                label={t("Translations.See")}
                                value={formData.translation_see_more_reviews}
                                onChange={(e) => {
                                    handleFocus("see_more_reviews")
                                    handleChange(e, "see_more_reviews")
                                }
                                }
                            />
                            <TextField
                                label={t("Translations.Write")}
                                value={formData.translation_write_review}
                                onChange={(e) => {
                                    handleFocus("write_review")
                                    handleChange(e, "write_review")
                                }
                                }
                            />
                            <TextField
                                label={t("Translations.Share")}
                                value={formData.translation_share_experience}
                                onChange={(e) => {
                                    handleFocus("share_experience")
                                    handleChange(e, "share_experience")
                                }
                                }
                            />
                            <TextField
                                label={t("Translations.Rating")}
                                value={formData.translation_rating}
                                onChange={(e) => {
                                    handleFocus("rating")
                                    handleChange(e, "rating")
                                }
                                }
                            />
                            <TextField
                                label={t("Translations.Name")}
                                value={formData.translation_name}
                                onChange={(e) => {
                                    handleFocus("name")
                                    handleChange(e, "name")
                                }
                                }
                            />
                            <TextField
                                label={t("Translations.Review2")}
                                value={formData.translation_review}
                                onChange={(e) => {
                                    handleFocus("review")
                                    handleChange(e, "review")
                                }
                                }
                            />
                            <TextField
                                label={t("Translations.love")}
                                value={formData.translation_love_to_see_picture}
                                onChange={(e) => {
                                    handleFocus("love_to_see_picture")
                                    handleChange(e, "love_to_see_picture")
                                }
                                }
                            />
                            <TextField
                                label={t("Translations.Submit")}
                                value={formData.translation_submit_review}
                                onChange={(e) => {
                                    handleFocus("submit_review")
                                    handleChange(e, "submit_review")
                                }
                                }
                            />
                            <TextField
                                label={t("Translations.Cancel")}
                                value={formData.translation_cancel}
                                onChange={(e) => {
                                    handleFocus("cancel")
                                    handleChange(e, "cancel")
                                }
                                }
                            />
                            <TextField
                                label={t("Translations.first")}
                                value={formData.translation_no_reviews_yet}
                                onChange={(e) => {
                                    handleFocus("no_reviews_yet")
                                    handleChange(e, "no_reviews_yet")
                                }
                                }
                            />
                            <TextField
                                label={t("Translations.Thank")}
                                value={formData.translation_thankyou_for_review}
                                onChange={(e) => {
                                    handleFocus("thankyou_for_review")
                                    handleChange(e, "thankyou_for_review")
                                }
                                }
                            />
                            <TextField
                                label={t("Translations.Only")}
                                value={formData.translation_only_image_supported}
                                onChange={(e) => {
                                    handleFocus("only_image_supported")
                                    handleChange(e, "only_image_supported")
                                }
                                }
                            /><TextField
                                label={t("Translations.mail")}
                                value={formData.translation_email}
                                onChange={(e) => {
                                    handleFocus("email")
                                    handleChange(e, "email")
                                }
                                }
                            /><TextField
                                label={t("Translations.added")}
                                value={formData.translation_review_not_added}
                                onChange={(e) => {
                                    handleFocus("review_not_added")
                                    handleChange(e, "review_not_added")
                                }
                                }
                            /><TextField
                                label={t("Translations.Store")}
                                value={formData.translation_store_reply}
                                onChange={(e) => {
                                    handleFocus("store_reply")
                                    handleChange(e, "store_reply")
                                }
                                }
                            />
                            <TextField
                                label={t("Translations.buyer")}
                                value={formData.translation_verified_buyer}
                                onChange={(e) => {
                                    handleFocus("verified_buyer")
                                    handleChange(e, "verified_buyer")
                                }
                                }
                            />
                            <TextField
                                label={t("Translations.Collected")}
                                value={formData.translation_collected_by}
                                onChange={(e) => {
                                    handleFocus("collected_by")
                                    handleChange(e, "collected_by")
                                }
                                }
                            />
                            <TextField
                                label={t("Translations.number")}
                                value={formData.translation_From_no_of_reviews}
                                onChange={(e) => {
                                    handleFocus("From_no_of_reviews")
                                    handleChange(e, "From_no_of_reviews")
                                }
                                }
                            />
                        </BlockStack>
                    </BlockStack>
                </Card>
            </Layout.Section>
        </>
    );
}

export default Translations;