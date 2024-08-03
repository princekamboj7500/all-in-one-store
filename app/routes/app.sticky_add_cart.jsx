import { Banner, BlockStack, Box, Button, ButtonGroup, Card, Checkbox, Collapsible, DatePicker, ContextualSaveBar, Frame, Toast, Form, FormLayout, Grid, Icon, InlineGrid, InlineStack, Layout, LegacyCard, LegacyStack, Link, OptionList, Page, Popover, Scrollable, Select, Tabs, Text, TextContainer, TextField, Tooltip, useBreakpoints } from '@shopify/polaris';
import React, { Component, useCallback, useRef, useState, useEffect } from 'react';
import {
    ChevronDownIcon, EditIcon, MinusIcon, SearchIcon, ExternalIcon, CalendarIcon, AlertCircleIcon, ArrowRightIcon
} from '@shopify/polaris-icons';

import { authenticate } from "../shopify.server";
import { useLoaderData, useNavigate } from '@remix-run/react';
import DeactivatePopover from "./components/DeactivatePopover";
import {
    useAppBridge,
} from "@shopify/app-bridge-react";
import "./assets/style.css";
export const loader = async ({ request }) => {
    const { session, admin } = await authenticate.admin(request);
    const response = await admin.graphql(`query {
          currentAppInstallation {
            id
            metafields(first: 15) {
              edges {
                node {
                  namespace
                  key
                  value
                }
              }
            }
          }
  
        }`)
    const result = await response.json();

    const appId = result.data.currentAppInstallation.id;
    const metafielData = result.data.currentAppInstallation.metafields.edges;
    console.log(metafielData,"metafielData0---")
    const defaultSettings = {
        app_name: "StickyAddCart",
        app_status: false,
        show_on_desktop: 1,
        desktop_position: "Bottom",
        show_sticky_cart: "When user scrolls past the Add to cart button",
        show_quantity: 1,
        show_variant: 1,
        sticky_height: "Medium",
        show_product_title: 1,
        button_size: "Small",
        show_on_mobile: 1,
        mobile_position: "Bottom",
        show_sticky_cart_mobile: "When user scrolls past the Add to cart button",
        show_quantity_mobile: 1,
        show_variant_mobile: 1,
        show_product_reviews: 1,
        background_color: "#ffffff",
        text_color: "#eeeeee",
        button_color:"#000000",
        button_text_color:"#ffffff",
        border_shadow: 1,
        border_radius: 2,
        border_colors: "#f6f6f6",
         price_start:5,
        price_end:8,
        discount_start:0,
        discount_end:0,
        inventory_start:0,
        inventory_end:0,
    };
 
    const appName =
        metafielData.length > 0
            ? metafielData.filter((item) => item.node.namespace === "StickyAddCart")
            : [];

    let appSettings =appName.length > 0 ? appName[0].node.value : defaultSettings;
       console.log(appSettings,"appSettings---");
    let data;
    if (typeof appSettings === 'string') {
        try {
            data = JSON.parse(appSettings);
        } catch (error) {
            console.error('Error parsing appSettings:', error);
            data = {}; 
        }
    } else {
        data = appSettings;
    }
    return { data, defaultSettings };
};

