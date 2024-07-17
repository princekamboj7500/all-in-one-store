import { BlockStack, Box, ButtonGroup, Card, Icon, InlineGrid, InlineStack, Text } from '@shopify/polaris';
import React from 'react';
import {
    ArrowUpIcon
} from '@shopify/polaris-icons';

function GraphCard(props) {
    return (
        <div className='graph_card_ui'>
            <InlineGrid  columns={5}>

                <div className='graph_card_1'>
                    <BlockStack gap={300}>
                        <Text fontWeight="bold" variant="headingMd" as="h6">
                            Impressions
                        </Text>
                        <Text fontWeight="bold" variant="headingLg" as="h5">
                            8
                        </Text>
                        {/* <InlineGrid >
                           
                        </InlineGrid> */}

                        <InlineStack gap='200'>
                            <div>
                                <Icon source={ArrowUpIcon}></Icon>
                            </div>
                            <Text as="p" fontWeight="medium">
                                100%
                            </Text>
                        </InlineStack>
                    </BlockStack>
                </div>

                <div className='graph_card_2'>
                    <BlockStack gap={300}>
                        <Text fontWeight="bold" variant="headingMd" as="h6">
                            Impressions
                        </Text>
                        <Text fontWeight="bold" variant="headingLg" as="h5">
                            8
                        </Text>
                        {/* <InlineGrid >
                           
                        </InlineGrid> */}

                        <InlineStack gap='200'>
                            <div>
                                <Icon source={ArrowUpIcon}></Icon>
                            </div>
                            <Text as="p" fontWeight="medium">
                                100%
                            </Text>
                        </InlineStack>
                    </BlockStack>
                </div>
                
                <div className='graph_card_3'>
                    <BlockStack gap={300}>
                        <Text fontWeight="bold" variant="headingMd" as="h6">
                            Impressions
                        </Text>
                        <Text fontWeight="bold" variant="headingLg" as="h5">
                            8
                        </Text>
                        {/* <InlineGrid >
                           
                        </InlineGrid> */}

                        <InlineStack gap='200'>
                            <div>
                                <Icon source={ArrowUpIcon}></Icon>
                            </div>
                            <Text as="p" fontWeight="medium">
                                100%
                            </Text>
                        </InlineStack>
                    </BlockStack>
                </div>
                
                <div className='graph_card_4'>
                    <BlockStack gap={300}>
                        <Text fontWeight="bold" variant="headingMd" as="h6">
                            Impressions
                        </Text>
                        <Text fontWeight="bold" variant="headingLg" as="h5">
                            8
                        </Text>
                        {/* <InlineGrid >
                           
                        </InlineGrid> */}

                        <InlineStack gap='200'>
                            <div>
                                <Icon source={ArrowUpIcon}></Icon>
                            </div>
                            <Text as="p" fontWeight="medium">
                                100%
                            </Text>
                        </InlineStack>
                    </BlockStack>
                </div>
                
                <div className='graph_card_5'>
                    <BlockStack gap={300}>
                        <Text fontWeight="bold" variant="headingMd" as="h6">
                            Impressions
                        </Text>
                        <Text fontWeight="bold" variant="headingLg" as="h5">
                            8
                        </Text>
                        {/* <InlineGrid >
                           
                        </InlineGrid> */}

                        <InlineStack gap='200'>
                            <div>
                                <Icon source={ArrowUpIcon}></Icon>
                            </div>
                            <Text as="p" fontWeight="medium">
                                100%
                            </Text>
                        </InlineStack>
                    </BlockStack>
                </div>
            </InlineGrid>
        </div>
    );
}

export default GraphCard;