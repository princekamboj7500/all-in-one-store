import { BlockStack, Button, Card, Text, TextField, Tabs, Box, Layout, Icon, Select, Checkbox } from '@shopify/polaris';
import { useTranslation } from "react-i18next";
function PublishingSeo({ formData, handleFocus, handleChange, handleColorChange }) {
    let { t } = useTranslation();
    const pubishOptions = [
        { label: 'Select an option', value: 'Select an option', disabled: true },
        { label: "Don't auto Publish", value: "Don't auto Publish", },
        { label: "Publish automatically", value: 'Publish automatically', },
    ]


    return (
        <>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingMd" as="h6" fontWeight='semibold'>{t('publishing.publish')}</Text>
                        <BlockStack gap="300">
                            <Select
                                label={t('publishing.label')}
                                options={pubishOptions}
                                onChange={(e) => {
                                    handleFocus("autopublish_reviews")
                                    handleChange(e, "autopublish_reviews")
                                }}
                                value={formData.autopublish_reviews}
                            />
                             <Checkbox checked={formData.send_mail}
                                                onChange={(e) => {
                                                    handleFocus("send_mail")
                                                    handleChange(e, "send_mail")
                                                }} label="
Get notified when customers submit reviews"
helpText="Automatically receive an e-mail notification whenever a customer writes a review on your shop's product pages." />
                        </BlockStack>
                    </BlockStack>
                </Card>
            </Layout.Section>
        </>
    );
}

export default PublishingSeo;