export default function StickyAddToCart() {
    const { data , defaultSettings} = useLoaderData();
    const [status, setStatus] = useState(data.app_status);
    const [activeField, setActiveField] = useState(null);
    const [formData, setFormData] = useState({ ...defaultSettings, ...data });

    const navigate = useNavigate();
    const [buttonloading, setButtonLoading] = useState(false);
    const [error, setError] = useState('');

    const [msgData, setMsgData] = useState("");
    const [active, setActive] = useState(false);

    const toggleActive = useCallback(
        () => setActive((prevActive) => !prevActive),
        [],
    );

    const handleColorChange = useCallback((e, fieldName) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [fieldName]: e.target.value,
        }));
      }, []);

    const handleChange = (value, property) => {
        setFormData((formData) => ({
            ...formData,
            [property]: value,
        }));
    };

    const handleFocus = (fieldName) => {
        setActiveField(fieldName);
    };

    const toastMarkup = active ? (
        <Frame>
            <Toast content={msgData} onDismiss={toggleActive} error={error} />
        </Frame>
    ) : null;


    const handleSave = async () => {
        setButtonLoading(true);
        const dataToSend = {
            actionType: "save",
            data: formData
        };
        const response = await fetch("/api/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        });
        const data = await response.json();

        if (data.success) {
            setActive(true);
            setActiveField(false);
            setButtonLoading(false)
            setMsgData("Settings Updated");
        } else {
            setButtonLoading(false)
            setActive(true);
            setActiveField(false);
            setError(true);
            setMsgData("There is some error while update");

        }
    };
    const handleDiscard = () => {
        setActiveField(false);
    };

    const handleToggleStatus = async () => {
        setButtonLoading(true);
        const updatedFormData = {
            ...formData,
            app_status: !formData.app_status,
        };
        const actionType = formData.app_status ? "Deactivate" : "Activate";
        const dataToSend = {
            actionType: actionType,
            data: updatedFormData,
        };

        try {
            const response = await fetch("/api/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });
            const data = await response.json();

            if (data.success) {
                setButtonLoading(false);
                setFormData(updatedFormData);
                setStatus(updatedFormData.app_status);
                setMsgData(`${actionType}d App  successfully`);
            } else {
                setError(true);
                setButtonLoading(false);
                setMsgData("There is some error");
                console.error("API request failed:", data.message);
            }
        } catch (error) {
            setError(true);
            setButtonLoading(false);
            setMsgData("There is some error");
            console.error("API request failed:", error);
        } finally {
            setButtonLoading(false);
            setActive(true);
            setActiveField(false);
        }
    };

    const DateRangePicker = () => {
        const { mdDown, lgUp } = useBreakpoints();
        const shouldShowMultiMonth = lgUp;
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        const yesterday = new Date(
            new Date(new Date().setDate(today.getDate() - 1)).setHours(0, 0, 0, 0)
        );

        const ranges = [
            {
                title: "Today",
                alias: "today",
                period: {
                    since: today,
                    until: today,
                },
            },
            {
                title: "Yesterday",
                alias: "yesterday",
                period: {
                    since: yesterday,
                    until: yesterday,
                },
            },
            {
                title: "Last 7 days",
                alias: "last7days",
                period: {
                    since: new Date(
                        new Date(new Date().setDate(today.getDate() - 7)).setHours(0, 0, 0, 0)
                    ),
                    until: yesterday,
                },
            },
        ];
        const [popoverActive, setPopoverActive] = useState(false);
        const [activeDateRange, setActiveDateRange] = useState(ranges[0]);
        const [inputValues, setInputValues] = useState({});
        const [{ month, year }, setDate] = useState({
            month: activeDateRange.period.since.getMonth(),
            year: activeDateRange.period.since.getFullYear(),
        });
        const datePickerRef = useRef(null);
        const VALID_YYYY_MM_DD_DATE_REGEX = /^\d{4}-\d{1,2}-\d{1,2}/;
        function isDate(date) {
            return !isNaN(new Date(date).getDate());
        }
        function isValidYearMonthDayDateString(date) {
            return VALID_YYYY_MM_DD_DATE_REGEX.test(date) && isDate(date);
        }
        function isValidDate(date) {
            return date.length === 10 && isValidYearMonthDayDateString(date);
        }
        function parseYearMonthDayDateString(input) {
            // Date-only strings (e.g. "1970-01-01") are treated as UTC, not local time
            // when using new Date()
            // We need to split year, month, day to pass into new Date() separately
            // to get a localized Date
            const [year, month, day] = input.split("-");
            return new Date(Number(year), Number(month) - 1, Number(day));
        }
        function formatDateToYearMonthDayDateString(date) {
            const year = String(date.getFullYear());
            let month = String(date.getMonth() + 1);
            let day = String(date.getDate());
            if (month.length < 2) {
                month = String(month).padStart(2, "0");
            }
            if (day.length < 2) {
                day = String(day).padStart(2, "0");
            }
            return [year, month, day].join("-");
        }
        function formatDate(date) {
            return formatDateToYearMonthDayDateString(date);
        }
        function nodeContainsDescendant(rootNode, descendant) {
            if (rootNode === descendant) {
                return true;
            }
            let parent = descendant.parentNode;
            while (parent != null) {
                if (parent === rootNode) {
                    return true;
                }
                parent = parent.parentNode;
            }
            return false;
        }
        function isNodeWithinPopover(node) {
            return datePickerRef?.current
                ? nodeContainsDescendant(datePickerRef.current, node)
                : false;
        }
        function handleStartInputValueChange(value) {
            setInputValues((prevState) => {
                return { ...prevState, since: value };
            });
            console.log("handleStartInputValueChange, validDate", value);
            if (isValidDate(value)) {
                const newSince = parseYearMonthDayDateString(value);
                setActiveDateRange((prevState) => {
                    const newPeriod =
                        prevState.period && newSince <= prevState.period.until
                            ? { since: newSince, until: prevState.period.until }
                            : { since: newSince, until: newSince };
                    return {
                        ...prevState,
                        period: newPeriod,
                    };
                });
            }
        }
        function handleEndInputValueChange(value) {
            setInputValues((prevState) => ({ ...prevState, until: value }));
            if (isValidDate(value)) {
                const newUntil = parseYearMonthDayDateString(value);
                setActiveDateRange((prevState) => {
                    const newPeriod =
                        prevState.period && newUntil >= prevState.period.since
                            ? { since: prevState.period.since, until: newUntil }
                            : { since: newUntil, until: newUntil };
                    return {
                        ...prevState,
                        period: newPeriod,
                    };
                });
            }
        }
        function handleInputBlur({ relatedTarget }) {
            const isRelatedTargetWithinPopover =
                relatedTarget != null && isNodeWithinPopover(relatedTarget);
            // If focus moves from the TextField to the Popover
            // we don't want to close the popover
            if (isRelatedTargetWithinPopover) {
                return;
            }
            setPopoverActive(false);
        }
        function handleMonthChange(month, year) {
            setDate({ month, year });
        }
        function handleCalendarChange({ start, end }) {
            const newDateRange = ranges.find((range) => {
                return (
                    range.period.since.valueOf() === start.valueOf() &&
                    range.period.until.valueOf() === end.valueOf()
                );
            }) || {
                alias: "custom",
                title: "Custom",
                period: {
                    since: start,
                    until: end,
                },
            };
            setActiveDateRange(newDateRange);
        }
        function apply() {
            setPopoverActive(false);
        }
        function cancel() {
            setPopoverActive(false);
        }
        useEffect(() => {
            if (activeDateRange) {
                setInputValues({
                    since: formatDate(activeDateRange.period.since),
                    until: formatDate(activeDateRange.period.until),
                });
                function monthDiff(referenceDate, newDate) {
                    return (
                        newDate.month -
                        referenceDate.month +
                        12 * (referenceDate.year - newDate.year)
                    );
                }
                const monthDifference = monthDiff(
                    { year, month },
                    {
                        year: activeDateRange.period.until.getFullYear(),
                        month: activeDateRange.period.until.getMonth(),
                    }
                );
                if (monthDifference > 1 || monthDifference < 0) {
                    setDate({
                        month: activeDateRange.period.until.getMonth(),
                        year: activeDateRange.period.until.getFullYear(),
                    });
                }
            }
        }, [activeDateRange]);
        const buttonValue =
            activeDateRange.title === "Custom"
                ? activeDateRange.period.since.toDateString() +
                " - " +
                activeDateRange.period.until.toDateString()
                : activeDateRange.title;
        return (
            <Popover
                active={popoverActive}
                autofocusTarget="none"
                preferredAlignment="left"
                preferredPosition="below"
                fluidContent
                sectioned={false}
                fullHeight
                activator={
                    <Button
                        size="slim"
                        icon={CalendarIcon}
                        onClick={() => setPopoverActive(!popoverActive)}
                    >
                        <Text variant="headingSm" as="h6">
                            May 24, 2024 - May 30, 2024
                        </Text>
                    </Button>
                }
                onClose={() => setPopoverActive(false)}
            >
                <Popover.Pane fixed>
                    <InlineGrid
                        columns={{
                            xs: "1fr",
                            mdDown: "1fr",
                            md: "max-content max-content",
                        }}
                        gap={0}
                        ref={datePickerRef}
                    >
                        <Box
                            maxWidth={mdDown ? "516px" : "212px"}
                            width={mdDown ? "100%" : "212px"}
                            padding={{ xs: 500, md: 0 }}
                            paddingBlockEnd={{ xs: 100, md: 0 }}
                        >
                            {mdDown ? (
                                <Select
                                    label="dateRangeLabel"
                                    labelHidden
                                    onChange={(value) => {
                                        const result = ranges.find(
                                            ({ title, alias }) => title === value || alias === value
                                        );
                                        setActiveDateRange(result);
                                    }}
                                    value={activeDateRange?.title || activeDateRange?.alias || ""}
                                    options={ranges.map(({ alias, title }) => title || alias)}
                                />
                            ) : (
                                <Scrollable style={{ height: "334px" }}>
                                    <OptionList
                                        options={ranges.map((range) => ({
                                            value: range.alias,
                                            label: range.title,
                                        }))}
                                        selected={activeDateRange.alias}
                                        onChange={(value) => {
                                            setActiveDateRange(
                                                ranges.find((range) => range.alias === value[0])
                                            );
                                        }}
                                    />
                                </Scrollable>
                            )}
                        </Box>
                        <Box padding={{ xs: 500 }} maxWidth={mdDown ? "320px" : "516px"}>
                            <BlockStack gap="400">
                                <InlineStack gap="200">
                                    <div style={{ flexGrow: 1 }}>
                                        <TextField
                                            role="combobox"
                                            label={"Since"}
                                            labelHidden
                                            prefix={<Icon source={CalendarIcon} />}
                                            value={inputValues.since}
                                            onChange={handleStartInputValueChange}
                                            onBlur={handleInputBlur}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <Icon source={ArrowRightIcon} />
                                    <div style={{ flexGrow: 1 }}>
                                        <TextField
                                            role="combobox"
                                            label={"Until"}
                                            labelHidden
                                            prefix={<Icon source={CalendarIcon} />}
                                            value={inputValues.until}
                                            onChange={handleEndInputValueChange}
                                            onBlur={handleInputBlur}
                                            autoComplete="off"
                                        />
                                    </div>
                                </InlineStack>
                                <div>
                                    <DatePicker
                                        month={month}
                                        year={year}
                                        selected={{
                                            start: activeDateRange.period.since,
                                            end: activeDateRange.period.until,
                                        }}
                                        onMonthChange={handleMonthChange}
                                        onChange={handleCalendarChange}
                                        multiMonth={shouldShowMultiMonth}
                                        allowRange
                                    />
                                </div>
                            </BlockStack>
                        </Box>
                    </InlineGrid>
                </Popover.Pane>
                <Popover.Pane fixed>
                    <Popover.Section>
                        <InlineStack align="end">
                            <Button onClick={cancel}>Cancel</Button>
                            <Button primary onClick={apply}>
                                Apply
                            </Button>
                        </InlineStack>
                    </Popover.Section>
                </Popover.Pane>
            </Popover>
        )
    }

    const CollapsibleExample = () => {
        const [open, setOpen] = useState(false);

        const handleToggle = useCallback(() => setOpen((open) => !open), []);

        return (
            <div >
                <Card sectioned>
                    <BlockStack gap='300'>

                        <div className='arrow-sign'>

                            <div style={{ display: 'flex' }} className='flex-container-button' onClick={() => handleToggle('intro')}>
                                <div style={{ flexGrow: "0" }}>
                                    <Icon
                                        source={EditIcon}
                                        tone="base"
                                    />
                                </div>
                                <div style={{ flexGrow: "8", textAlign: "start", marginLeft: "4px" }}>
                                    <Text variant="headingMd" as="h6">
                                        Need more design options?
                                    </Text>
                                </div>
                                <div style={{ flexGrow: "0", textAlign: "end" }}>
                                    <Icon
                                        source={ChevronDownIcon}
                                        tone="base"
                                    />
                                </div>
                            </div>
                        </div>

                        <Collapsible
                            open={open}
                            id="basic-collapsible"
                            transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                            expandOnPrint
                        >

                            <BlockStack gap='300'>

                                <p>
                                    Can't find the design options that you want? Chat with one of our support specialists to help you customize the app for free.
                                </p>

                                <div>
                                    <Button ><Text variant="headingSm" as="h6">
                                        Start chat
                                    </Text></Button>
                                </div>
                            </BlockStack>
                        </Collapsible>
                    </BlockStack>
                </Card>
            </div >
        );
    }

    const ModulefiltersCollapsibleExample = () => {
        const [open, setOpen] = useState(true);

        const handleToggle = useCallback(() => setOpen((open) => !open), []);

        const [value, setValue] = useState('1');

        const handleChange = (value, property) => {
            setFormData((formData) => ({
                ...formData,
                [property]: value,
            }));
        };
    
        return (
            <div >
                <Card sectioned>
                    <BlockStack gap='500'>

                        <div className='arrow-sign'>

                            <div style={{ display: 'flex' }} className='flex-container-button' onClick={() => handleToggle('intro')}>
                                <div style={{ flexGrow: "8", textAlign: "start", marginLeft: "4px" }}>
                                    <BlockStack gap='300'>
                                        <Text variant="headingMd" as="h6">
                                            Module filters
                                        </Text>
                                        <Text variant="bodySm" as="p">
                                            Display module on product pages according to filters
                                        </Text>
                                    </BlockStack>
                                </div>
                                <div style={{ flexGrow: "0", textAlign: "end" }}>
                                    <Icon
                                        source={ChevronDownIcon}
                                        tone="base"
                                    />
                                </div>
                            </div>
                        </div>

                        <Collapsible
                            open={open}
                            id="basic-collapsible"
                            transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                            expandOnPrint
                        >

                            <BlockStack gap='500'>
                                <FormLayout>
                                    <BlockStack gap='500'>
                                        <Box>
                                            <BlockStack gap='100'>
                                                <Text as="p" fontWeight="regular">
                                                    Price between
                                                </Text>
                                                <InlineStack align="space-around">
                                                    <TextField

                                                        type="number"
                                                        value={formData.price_start}
                                                        onChange={(e) =>
                                                            handleChange(e, "price_start")
                                                        }
                                                        onFocus={() => handleFocus("module1")}
                                                        autoComplete="off"
                                                        prefix="INR"
                                                    />
                                                    <Icon source={MinusIcon} tone='base'></Icon>
                                                    <TextField
                                                        type="number"
                                                        value={formData.price_end}
                                                        onChange={(e) =>
                                                            handleChange(e, "price_end")
                                                        }
                                                        onFocus={() => handleFocus("module2")}
                                                        autoComplete="off"
                                                        prefix="INR"
                                                    />
                                                </InlineStack>
                                            </BlockStack>
                                        </Box>

                                        <Box>
                                            <Text as="p" fontWeight="regular">
                                                Discount between
                                            </Text>
                                            <InlineStack align="space-around">
                                                <TextField
                                                    suffix="%"
                                                    type="number"
                                                    value={formData.discount_start}
                                                    onChange={(e) =>
                                                            handleChange(e, "discount_start")
                                                    }
                                                    onFocus={() => handleFocus("module2")}
                                                    autoComplete="off"

                                                />
                                                <Icon source={MinusIcon} tone='base'></Icon>
                                                <TextField
                                                    suffix="%"
                                                    type="number"
                                                    value={formData.discount_end}
                                                    onChange={(e) =>
                                                            handleChange(e, "discount_end")
                                                    }
                                                    onFocus={() => handleFocus("module4")}
                                                    autoComplete="off"

                                                />
                                            </InlineStack>
                                        </Box>

                                        <Box>
                                            <Text as="p" fontWeight="regular">
                                                Inventory between
                                            </Text>
                                            <InlineStack align="space-around">
                                                <TextField
                                                    type="number"
                                                    value={formData.inventory_start}
                                                    onChange={(e) =>
                                                            handleChange(e, "inventory_start")
                                                    }
                                                    onFocus={() => handleFocus("module5")}
                                                    autoComplete="off"

                                                />
                                                <Icon source={MinusIcon} tone='base'></Icon>
                                                <TextField
                                                    type="number"
                                                    value={formData.inventory_end}
                                                    onChange={(e) =>
                                                            handleChange(e, "inventory_end")
                                                    }
                                                    onFocus={() => handleFocus("module6")}
                                                    autoComplete="off"

                                                />
                                            </InlineStack>
                                        </Box>

                                        <Box>
                                            <TextField
                                                label="Display only on"
                                                type="number"
                                                value={''}
                                                onChange={''}
                                                autoComplete="off"
                                                connectedRight={
                                                    <Button >
                                                        <Text variant="headingSm" as="h6">
                                                            Browse
                                                        </Text>
                                                    </Button>}
                                                prefix={<Icon source={SearchIcon}></Icon>}
                                                placeholder='Search products'
                                            />
                                        </Box>
                                    </BlockStack>
                                </FormLayout>

                                <div>
                                    <Button tone="critical" variant="tertiary">
                                        <Text variant="headingSm" as="h6">
                                            Reset filters
                                        </Text>
                                    </Button>
                                </div>
                            </BlockStack>
                        </Collapsible>
                    </BlockStack>
                </Card>
            </div >
        );
    }

    const Location_options = [
        { label: 'Select an option', value: 'Select an option' , disabled: true},
        { label: 'Top', value: 'Top' },
        { label: 'Bottom', value: 'Bottom' },
    ];
    const Cart_bar_options = [
        { label: 'Select an option', value: 'Select an option' ,disabled: true},
        { label: 'Always on display', value: 'Always on display' },
        { label: 'When user starts scrolling', value: 'When user starts scrolling' },
        { label: 'When user scrolls past the Add to cart button', value: 'When user scrolls past the Add to cart button' },
    ];
    const Height_options = [
        { label: 'Small', value: 'Small' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Big', value: 'Big' },
    ];
    const Button_Size_options = [
        { label: 'Small', value: 'Small' },
        { label: 'Large', value: 'Large' },
    ];

    const Mobile_Location_options = [
        { label: 'Select an option', value: 'Select an option',disabled: true },
        { label: 'Bottom', value: 'Bottom' },
        { label: 'Top', value: 'Top' },
    ];
    const Show_Cart_bar_options = [
        { label: 'Select an option', value: 'Select an option', disabled: true },
        { label: 'Always on display', value: 'Always on display' },
        { label: 'When user starts scrolling', value: 'When user starts scrolling' },
        { label: 'When user scrolls past the Add to cart button', value: 'When user scrolls past the Add to cart button' },
    ];

    const Styling_options = [
        { label: 'Select an option', value: 'Select an option',disabled: true },
        { label: 'Automatic, copies the style of the ATC button', value: 'Automatic, copies the style of the ATC button' },
        { label: 'Custom', value: 'Custom' },
    ];

    const SettingsTab=(
    <BlockStack gap="400">
        <InlineGrid columns={['oneThird', 'twoThirds']}>
            <Text variant="headingMd" as="h6">
                Settings for Desktop
            </Text>
            <Layout>
                <Layout.Section>
                    <Card roundedAbove="sm">
                        <BlockStack gap="300">
                            <Box paddingBlockStart="200">
                                <div className='checkbox_section'>
                                    <BlockStack gap="400">
                                        <Checkbox
                                            key="show_on_desktop"
                                            label="Show the Sticky Add to Cart bar on Desktop Devices."
                                            onFocus={() => handleFocus("field1")}
                                            onChange={(e) =>
                                                handleChange(e, "show_on_desktop")
                                            }
                                            checked={formData.show_on_desktop}
                                        />

                                        <Select
                                            key="desktop_position"
                                            name='desktop_position'
                                            label="Desktop Location"
                                            options={Location_options}
                                            onFocus={() => handleFocus("field2")}
                                            onChange={(e) =>
                                                handleChange(e, "desktop_position")
                                            }
                                            value={formData.desktop_position}
                                        />

                                        <Select
                                            key="how_sticky_cart"
                                            label="Show the Sticky Add to Cart bar"
                                            onFocus={() => handleFocus("field3")}
                                            options={Cart_bar_options}
                                            onChange={(e) =>
                                                handleChange(e, "how_sticky_cart")
                                            }
                                            value={formData.how_sticky_cart}
                                        />

                                        <Checkbox
                                            key="show_quantity"
                                            label="Show Quantity Selector on Desktop"
                                            onFocus={() => handleFocus("field4")}
                                            checked={formData.show_quantity}
                                            onChange={(e) =>
                                                handleChange(e, "show_quantity")
                                            }
                                        />

                                        <Checkbox
                                            key="show_variant"
                                            label="Show the Variant Selector on Desktop"
                                            onFocus={() => handleFocus("field5")}
                                            onChange={(e) =>
                                                handleChange(e, "show_variant")
                                            }
                                            checked={formData.show_variant}
                                        />

                                        <Select
                                            key="sticky_height"
                                            label="Sticky Bar Height"
                                            options={Height_options}
                                            onFocus={() => handleFocus("field6")}
                                            onChange={(e) =>
                                                handleChange(e, "sticky_height")
                                            }
                                            value={formData.sticky_height}
                                        />

                                        <Checkbox
                                            key="show_product_title"
                                            label="Show Product Title on Desktop"
                                            onFocus={() => handleFocus("field7")}
                                            onChange={(e) =>
                                                handleChange(e, "show_product_title")
                                            }
                                            checked={formData.show_product_title}
                                        />

                                        <Select
                                        key="button_size"
                                            label="Button Size"
                                            options={Button_Size_options}
                                            onFocus={() => handleFocus("field8")}
                                            onChange={(e) =>
                                                handleChange(e, "button_size")
                                            }
                                            value={formData.button_size}
                                        />
                                    </BlockStack>
                                </div>
                            </Box>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </InlineGrid>

        <InlineGrid columns={['oneThird', 'twoThirds']}>
            <Text variant="headingMd" as="h6">
                Settings for Mobile
            </Text>
            <Layout>
                <Layout.Section>
                    <Card roundedAbove="sm">
                        <BlockStack gap="300">
                            <Box paddingBlockStart="200">
                                <div className='checkbox_section'>
                                    <BlockStack gap="400">
                                        <Checkbox
                                            label="Show the Sticky Add to Cart bar on Mobile Devices."
                                            onFocus={() => handleFocus("field_1")}
                                            checked={formData.show_on_mobile}
                                            onChange={(e) =>
                                                handleChange(e, "show_on_mobile")
                                            }
                                        />

                                        <Select
                                            label="Mobile Location"
                                            options={Mobile_Location_options}
                                            onFocus={() => handleFocus("field_2")}
                                            onChange={(e) =>
                                                handleChange(e, "mobile_position")
                                            }
                                            value={formData.mobile_position}
                                        />

                                        <Select
                                            label="Show the Sticky Add to Cart bar"
                                            onFocus={() => handleFocus("field_3")}
                                            options={Show_Cart_bar_options}
                                            onChange={(e) =>
                                                handleChange(e, "show_sticky_cart_mobile")
                                            }
                                            value={formData.show_sticky_cart_mobile}
                                        />

                                        <Checkbox
                                            label="Show Quantity Selector on Mobile"
                                            onFocus={() => handleFocus("field_4")}
                                            checked={formData.show_quantity_mobile}
                                            onChange={(e) =>
                                                handleChange(e, "show_quantity_mobile")
                                            }
                                        />

                                        <Checkbox
                                            label="Show the Variant Selector on Mobile"
                                            onFocus={() => handleFocus("field_5")}
                                            checked={formData.show_variant_mobile}
                                            onChange={(e) =>
                                                handleChange(e, "show_variant_mobile")
                                            }
                                        />
                                    </BlockStack>
                                </div>
                            </Box>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </InlineGrid>

        <InlineGrid columns={['oneThird', 'twoThirds']}>
            <Text variant="headingMd" as="h6">
                Product Reviews integration
            </Text>
            <Layout>
                <Layout.Section>
                    <Card roundedAbove="sm">
                        <BlockStack gap="300">
                            <Box paddingBlockStart="200">
                                <div className='checkbox_section'>
                                    <BlockStack gap="400">
                                        <Checkbox
                                            label="Show Product Reviews Stars"
                                            helpText="Show the stars from the Product Reviews module."
                                            onFocus={() => handleFocus("field_5")}
                                            checked={formData.show_product_reviews}
                                            onChange={(e) =>
                                                handleChange(e, "show_product_reviews")
                                            }
                                        />

                                    </BlockStack>
                                </div>
                            </Box>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </InlineGrid>

        <InlineGrid columns={['oneThird', 'twoThirds']}>
            <Text variant="headingMd" as="h6">
                Look and feel
            </Text>
            <Layout>
                <Layout.Section>
                    <Card roundedAbove="sm">
                        <BlockStack gap="300">
                            <Box paddingBlockStart="200">
                                <div className='checkbox_section'>
                                    <BlockStack gap="400">
                                        <div className='color_section'>
                                            <TextField
                                                label="Background color"
                                                type="text"
                                                onFocus={() => handleFocus("field-1")}
                                                value={formData.background_color}
                                                onChange={(e) =>
                                                    handleChange(e, "background_color")
                                                }
                                                autoComplete="off"
                                                connectedLeft={
                                                    <input
                                                        type="color"
                                                        onFocus={() => handleFocus("field-1")}
                                                        value={formData.background_color}
                                                        onChange={(e) =>
                                                            handleColorChange(e, "background_color")
                                                        }
                                                        style={{
                                                            boxShadow: formData.background_color === '#ffffff' ? 'inset 0 0 0 1px rgba(0, 0, 0, .19)' : 'none',
                                                            width:formData.background_color === '#ffffff' ? '34px':'38px',
                                                               height:formData.background_color === '#ffffff' ? '34px':'38px'
                                                          }}
                                                        
                                                    />
                                                }
                                            />
                                        </div>

                                        <div className='color_section'>
                                            <TextField
                                                onFocus={() => handleFocus("field-2")}
                                                label="Text color"
                                                type="text"
                                                value={formData.text_color}
                                                onChange={(e) =>
                                                    handleChange(e, "text_color")
                                                }
                                                autoComplete="off"
                                                connectedLeft={
                                                    <input
                                                        type="color"
                                                        value={formData.text_color}
                                                        onFocus={() => handleFocus("field-2")}
                                                        onChange={(e) =>
                                                            handleColorChange(e, "text_color")
                                                        }
                                                        style={{
                                                            boxShadow: formData.text_color === '#ffffff' ? 'inset 0 0 0 1px rgba(0, 0, 0, .19)' : 'none',
                                                            width:formData.text_color === '#ffffff' ? '34px':'38px',
                                                               height:formData.text_color === '#ffffff' ? '34px':'38px'
                                                          }}
                                                    />
                                                }
                                            />
                                        </div>
                         <div className='color_section'>
                                            <TextField
                                                onFocus={() => handleFocus("field-inner1")}
                                                label="Button Color"
                                                type="text"
                                                value={formData.button_color}
                                                onChange={(e) =>
                                                    handleChange(e, "button_color")
                                                }
                                                autoComplete="off"
                                                connectedLeft={
                                                    <input
                                                        type="color"
                                                        value={formData.button_color}
                                                        onFocus={() => handleFocus("field-inner1")}
                                                        onChange={(e) =>
                                                            handleColorChange(e, "button_color")
                                                        }
                                                        style={{
                                                            boxShadow: formData.button_color === '#ffffff' ? 'inset 0 0 0 1px rgba(0, 0, 0, .19)' : 'none',
                                                            width:formData.button_color === '#ffffff' ? '34px':'38px',
                                                               height:formData.button_color === '#ffffff' ? '34px':'38px'
                                                          }}
                                                    />
                                                }
                                            />
                                            </div>
                                            <div className='color_section'>
                                                <TextField
                                                    onFocus={() => handleFocus("field-inner2")}
                                                    label="Button Text Color"
                                                    type="text"
                                                    value={formData.button_text_color}
                                                    onChange={(e) =>
                                                        handleChange(e, "button_text_color")
                                                    }
                                                    autoComplete="off"
                                                    connectedLeft={
                                                        <input
                                                            type="color"
                                                            value={formData.button_text_color}
                                                            onFocus={() => handleFocus("field-inner2")}
                                                            onChange={(e) =>
                                                                handleColorChange(e, "button_text_color")
                                                            }
                                                            style={{
                                                                boxShadow: formData.button_text_color === '#ffffff' ? 'inset 0 0 0 1px rgba(0, 0, 0, .19)' : 'none',
                                                                width:formData.button_text_color === '#ffffff' ? '34px':'38px',
                                                                   height:formData.button_text_color === '#ffffff' ? '34px':'38px'
                                                              }}
                                                        />
                                                    }
                                                />
                                            </div>
                                       
                                      
                                        
                                         <TextField
                                            label={<InlineStack >Border Radius <Tooltip  content={`This controls the border radius for the "Add to cart" button and the selectors.`}><Icon source={AlertCircleIcon} tone='base'></Icon></Tooltip></InlineStack>}
                                            type="number"
                                            className="no-spinner"
                                            value={formData.border_radius}
                                            onFocus={() => handleFocus("field-5")}
                                            onChange={(e) =>
                                                handleChange(e, "border_radius")
                                            }
                                            suffix="px"
                                            autoComplete="off"
                                        />
                                       
                                        <div className='color_section'>
                                            <TextField
                                                label={<InlineStack >Selectors Border-color <Tooltip  content={`This controls the color of variants and quantity selectors.`}><Icon source={AlertCircleIcon} tone='base'></Icon></Tooltip></InlineStack>}
                                                type="text"
                                                value={formData.border_colors}
                                                onFocus={() => handleFocus("field-6")}
                                                onChange={(e) =>
                                                    handleChange(e, "border_colors")
                                                }
                                                autoComplete="off"
                                                connectedLeft={
                                                    <input
                                                        type="color"
                                                        value={formData.border_colors}
                                                        onFocus={() => handleFocus("field-6")}
                                                        onChange={(e) =>
                                                            handleColorChange(e, "border_colors")
                                                        }
                                                        style={{
                                                            boxShadow: formData.border_colors === '#ffffff' ? 'inset 0 0 0 1px rgba(0, 0, 0, .19)' : 'none',
                                                            width:formData.border_colors === '#ffffff' ? '34px':'38px',
                                                               height:formData.border_colors === '#ffffff' ? '34px':'38px'
                                                          }}
                                                    />
                                                }
                                            />
                                        </div>
                                        
                                    </BlockStack>
                                </div>
                            </Box>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </InlineGrid>

        <InlineGrid columns={['oneThird', 'twoThirds']}>
            <Text variant="headingMd" as="h6">
            </Text>
            <Layout>
                <Layout.Section>
                    <BlockStack gap="300">
                        <Box paddingBlockStart="200">
                            <CollapsibleExample />
                        </Box>
                    </BlockStack>
                </Layout.Section>
            </Layout>
        </InlineGrid>

        <InlineGrid columns={['oneThird', 'twoThirds']}>
            <Text variant="headingMd" as="h6">
            </Text>
            <Layout>
                <Layout.Section>
                    <BlockStack gap="300">
                        <Box paddingBlockStart="200">
                            {/* <ModulefiltersCollapsibleExample /> */}
                        </Box>
                    </BlockStack>
                </Layout.Section>
            </Layout>
        </InlineGrid>

        {/* <div className='lower_section'>
            <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                    <Card roundedAbove="sm">
                        <BlockStack gap="200">
                            <Text as="h2" variant="headingSm">
                                Check our Help Center
                            </Text>
                            <BlockStack gap="200">
                                <Text as="h3" variant="headingSm" fontWeight="medium">
                                    If you need help with setting up the Scroll to Top Button app, please check our exhaustive Help Center for details.
                                </Text>

                            </BlockStack>
                            <InlineStack align="end">
                                <ButtonGroup>
                                    <Button icon={ExternalIcon} onClick={() => { }} accessibilityLabel="Fulfill items">
                                        <Text variant="headingSm" as="h6">Get help</Text>
                                    </Button>

                                </ButtonGroup>
                            </InlineStack>
                        </BlockStack>
                    </Card>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                    <Card roundedAbove="sm">
                        <BlockStack gap="200">
                            <Text as="h2" variant="headingSm">
                                We're here for you, 24/7
                            </Text>
                            <BlockStack gap="200">
                                <Text as="h3" variant="headingSm" fontWeight="medium">
                                    We know how complex Vitals is - that's why <Link href='#'>we are available 24/7</Link> to support you in setting it up.
                                </Text>

                            </BlockStack>
                            <InlineStack align="end">
                                <ButtonGroup>
                                    <Button onClick={() => { }} accessibilityLabel="Fulfill items">
                                        <Text variant="headingSm" as="h6">Contact us</Text>
                                    </Button>

                                </ButtonGroup>
                            </InlineStack>
                        </BlockStack>
                    </Card>
                </Grid.Cell>
            </Grid>
        </div> */}
    </BlockStack> 
    )

    const AnalyticsPaymentsTab = () => {

        return (
            <div className='AnalyticsPaymentsTab_container'>
                <BlockStack gap='300'>
                    <InlineStack gap='300'>
                        <div><DateRangePicker /></div>
                        <Text >compared to May 17, 2024 - May 23, 2024</Text>
                    </InlineStack>
                </BlockStack>
            </div>
        )
    }

    const [selected, setSelected] = useState(0);
    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );

    const tabs = [
        {
            id: 'Settings-customers-1',
            content: 'Settings',
            accessibilityLabel: 'Settings customers',
            panelID: 'Settings-customers-content-1',
            component: <div className='SettingsDataTab_container'>{SettingsTab}</div>,
            dummy: ''
        },
        {
            id: 'Analytics-marketing-1',
            content: 'Analytics',
            panelID: 'Analytics-marketing-content-1',
            component: <AnalyticsPaymentsTab />,
            dummy: ''
        },
    ];

    return (
        <div className='Sticky_Add_to_Cart_page'>
            <Page
                backAction={{ content: "Back", onAction: () => navigate(("/app")) }}
                title="Sticky Add to Cart"
                subtitle={"Improve conversion rate by displaying a sticky add to cart bar when the visitors are scrolling down."}
                // compactTitle
                primaryAction={
                    status ? (
                        <DeactivatePopover handleToggleStatus={handleToggleStatus} buttonLoading={buttonloading} />
                    ) : {
                        content: "Activate App",
                        tone: "success",
                        onAction: handleToggleStatus,
                        loading: buttonloading,
                    }
                }
                secondaryActions={[
                    {
                        content: 'Tutorial',
                    },
                ]}
            >
                <div className='Sticky_Add_to_Cart'>
                    <div className='TabsField'>
                        <BlockStack gap='200'>
                        <div className='tab_container'>
                            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                                <Box >{tabs[selected].dummy}</Box>
                                <div>
                                        {/* <SettingsDataTab/> */}
                                    {tabs[selected].component}
                                </div>
                            </Tabs>
                        </div>
                        </BlockStack>
                    </div>
                </div>
                {activeField && (
                    <Frame
                        logo={{
                            width: 86,
                            contextualSaveBarSource:
                                "https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png",
                        }}
                    >
                        <ContextualSaveBar
                            message="Unsaved changes"
                            saveAction={{
                                onAction: handleSave,
                                loading: buttonloading,
                                disabled: false,
                            }}
                            discardAction={{
                                onAction: handleDiscard,
                            }}
                        />
                        </Frame>
                    )}
                {toastMarkup}
            </Page>
        </div>
    );
}



