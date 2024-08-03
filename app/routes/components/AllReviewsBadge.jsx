import { BlockStack, Button, ButtonGroup, Card, RangeSlider, RadioButton, ContextualSaveBar, ChoiceList, Text, Page, InlineGrid, Listbox, Select, Tooltip, Checkbox, TextField, Tabs, Box, Layout, Toast, Grid, Frame, InlineStack, Link, Popover, ActionList, Icon } from '@shopify/polaris';
import {
    ExternalIcon, XIcon, AlertCircleIcon
} from '@shopify/polaris-icons';
import horizontal from "./../assets/product_review/horizontal.png"
import vertical from "./../assets/product_review/vertical.png"
import custom from "./../assets/product_review/custom.png"
import dark from "./../assets/product_review/dark.png"
import light from "./../assets/product_review/light.png"

function AllreviewsBadge({ formData, handleFocus, handleChange, handleColorChange }) {
    const layout_options = [
        { id: 'horizontal', label: 'Horizontal', imgSrc: horizontal },
        { id: 'vertical', label: 'Vertical', imgSrc: vertical }
    ];
    const style_options = [
        { id: 'custom', label: 'Custom', imgSrc: custom },
        { id: 'light', label: 'Light', imgSrc: light },
        { id: 'dark', label: 'Dark', imgSrc: dark }
    ];
    const widget_alignment_options = [
        { id: 'Left', label: 'Left' },
        { id: 'Center', label: 'Center' },
        { id: 'Right', label: 'Right' },
    ];

    return (
        <>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="300">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Publish and position</Text>
                       
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <BlockStack gap={200}>
                                <Text variant="headingSm" as="h6" fontWeight='regular'>Display manually</Text>
                                <Text variant="headingSm" as="p" fontWeight='regular' tone="subdued" >Place the All Reviews Badge manually on your homepage or other pages using the editor.</Text>
                                <InlineStack align="start">
                                    <ButtonGroup>
                                        <Button onClick={() => { }} accessibilityLabel="Go to editor"> Go to Shopify Editor</Button>
                                    </ButtonGroup>
                                </InlineStack>
                            </BlockStack>
                        </Box>

                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Layout and design</Text>
                        <div className='img-choicelist'>
                            <ChoiceList
                                title="Layout"
                                choices={layout_options.map(option => ({
                                    label: (
                                        <span className={formData.badge_layout == option.id ? "labelchecked labelmain" : "labelmain"}>
                                            {option.label}
                                            <img src={option.imgSrc} alt={option.label} />
                                        </span>
                                    ),
                                    value: option.id,
                                }))}
                                selected={[formData.badge_layout]}
                                onChange={(selected) => {
                                    handleFocus("badge_layout");
                                    handleChange(selected[0], "badge_layout");
                                }}
                                helpText="You can change the design settings for this layout in the Layout design settings section below."
                            />
                        </div>
                        <div className='img-choicelist'>
                            <ChoiceList
                                title="Style"
                                choices={style_options.map(option => ({
                                    label: (
                                        <span className={formData.badge_style == option.id ? "labelchecked labelmain" : "labelmain"}>
                                            {option.label}
                                            <img src={option.imgSrc} alt={option.label} />
                                        </span>
                                    ),
                                    value: option.id,
                                }))}
                                selected={[formData.badge_style]}
                                onChange={(selected) => {
                                    handleFocus("badge_style");
                                    handleChange(selected[0], "badge_style")
                                }}
                                helpText="You can change the design settings for this layout in the Layout design settings section below."
                            />
                        </div>
                        {formData.badge_layout === 'vertical' &&
                            <div className="btn-grp-radio">
                                <ChoiceList
                                    title="Star alignment"
                                    choices={widget_alignment_options.map(option => ({
                                        label: (
                                            <span className={formData.custom_widget_alignment == option.id ? "labelchecked labelmain" : "labelmain"}>
                                                <span>{option.label}</span>
                                            </span>
                                        ),
                                        value: option.id,
                                    }))}
                                    selected={formData.custom_widget_alignment}
                                    onChange={(selected) => {
                                        handleFocus("custom_widget_alignment");
                                        handleChange(selected, "custom_widget_alignment")
                                    }}
                                />
                            </div>
                        }
                        {formData.badge_style === 'custom' && (<>
                            <Checkbox
                                label="Show background"
                                checked={formData.badge_show_bg}
                                onChange={(e) => {
                                    handleFocus("badge_show_bg")
                                    handleChange(e, "badge_show_bg")
                                }}
                            />
                            {formData.badge_show_bg && (
                                <div className='color_section'>
                                    <TextField
                                        label="Background color"
                                        type="text"
                                        value={formData.custom_bg_color}
                                        onChange={(e) => {
                                            handleFocus("custom_bg_color")
                                            handleChange(e, "custom_bg_color")
                                        }}
                                        autoComplete="off"
                                        connectedLeft={
                                            <input
                                                type="color"
                                                value={formData.custom_bg_color}
                                                onChange={(e) => {
                                                    handleFocus("custom_bg_color")
                                                    handleColorChange(e, "custom_bg_color")
                                                }
                                                }
                                            />
                                        }
                                    />
                                </div>
                            )}
                            <Checkbox
                                label="Show border"
                                checked={formData.badge_show_border}
                                onChange={(e) => {
                                    handleFocus("badge_show_border")
                                    handleChange(e, "badge_show_border")
                                }}
                            />
                            {formData.badge_show_border && (
                                <div className='color_section'>
                                    <TextField
                                        label="Border color"
                                        type="text"
                                        value={formData.custom_border_color}
                                        onChange={(e) => {
                                            handleFocus("custom_border_color")
                                            handleChange(e, "custom_border_color")
                                        }}
                                        autoComplete="off"
                                        connectedLeft={
                                            <input
                                                type="color"
                                                value={formData.custom_border_color}
                                                onChange={(e) => {
                                                    handleFocus("custom_border_color")
                                                    handleColorChange(e, "custom_border_color")
                                                }
                                                }
                                            />
                                        }
                                    />
                                </div>
                            )}
                        </>)
                        }
                        <Checkbox
                            label="Show review count"
                            checked={formData.show_review_count}
                            onChange={(e) => {
                                handleFocus("show_review_count")
                                handleChange(e, "show_review_count")
                            }}
                        />
                        {formData.show_review_count && formData.badge_style === 'custom' && (
                            <div className='color_section'>
                                <TextField
                                    label="Review count text color"
                                    type="text"
                                    value={formData.review_count_color}
                                    onChange={(e) => {
                                        handleFocus("review_count_color")
                                        handleChange(e, "review_count_color")
                                    }}
                                    autoComplete="off"
                                    connectedLeft={
                                        <input
                                            type="color"
                                            value={formData.review_count_color}
                                            onChange={(e) => {
                                                handleFocus("review_count_color")
                                                handleColorChange(e, "review_count_color")
                                            }
                                            }
                                        />
                                    }
                                />
                            </div>
                        )}
                        <RangeSlider
                            output
                            label={<InlineStack style={{ "margin": "0px" }} >Corner radius
                                <Tooltip content={`Controls the background and border corners.`}>
                                    <Icon source={AlertCircleIcon} tone='base'></Icon>
                                </Tooltip></InlineStack>}
                            min={0}
                            max={40}
                            prefix="0px"
                            suffix="40px"
                            value={formData.badge_radius}
                            onChange={(e) => {
                                handleFocus("badge_radius")
                                handleChange(e, "badge_radius")
                            }}
                        />
                        {formData.badge_style === "custom" &&
                            <InlineGrid columns={2} gap={200}>
                                <div className='color_section'>
                                    <TextField
                                        label="Rating box text color"
                                        type="text"
                                        onChange={(e) => {
                                            handleFocus("rating_box_text_color")
                                            handleChange(e, "rating_box_text_color ")
                                        }
                                        }
                                        value={formData.rating_box_text_color}
                                        autoComplete="off"
                                        connectedLeft={
                                            <input
                                                type="color"
                                                value={formData.rating_box_text_color}
                                                onChange={(e) => {
                                                    handleFocus("rating_box_text_color")
                                                    handleColorChange(e, "rating_box_text_color")
                                                }}
                                            />
                                        }
                                    />
                                </div>
                                <div className='color_section'>
                                    <TextField
                                        label="Rating box background color"
                                        type="text"
                                        onChange={(e) => {
                                            handleFocus("rating_box_bg_color")
                                            handleChange(e, "rating_box_bg_color ")
                                        }
                                        }
                                        value={formData.rating_box_bg_color}
                                        autoComplete="off"
                                        connectedLeft={
                                            <input
                                                type="color"
                                                value={formData.rating_box_bg_color}
                                                onChange={(e) => {
                                                    handleFocus("rating_box_bg_color")
                                                    handleColorChange(e, "rating_box_bg_color")
                                                }}
                                            />
                                        }
                                    />
                                </div>
                            </InlineGrid>
                        }

                        <div className='color_section'>
                            <TextField
                                label="Star color"
                                type="text"
                                onChange={(e) => {
                                    handleFocus("badge_star_color")
                                    handleChange(e, "badge_star_color ")
                                }
                                }
                                value={formData.badge_star_color}
                                autoComplete="off"
                                connectedLeft={
                                    <input
                                        type="color"
                                        value={formData.badge_star_color}
                                        onChange={(e) => {
                                            handleFocus("badge_star_color")
                                            handleColorChange(e, "badge_star_color")
                                        }}
                                    />
                                }
                            />
                        </div>
                        <Checkbox
                            label={'Show "Collected by Vitals"'}
                            checked={formData.show_collected_by_vitals}
                            onChange={(e) => {
                                handleFocus("show_collected_by_vitals")
                                handleChange(e, "show_collected_by_vitals")
                            }}
                        />
                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Spacing</Text>
                        <Box background="bg-surface-secondary" padding="300" borderRadius="200">
                            <BlockStack gap="200">
                                <Text variant="headingSm" as="h6" fontWeight='regular'>Margin</Text>
                                <InlineGrid columns={{
                                    sm:"2",
                                }} gap={300}>
                                    <TextField
                                        type='number'
                                        label={`Left`}
                                        suffix="px"
                                        value={formData.badge_margin_left}
                                        onChange={(e) => {
                                            handleFocus("badge_margin_left")
                                            handleChange(e, "badge_margin_left")
                                        }}
                                    />
                                    <TextField
                                        type='number'
                                        suffix="px"
                                        label={`Right`}
                                        value={formData.badge_margin_right}
                                        onChange={(e) => {
                                            handleFocus("badge_margin_right")
                                            handleChange(e, "badge_margin_right")
                                        }}
                                    />
                                    <TextField
                                        type='number'
                                        suffix="px"
                                        label={`Top`}
                                        value={formData.badge_margin_top}
                                        onChange={(e) => {
                                            handleFocus("badge_margin_top")
                                            handleChange(e, "badge_margin_top")
                                        }}
                                    />
                                    <TextField
                                        suffix="px"
                                        type='number'
                                        label={`Bottom`}
                                        value={formData.badge_margin_bottom}
                                        onChange={(e) => {
                                            handleFocus("badge_margin_bottom")
                                            handleChange(e, "badge_margin_bottom")
                                        }}
                                    />
                                </InlineGrid>
                            </BlockStack>
                        </Box>
                    </BlockStack>
                </Card>
            </Layout.Section>
        </>
    );
}

export default AllreviewsBadge;