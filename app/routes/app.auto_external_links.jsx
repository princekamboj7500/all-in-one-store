import { BlockStack, Button, ButtonGroup, Card, Text, Page, List, Grid, InlineStack, Link, Popover, ActionList, Icon } from '@shopify/polaris';

import {
    ExternalIcon, XIcon
} from '@shopify/polaris-icons';
import { useCallback, useState } from 'react';

function Auto_External_Links(props) {

    const SettingsDataTab = () => {

        return (
            <div className='Cart_notice_page_SettingsDataTab_container'>
                <BlockStack gap="400">

                    <div className='lower_section'>
                        <Grid>

                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                                <Card roundedAbove="sm">
                                    <BlockStack gap="200">
                                        <Text as="h2" variant="headingSm">
                                            Check our Help Center
                                        </Text>
                                        <BlockStack gap="200">
                                            <Text as="p" fontWeight="reguler">
                                                If you need help with setting up the Auto External Links app, please check our exhaustive Help Center for details.
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
                                            <Text as="p" fontWeight="reguler">
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
                    </div>

                </BlockStack>
            </div>
        )
    };

    function PopoverContentExample() {
        const [popoverActive, setPopoverActive] = useState(false);
        const [isActivated, setIsActivated] = useState(false);

        const togglePopoverActive = useCallback(
            () => setPopoverActive((popoverActive) => !popoverActive),
            [],
        );

        const handleActivateClick = useCallback(() => {
            setIsActivated(false);
            setPopoverActive(true);
        }, []);

        const handleActivateClickAgain = useCallback(() => {
            setIsActivated(true);
            setPopoverActive(false);
        }, []);

        const activator = (
            <>
                {isActivated ? (
                    <Button onClick={togglePopoverActive} disclosure>
                        Active
                    </Button>
                ) : (

                    <Button className="activate_button" tone="success" onClick={handleActivateClickAgain}>
                        Activate
                    </Button>
                )}
            </>
        );

        return (
            <div>
                {
                    isActivated ? <>
                        <Popover
                            active={popoverActive}
                            activator={activator}
                            autofocusTarget="first-node"
                            onClose={togglePopoverActive}
                        >
                            <Card>
                                <Button onClick={handleActivateClick} tone="critical">Deactivate Sticky Add to Cart</Button>
                            </Card>
                        </Popover>
                    </> : <>

                        <Popover
                            active={popoverActive}
                            activator={activator}
                            autofocusTarget="first-node"
                            onClose={togglePopoverActive}
                        >
                            <Popover.Pane fixed>
                                <Popover.Section>
                                    <InlineStack><Text alignment='center' as="p" fontWeight="regular" variant="headingMd">What went wrong? </Text>
                                        <div><Icon source={XIcon}></Icon></div></InlineStack>
                                </Popover.Section>
                            </Popover.Pane>
                            <Popover.Pane>
                                <ActionList
                                    actionRole="menuitem"
                                    items={[
                                        { content: `Submit a bug: the app doesn't work as expected` },
                                        { content: 'Some features are missing' },
                                        { content: `Design doesn't match my theme` },
                                        { content: `It conflicts with another app` },
                                        { content: `I don't need it anymore` },
                                        { content: `Other` },
                                    ]}
                                />
                            </Popover.Pane>
                        </Popover>
                    </>
                }
            </div>
        );
    }

    return (
        <div className='Auto_External_Links'>
            <Page
                backAction={{ content: 'Products', url: '#' }}
                title="Auto External Links"
                subtitle="Prevent visitors from closing your store when opening external links, by automatically opening them in new tabs."

                primaryAction={
                    <PopoverContentExample />
                }
                secondaryActions={[
                    {
                        content: 'Tutorial',
                    },
                ]}

            >
                <div className='intant_search'>
                    <div className='intant_search_TabsField'>
                        <BlockStack gap='200'>
                            <SettingsDataTab />
                        </BlockStack>
                    </div>
                </div>

            </Page>
        </div>
    );
}

export default Auto_External_Links;