import { Banner, BlockStack, Box, Button, ButtonGroup, Card, Checkbox, Collapsible, DatePicker, Form, FormLayout, Grid, Icon, InlineGrid, InlineStack, Layout, LegacyCard, LegacyStack, Link, OptionList, Page, Popover, Scrollable, Select, Tabs, Text, TextContainer, TextField, Tooltip, useBreakpoints } from '@shopify/polaris';
import React, { Component, useCallback, useRef, useState, useEffect } from 'react';
import {
    ChevronDownIcon, EditIcon, MinusIcon, SearchIcon, ExternalIcon, CalendarIcon, AlertCircleIcon, ArrowRightIcon
} from '@shopify/polaris-icons';

export default function DateRangePicker() {

    const { mdDown, lgUp } = useBreakpoints();
    const shouldShowMultiMonth = lgUp;
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const yesterday = new Date(
        new Date(new Date().setDate(today.getDate() - 1)).setHours(0, 0, 0, 0)
    );

    const [custom, setCustom] = useState(today);

    const todayDate = new Date();
    const firstDayOfCurrentMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    const lastDayOfLastMonth = new Date(firstDayOfCurrentMonth.setDate(0));
    const firstDayOfLastMonth = new Date(lastDayOfLastMonth.getFullYear(), lastDayOfLastMonth.getMonth(), 1);

    const currentYear = todayDate.getFullYear();
    const firstDayOfLastYear = new Date(currentYear - 1, 0, 1); // January 1st of last year
    const lastDayOfLastYear = new Date(currentYear - 1, 11, 31, 23, 59, 59, 999); // December 31st of last year

    const ranges = [
        {
            title: "Custom",
            alias: "custom",
            period: {
                since: today,
                until: today,
            },
        },
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


    useEffect(() => {
       
        //setCustom(activeDateRange)
    }, [activeDateRange])

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

            const [date, setActiveDate]=useState({startDate:'',endDate:''})

    useEffect(() => {
        const get_only_date = (date) => {
            if (date && date.period) {
                const start_dateObj = new Date(date.period.since);
                const end_dateObj = new Date(date.period.until);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const start_formattedDate = start_dateObj.toLocaleDateString('en-US', options);
                const end_formattedDate = end_dateObj.toLocaleDateString('en-US', options);  
                
                setActiveDate({
                    startDate:start_formattedDate,
                    endDate:end_formattedDate
                })
            }
        };

        get_only_date(activeDateRange);
    }, [activeDateRange])



    return (
        <InlineStack gap={600}>
            <div>
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

                            <Box padding={{ xs: 500 }} maxWidth={mdDown ? "320px" : "516px"}>
                                <BlockStack gap="400">
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

                            <BlockStack >
                                <Box
                                    maxWidth={mdDown ? "516px" : "100%"}
                                    width={mdDown ? "100%" : "100%"}
                                    padding={{ xs: 500 }}
                                    paddingBlockEnd={{ xs: 100, md: 0 }}
                                >
                                    {mdDown ? (
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
                                    ) : (
                                        <Select
                                            label="Date range"
                                            //labelHidden
                                            onChange={(value) => {
                                                const result = ranges.find(
                                                    ({ title, alias }) => title === value || alias === value
                                                );
                                                setActiveDateRange(result);
                                            }}
                                            value={activeDateRange?.title || activeDateRange?.alias || ""}
                                            options={ranges.map(({ alias, title }) => title || alias)}
                                        />
                                    )}
                                </Box>

                                <Box padding={{ xs: 500 }}>
                                    <InlineStack gap="200">
                                        <div style={{ flexGrow: 1 }}>
                                            <TextField
                                                role="combobox"
                                                label={"Start date"}
                                                // labelHidden
                                                //prefix={<Icon source={CalendarIcon} />}
                                                value={inputValues.since}
                                                onChange={handleStartInputValueChange}
                                                onBlur={handleInputBlur}
                                                autoComplete="off"
                                            />
                                        </div>

                                        <div style={{ flexGrow: 1 }}>
                                            <TextField
                                                role="combobox"
                                                label={"End date"}
                                                //labelHidden
                                                //prefix={<Icon source={CalendarIcon} />}
                                                value={inputValues.until}
                                                onChange={handleEndInputValueChange}
                                                onBlur={handleInputBlur}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </InlineStack>
                                </Box>
                            </BlockStack>
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
            </div>

            <div style={{marginTop:'7px'}}>                
                <Text >{`compared to ${date.startDate} - ${date.endDate}`}</Text>               
            </div>
        </InlineStack>
    )
}