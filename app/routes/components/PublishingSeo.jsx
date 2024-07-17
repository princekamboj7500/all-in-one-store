import { BlockStack, Button, Card, Text,TextField, Tabs, Box, Layout, Icon, Select } from '@shopify/polaris';

function PublishingSeo({ formData, handleFocus, handleChange, handleColorChange }) {

    const pubishOptions = [
        { label: 'Select an option', value: 'Select an option', disabled: true },
        { label: "Don't auto Publish", value: "Don't auto Publish",  },
         { label: "Publish automatically", value: 'Publish automatically',  },
    ]
   
    return (
        <>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingMd" as="h6" fontWeight='semibold'>Publishing</Text>
                        <BlockStack gap="300">
                        <Select
                            label="Auto-publish new reviews"
                            options={pubishOptions}
                            onChange={(e) => {
                                handleFocus("reviewer_name_display")
                                handleChange(e, "reviewer_name_display")
                            }}
                         
                        />
                            
                        </BlockStack>
                    </BlockStack>
                </Card>
            </Layout.Section>
        </>
    );
}

export default PublishingSeo;