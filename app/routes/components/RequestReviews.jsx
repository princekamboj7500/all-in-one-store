
import {
    Page,
    Layout,
    Text,
    Card,
    Button,
    BlockStack,
    Grid,
    Collapsible,
    Icon,
    Divider,
    Checkbox,
    Select,
    InlineStack,
    InlineGrid,
    TextField,
    ButtonGroup,
    Box,
    RadioButton,
} from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import "../assets/style.css";
import React, { useCallback, useState, useEffect } from "react";
import {
    ChevronDownIcon,
} from "@shopify/polaris-icons";
const RequestReviews = ({ shop, formData, handleChange, handleFocus }) => {
    let { t } = useTranslation();
    const options = [
        { label: '1 Day', value: '1day' },
        { label: '3 Day', value: '3day' },
        { label: '7 Day', value: '7day' },
        { label: '10 Day', value: '10day' },
        { label: '14 Day', value: '14day' },
        { label: '21 Day', value: '21day' },
        { label: '28 Day', value: '28day' },
        { label: '45 Day', value: '45day' },
        { label: '60 Day', value: '60day' },
    ];
    const after = [
        { label: 'Purchased', value: 'Purchased' },
        { label: 'Order Fulfilled', value: 'Order Fulfilled' },

    ];
    const [openStates, setOpenStates] = useState({
        generalDesignSettings: false,
        cookiesettings: false,
        informativeCookieBanner: false,
    });
    const handleToggle = (section) => {
        setOpenStates((prevOpenStates) => ({
            ...prevOpenStates,
            [section]: !prevOpenStates[section],
        }));
    };
    const reviews = [
        { label: 'Review Requests Only ', value: 'only' },
        { label: 'On-site and review requests ', value: 'on-site' },

    ];
    const emailHeader = "Hello {{ customer_first_name|default:there }} ,";
    const productName = "{{ products|cta:Review product }}";
    const store = "{{ store_name }}";
    const subject = "Hi {{ customer_first_name|default:there }}, did you open the box?"
    const thankyu = "Hi {{ customer_first_name|default:there }}, thank you for the review!"
    const disText = "{{ discount_code }}"
    const discountCode = "Use the discount code below for {{ discount_value }} off your next purchase at {{ store_name }}!"
    return (
        <>
            <Layout>
                <Layout.Section>
                    <div
                        className="drop_spacer drop_estimate"
                        style={{ padding: "20px 0" }}
                    >
                        <Grid>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 6 }}>
                                <BlockStack gap="500">
                                    <Text variant="headingSm" as="h6">
                                        Collect Reviews
                                    </Text>
                                    <BlockStack gap="500">
                                        <p>
                                            One email will be sent after an order to request the customer to leave a review.
                                        </p>
                                    </BlockStack>
                                </BlockStack>
                            </Grid.Cell>

                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 8, xl: 6 }}>
                                <Card>
                                    <BlockStack gap="500">
                                        <BlockStack gap="300">
                                            <Checkbox
                                                label="Send automatic emails for reviews requests"
                                                checked={formData.automatic_email}
                                                onChange={(e) => {
                                                    handleFocus("automatic_email")
                                                    handleChange(e, "automatic_email")
                                                }}
                                            />
                                            <InlineGrid gap="400" columns={2}>
                                                <Select
                                                    label="Email timing"
                                                    options={options}
                                                    onChange={(e) => {
                                                        handleFocus("email_timing")
                                                        handleChange(e, "email_timing")
                                                    }}
                                                    value={formData.email_timing}
                                                />
                                                <Select
                                                    label="After"
                                                    options={after}
                                                    onChange={(e) => {
                                                        handleFocus("after")
                                                        handleChange(e, "after")
                                                    }}
                                                    value={formData.after}
                                                />
                                            </InlineGrid>
                                        </BlockStack>
                                    </BlockStack>
                                </Card>
                            </Grid.Cell>
                        </Grid>
                    </div>
                </Layout.Section>
            </Layout>

            <Layout>
                <Layout.Section>
                    <div
                        className="drop_spacer drop_estimate"
                        style={{ padding: "20px 0" }}
                    >
                        <Grid>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 6 }}>
                                <BlockStack gap="500">
                                    <Text variant="headingSm" as="h6">
                                        Review Request email template
                                    </Text>
                                </BlockStack>
                            </Grid.Cell>

                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 8, xl: 6 }}>
                                <Card sectioned>


                                    <BlockStack gap="500">
                                        <div className="arrow-sign">
                                            <BlockStack gap={200}>
                                                <div
                                                    onClick={() => handleToggle("informativeCookieBanner")}
                                                    style={{ display: "inline-block", cursor: "pointer" }}
                                                >
                                                    <div style={{ float: "left" }}>
                                                        <Text variant="headingSm" as="h6">
                                                            Email preview
                                                        </Text>
                                                    </div>
                                                    <div style={{ float: "right" }}>
                                                        <InlineStack>
                                                            {openStates.cookiesettings ? (
                                                                <></>
                                                            ) : (
                                                                <div style={{ marginTop: "2px" }}>
                                                                    <Text variant="bodySm" as="p">
                                                                        Show full preview
                                                                    </Text>
                                                                </div>
                                                            )}
                                                            <Icon source={ChevronDownIcon} tone="base" />
                                                        </InlineStack>
                                                    </div>
                                                </div>
                                                <Text variant="bodySm" as="p">
                                                    {subject}
                                                </Text>
                                            </BlockStack>
                                        </div>

                                        <Collapsible
                                            open={openStates.informativeCookieBanner}
                                            id="basic-collapsible"
                                            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
                                            expandOnPrint
                                        >
                                            <BlockStack gap="400">
                                                <div className="email--previews">
                                                    <div className="email--header">
                                                        {emailHeader}
                                                    </div>
                                                    <div className="email--content">
                                                        Thank you for your order.
                                                        We hope you love it! Please take a minute to review your recently
                                                        purchased products. Your opinion is very important to us.
                                                    </div>
                                                    <div className="email--body">{productName}</div>
                                                    <div className="email--footer">Have a great day,<br></br>{store}</div>
                                                </div></BlockStack>
                                                <div className="send--btn">
                                                <Button>Customize Template</Button>
                                                </div>
                                            <TextField label="Review preview email" autoComplete="off" />

                                            <div className="send--btn">
                                                <Button>Send test</Button></div>
                                        </Collapsible>
                                    </BlockStack>


                                </Card>
                            </Grid.Cell>
                        </Grid>
                    </div>
                </Layout.Section>
            </Layout>


            <Layout>
                <Layout.Section>
                    <div
                        className="drop_spacer drop_estimate"
                        style={{ padding: "20px 0" }}
                    >
                        <Grid>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 6 }} >
                                <BlockStack gap="500">
                                    <Text variant="headingSm" as="h6">
                                        Discount for reviews
                                    </Text>
                                </BlockStack>
                                <p>An email is sent to the customer after leaving a review on the store. The email is sent to the address they use for the review.</p>
                            </Grid.Cell>

                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 8, xl: 6 }}>
                                <Card sectioned>

                                    <BlockStack gap="500">
                                        <BlockStack gap="300">
                                            <Text variant="headingSm" as="h6">
                                                Incentivize customers to leave a review by giving a discount
                                            </Text>
                                            <Checkbox checked={formData.offer_discount}
                                                onChange={(e) => {
                                                    handleFocus("offer_discount")
                                                    handleChange(e, "offer_discount")
                                                }} label="Offer a discount code to customers after they leave a review" />
                                            <Select
                                                label="Send the discount to reviewers from"
                                                options={reviews}
                                                onChange={(e) => {
                                                    handleFocus("send_discount")
                                                    handleChange(e, "send_discount")
                                                }}
                                                value={formData.send_discount}
                                            />
                                            <Text variant="bodyMd" as="p">Discount Value</Text>
                                            <InlineStack>
                                                <ButtonGroup variant="segmented">
                                                    <Button >
                                                        Percentage
                                                    </Button>
                                                    <Button >
                                                        Fixed Amount
                                                    </Button>
                                                </ButtonGroup>
                                            </InlineStack>
                                            <Text variant="bodyMd" as="p">Discount generation method</Text>
                                            <RadioButton
                                                checked={formData.discount_method === 'Auto-generate'}
                                                onChange={(e) => {
                                                    handleFocus("Auto-generate");
                                                    handleChange("Auto-generate", 'discount_method'); // Pass value and property key
                                                }}
                                                label="Auto-generate"
                                                helpText="AIOS will generate a unique code for each review, valid for 30 days."
                                            />
                                            <RadioButton
                                                checked={formData.discount_method === 'Single Shopify discount'}
                                                onChange={(e) => {
                                                    handleFocus("Single Shopify discount");
                                                    handleChange("Single Shopify discount", 'discount_method'); // Pass value and property key
                                                }}
                                                label="Single Shopify discount"
                                                helpText="You need to create the discount code in Shopify. The same discount code will be sent to all customers."

                                            />
                                        </BlockStack>
                                    </BlockStack>
                                </Card>
                            </Grid.Cell>
                        </Grid></div> </Layout.Section>
            </Layout>

            <Layout>
                <Layout.Section>
                    <div
                        className="drop_spacer drop_estimate"
                        style={{ padding: "20px 0" }}
                    >
                        <Grid>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 6 }} >
                                <BlockStack gap="500">
                                    <Text variant="headingSm" as="h6">
                                        Discount code email template</Text>
                                </BlockStack>
                                <p>`Keep the  variable in the email body.`</p>
                            </Grid.Cell>

                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 8, xl: 6 }}>
                                <Card sectioned>
                                    <BlockStack gap="500">
                                        <div className="arrow-sign">
                                            <BlockStack gap={200}>
                                                <div
                                                    onClick={() => handleToggle("cookiesettings")}
                                                    style={{ display: "inline-block", cursor: "pointer" }}
                                                >
                                                    <div style={{ float: "left" }}>
                                                        <Text variant="headingSm" as="h6">
                                                            Email preview
                                                        </Text>
                                                    </div>
                                                    <div style={{ float: "right" }}>
                                                        <InlineStack>
                                                            {openStates.cookiesettings ? (
                                                                <></>
                                                            ) : (
                                                                <div style={{ marginTop: "2px" }}>
                                                                    <Text variant="bodySm" as="p">
                                                                        Show full preview
                                                                    </Text>
                                                                </div>
                                                            )}
                                                            <Icon source={ChevronDownIcon} tone="base" />
                                                        </InlineStack>
                                                    </div>
                                                </div>
                                                <Text variant="bodySm" as="p">
                                                    {thankyu}
                                                </Text>
                                            </BlockStack>
                                        </div>

                                        <Collapsible
                                            open={openStates.cookiesettings}
                                            id="basic-collapsible"
                                            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
                                            expandOnPrint
                                        >
                                            <BlockStack gap="400">
                                                <div className="email--previews">
                                                    <div className="email--header">
                                                        {emailHeader}
                                                    </div>
                                                    <div className="email--content">
                                                        Thank you for sharing your experience!
                                                        <p>{discountCode}</p>
                                                    </div>
                                                    <div className="email--body">
                                                        {disText}
                                                        <div className="shop_btn">Shop Now</div>
                                                    </div>
                                                    <div className="email--footer">Have a great day,<br></br>{store}</div>
                                                </div></BlockStack>

                                            <TextField label="Review preview email" autoComplete="off" />

                                            <div className="send--btn">
                                                <Button>Send test</Button></div>
                                        </Collapsible>
                                    </BlockStack>
                                </Card>
                            </Grid.Cell>
                        </Grid></div>
                </Layout.Section>
            </Layout>
            <Box minHeight="80px"></Box>
        </>
    )


}




export default RequestReviews;