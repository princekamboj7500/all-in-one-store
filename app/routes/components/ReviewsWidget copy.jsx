import { BlockStack, Button, ButtonGroup, Card, RadioButton,ContextualSaveBar, ChoiceList, Text, Page, InlineGrid, Listbox, Select, Tooltip, Checkbox, TextField, Tabs, Box, Layout, Toast, Grid, Frame, InlineStack, Link, Popover, ActionList, Icon } from '@shopify/polaris';
import { useState, useCallback } from "react";
import {
    ExternalIcon, XIcon, AlertCircleIcon
} from '@shopify/polaris-icons';

import { useNavigate, useLoaderData } from "@remix-run/react";
import "./../assets/style.css"; 
import DiscardModal from './DiscardModal';

import rounded from "./../assets//product_review/rounded.svg"
import pointed from "./../assets/product_review/pointed.svg"
import hearts from "./../assets/product_review/hearts.svg"
import gridimg from "./../assets/product_review/grid.png"
import listimg from "./../assets/product_review/list.png"

// export const loader = async ({ request }) => {
//     const { session, admin } = await authenticate.admin(request);
//     const response = await admin.graphql(`query {
//           currentAppInstallation {
//             id
//             metafields(first: 50) {
//               edges {
//                 node {
//                   namespace
//                   key
//                   value
//                 }
//               }
//             }
//           }
  
//         }`)
//     const result = await response.json();

//     const appId = result.data.currentAppInstallation.id;
//     const metafielData = result.data.currentAppInstallation.metafields.edges;

//     const defaultSettings = {
//         app_name: "ReviewsWidget",
//         app_status: false,
//         star_shape: "Rounded",
//         star_color: "#ffce07",
//         sort_order: "Photos First",
//         reviews_layout: "Grid_view",
//         show_rating_filterbar: 1,
//         show_reviewbox_whenzero: 1,
//         hide_review_mainwidget: 0,
//         desktop_min_reviews: 20,
//         desktop_max_reviews: 100,
//         mobile_min_reviews: 10,
//         mobile_max_reviews: 50,
//         card_clickable_area: "Open modal by clicking on images",
//         show_reviews_date: 1,
//         review_date_src: "Show real dates",
//         date_format: "yyyy-mm-dd",
//         reviewer_name_display: "Show full names",
//         verified_icon: 1,
//         verified_icon_color: "#00a332",
//         reviewer_name_color: "#222222",
//         reviewer_text_color: "#5e5e5e",
//         review_card_bg: "#ffffff",
//         review_card_shadow: "#eaeaea",
//         review_date: "737373",
//         columns_on_mobile: "2 columns",
//         avatar_bg: "#ffce07",
//         avatar_icon_color: "#222222",
//         storyreply_title_color: "#5e5e5e",
//         storyreply_text_color: "#5e5e5e",
//         storyreply_card_bg: "#f7f7f7",
//         form_allow_img: 1,
//         form_text_color: "#5e5e5e",
//         form_bg_color: "#ffffff",
//         form_btn_text: "#ffffff",
//         form_btn_bg: "#000000"
//     };

//     const appName =
//         metafielData.length > 0
//             ? metafielData.filter((item) => item.node.namespace === "ReviewsWidget")
//             : [];

//     let appSettings =
//         appName.length > 0 ? appName[0].node.value : defaultSettings;

//     let datas;
//     if (typeof appSettings === 'string') {
//         try {
//             datas = JSON.parse(appSettings);
//         } catch (error) {
//             console.error('Error parsing appSettings:', error);
//             datas = {};
//         }
//     } else {
//         datas = appSettings;
//     }
//     return { datas };
// };


function ReviewsWidget(props) {
    const datas = {
        app_name: "ReviewsWidget",
        star_shape: "Rounded",
        star_color: "#ffce07",
        sort_order: "Photos First",
        reviews_layout: "Grid_view",
        show_rating_filterbar: 1,
        show_reviewbox_whenzero: 1,
        hide_review_mainwidget: 0,
        desktop_min_reviews: 20,
        desktop_max_reviews: 100,
        mobile_min_reviews: 10,
        mobile_max_reviews: 50,
        card_clickable_area: "Open modal by clicking on images",
        show_reviews_date: 1,
        review_date_src: "Show real dates",
        date_format: "yyyy-mm-dd",
        reviewer_name_display: "Show full names",
        verified_icon: 1,
        verified_icon_color: "#00a332",
        reviewer_name_color: "#222222",
        reviewer_text_color: "#5e5e5e",
        review_card_bg: "#ffffff",
        review_card_shadow: "#eaeaea",
        review_date: "737373",
        columns_on_mobile: "2 columns",
        avatar_bg: "#ffce07",
        avatar_icon_color: "#222222",
        storyreply_title_color: "#5e5e5e",
        storyreply_text_color: "#5e5e5e",
        storyreply_card_bg: "#f7f7f7",
        form_allow_img: 1,
        form_text_color: "#5e5e5e",
        form_bg_color: "#ffffff",
        form_btn_text: "#ffffff",
        form_btn_bg: "#000000"
    }
    // const { datas } = useLoaderData();
    const [innerFormData, setInnerFormData] = useState(datas);
    const [toastactive, setToastActive] = useState(false);
    const [toasterror, setToastError] = useState('');
    const [toastMsgData, setToastMsgData] = useState("");
    const [isbuttonloading, setIsButtonLoading] = useState(false);
    const [activeField, setActiveField] = useState(false)
    const [lastSavedData, setLastSavedData] = useState(datas);
    const [activemodal, setActivemodal] = useState(false);
    const toggleModal = useCallback(() => setActivemodal((activemodal) => !activemodal), []);

    const toggleActiveToast = useCallback(
        () => setToastActive((prevActive) => !prevActive),
        [],
    );
    const toastMarkupContent = toastactive ? (
        <Frame>
            <Toast content={toastMsgData} onDismiss={toggleActiveToast} error={toasterror} />
        </Frame>
    ) : null;

    const handleSave = async () => {
        setIsButtonLoading(true);
        // const dataToSend = {
        //     actionType: "save",
        //     data: innerFormData
        // };
        // const response = await fetch("/api/save", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(dataToSend),
        // });
        // const data = await response.json();

        // if (data.success) {
        //     setToastActive(true);
        //     setActiveField(false);
        //     setIsButtonLoading(false)
        //     setToastMsgData("Settings Updated");
        //     setLastSavedData(innerFormData); 
        // } else {
        //     setIsButtonLoading(false)
        //     setToastActive(true);
        //     setActiveField(false);
        //     setToastError(true);
        //     setToastMsgData("There is some error while update");
        // }
    };

    const handleDiscard = () => {
        setInnerFormData(lastSavedData)
        setActiveField(false);
        toggleModal();
    };

    const handleChange = (value, property) => {
     
        setInnerFormData((innerFormData) => ({
            ...innerFormData,
            [property]: value,
        }));
    };

    const handleColorChange = useCallback((e, fieldName) => {
        setInnerFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: e.target.value,
        }));
    }, []);

    const handleFocus = (fieldName) => {
        setActiveField(fieldName);
    };


    const star_shape_options = [
        { id: 'Rounded', label: 'Rounded corners', imgSrc: rounded },
        { id: 'Pointed', label: 'Pointed corners', imgSrc: pointed },
        { id: 'Hearts', label: 'Hearts', imgSrc: hearts },
    ];
    const sort_order_options = [
        { label: 'Select an option', value: 'Select an option', disabled: true },
        { label: 'Newest First', value: 'Newest First' },
        { label: 'Photos First', value: 'Photos First' },
        { label: 'Photos & Text First', value: ' Photos & Text First' },
        { label: 'Verified Buyers First', value: 'Verified Buyers First' },
    ];  
    const review_layout_options = [
        { id: 'Grid_view', label: 'Grid View', imgSrc: gridimg },
        { id: 'List_view', label: 'List View', imgSrc: listimg }
    ];
    const card_clickable_options = [
        { label: 'Select an option', value: 'Select an option', disabled: true },
        { label: 'Open modal by clicking on images', value: 'Open modal by clicking on images' },   
        { label: 'Open modal by clicking anywhere on the review card', value: 'Open modal by clicking anywhere on the review card' },
    ]
    const review_date_options =[
        { label: 'Select an option', value: 'Select an option', disabled: true },
        { label: 'Show real dates', value: 'Show real dates' },
        { label: 'Show recent dates', value: 'Show recent dates' }
    ]
    const date_format_options=[
        { label: 'Select an option', value: 'Select an option', disabled: true },
        { label: 'yyyy-mm-dd', value: 'yyyy-mm-dd' },
        { label: 'mm-dd-yyyy', value: 'mm-dd-yyyy' },
        { label: 'mm-dd-yy', value: 'mm-dd-yy' },
        { label: 'dd-mm-yyyy', value: 'dd-mm-yyyy' },
    ]
    const reviewer_name_options=[
        { label: 'Select an option', value: 'Select an option', disabled: true },
        { label: 'Show full names', value: 'Show full names' },
        { label: 'Obfuscate middle letters (John Doe becomes J**n)', value: 'Obfuscate middle letters' },
        { label: 'Show first name (John Doe becomes John D.)', value: 'Show first name' },
        { label: 'Show initials only (John Doe becomes J.D.)', value: 'Show initials only' },
    ]
    const columns_on_mobile_options=[
        { label: 'Select an option', value: 'Select an option', disabled: true },
        { label: '1 column', value: '1 column' },
        { label: '2 columns', value: '2 columns' },
    ]

    const FormFields = (
        <>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>General</Text>
                        <div className='img-choicelist star-shape'>
                            <ChoiceList
                                title="Star Shape"
                                choices={star_shape_options.map(option => ({
                                    label: (
                                        <span className={innerFormData.star_shape == option.id ? "labelchecked labelmain" : "labelmain"}>
                                            {option.label}
                                            <img src={option.imgSrc} alt={option.label} />
                                        </span>
                                    ),
                                    value: option.id,
                                }))}
                                selected={innerFormData.star_shape}
                                onChange={(selected) => {
                                    handleFocus("star_shape");
                                    handleChange(selected, "star_shape")
                                }}
                            />
                        </div>
                        <div className='color_section'>
                            <TextField
                                label={<InlineStack  style={{"margin":"0px"}} gap={300}>Star color
                                    <Tooltip content={`This controls the colors of the stars in every widget except the Reviews Carousel.`}>
                                        <Icon source={AlertCircleIcon} tone='base'></Icon>
                                    </Tooltip></InlineStack>}
                                type="text"
                                onChange={(e) => {
                                    handleFocus("star_color")
                                    handleChange(e, "star_color ")
                                }
                                }
                                value={innerFormData.star_color}
                                autoComplete="off"
                                connectedLeft={
                                    <input
                                        type="color"
                                        value={innerFormData.star_color}
                                        onChange={(e) => {
                                            handleFocus("star_color")
                                            handleColorChange(e, "star_color")
                                        }}
                                    />
                                }
                            />
                        </div>
                        <Select
                            label="Sort order"
                            options={sort_order_options}
                            onChange={(e) => {
                                handleFocus("sort_order")
                                handleChange(e, "sort_order")
                            }}
                            value={innerFormData.sort_order}
                        />
                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Product page layout</Text>
                        <div className='img-choicelist'>
                            <ChoiceList
                                title="Reviews layout"
                                choices={review_layout_options.map(option => ({
                                    label: (
                                        <span className={innerFormData.reviews_layout == option.id ? "labelchecked labelmain" : "labelmain"}>
                                            {option.label}
                                            <img src={option.imgSrc} alt={option.label} />
                                        </span>
                                    ),
                                    value: option.id,
                                }))}
                                selected={innerFormData.reviews_layout}
                                onChange={(selected) => {
                                    handleFocus("reviews_layout");
                                    handleChange(selected, "reviews_layout")
                                }}
                                helpText="You can change the design settings for this layout in the Layout design settings section below."
                            />
                        </div>
                        
                        <Checkbox
                            label="Show rating filter bars"
                            checked={innerFormData.show_rating_filterbar}
                            onChange={(e) => {
                                handleFocus("show_rating_filterbar")
                                handleChange(e, "show_rating_filterbar")
                            }}
                            helpText="Display a breakdown of all reviews using progress bars at the top of the reviews list, allowing easy filtering."
                        />
                        <Checkbox
                            label="Show review box for products with zero reviews"
                            checked={innerFormData.show_reviewbox_whenzero}
                            onChange={(e) => {
                                handleFocus("show_reviewbox_whenzero")
                                handleChange(e, "show_reviewbox_whenzero")
                            }}
                        />
                        <Checkbox
                            label="Hide the Product Reviews Main Widget on the product page"
                            checked={innerFormData.hide_review_mainwidget}
                            onChange={(e) => {
                                handleFocus("hide_review_mainwidget")
                                handleChange(e, "hide_review_mainwidget")
                            }}
                            helpText="Check this option if you want to use other Product Reviews widgets (like Carousel) while hiding the Main Widget from the product page. However, this won't hide the widget if placed via Shopify or Vitals Editor."
                        />
                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Number of reviews on 2roduct page</Text>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <BlockStack gap="200">
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>Desktop</Text>
                                <InlineGrid columns={2} gap={200}>
                                    <TextField
                                        type='number'
                                        label={`Number of reviews before showing more`}
                                        value={innerFormData.desktop_min_reviews}
                                        onChange={(e) => {
                                            handleFocus("desktop_min_reviews")
                                            handleChange(e, "desktop_min_reviews")
                                        }
                                        }
                                    />
                                    <TextField
                                        type='number'
                                        label={`Maximum number of reviews`}
                                        value={innerFormData.desktop_max_reviews}
                                        onChange={(e) => {
                                            handleFocus("desktop_max_reviews")
                                            handleChange(e, "desktop_max_reviews")
                                        }
                                        }
                                    />
                                </InlineGrid>
                            </BlockStack>
                        </Box>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <BlockStack gap="200">
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>Mobile</Text>
                                <InlineGrid columns={2} gap={200}>
                                    <TextField
                                        type='number'
                                        label={`Number of reviews before showing more`}
                                        value={innerFormData.mobile_min_reviews}
                                        onChange={(e) => {
                                            handleFocus("mobile_min_reviews")
                                            handleChange(e, "mobile_min_reviews")
                                        }
                                        }
                                    />
                                    <TextField
                                        type='number'
                                        label={`Maximum number of reviews`}
                                        value={innerFormData.mobile_max_reviews}
                                        onChange={(e) => {
                                            handleFocus("mobile_max_reviews")
                                            handleChange(e, "mobile_max_reviews")
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
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Reviews information</Text>
                        <Select
                            label={<InlineStack gap="200">Card clickable area
                                <Tooltip content={`If the entire review card is clickable, both text-only and reviews with images will appear in the modal. If only the image is clickable, the modal will display solely the reviews with images.`}>
                                    <Icon source={AlertCircleIcon} tone='base'></Icon></Tooltip></InlineStack>}
                            options={card_clickable_options}
                            onChange={(e) => {
                                handleFocus("card_clickable_area")
                                handleChange(e, "card_clickable_area")
                            }}
                            value={innerFormData.card_clickable_area}
                        />
                        <Checkbox
                            label="Show review dates"
                            checked={innerFormData.show_reviews_date}
                            onChange={(e) => {
                                handleFocus("show_reviews_date")
                                handleChange(e, "show_reviews_date")
                            }}
                        />
                        <Select
                            label="Review date source"
                            options={review_date_options}
                            onChange={(e) => {
                                handleFocus("review_date_src")
                                handleChange(e, "review_date_src")
                            }}
                            value={innerFormData.review_date_src}
                        />
                        <Select
                            label="Date format"
                            options={date_format_options}
                            onChange={(e) => {
                                handleFocus("date_format")
                                handleChange(e, "date_format")
                            }}
                            value={innerFormData.date_format}
                        />
                        <Select
                            label="Reviewer name display method"
                            options={reviewer_name_options}
                            onChange={(e) => {
                                handleFocus("reviewer_name_display")
                                handleChange(e, "reviewer_name_display")
                            }}
                            value={innerFormData.reviewer_name_display}
                        />
                        <hr style={{
                            "height": "1px", "margin": "6px", "border": "none", "background": "#d9d9d9"
                        }} />
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Verified purchase icon</Text>
                        <Checkbox
                            label={<InlineStack gap="200">Show "Verified purchase” icon
                                <Tooltip
                                    content={`If enabled, it will show a Verified icon after the reviewer's name for those reviews that are deemed to be made by verified buyers. When customers leave feedback on your products and we are able to match their data to your orders, we tag the reviews as verified automatically. You can also mark any review as verified.`}>
                                    <Icon source={AlertCircleIcon} tone='base'></Icon></Tooltip></InlineStack>}
                            checked={innerFormData.verified_icon}
                            onChange={(e) => {
                                handleFocus("verified_icon")
                                handleChange(e, "verified_icon")
                            }}
                        />
                        <div className='color_section'>
                            <TextField
                                label="Verified icon color"
                                type="text"
                                onChange={(e) =>{
                                    handleFocus("verified_icon_color")
                                    handleChange(e, "verified_icon_color ")
                                } }
                                value={innerFormData.verified_icon_color}
                                autoComplete="off"
                                connectedLeft={
                                    <input
                                        type="color"
                                        value={innerFormData.verified_icon_color}
                                        onChange={(e) =>{
                                            handleFocus("verified_icon_color")
                                            handleColorChange(e, "verified_icon_color")
                                        }
                                        }
                                    />
                                }
                            />
                        </div>

                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Layout design settings</Text>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <BlockStack gap="200">
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>Grid</Text>
                                <InlineGrid columns={2} gap={200}>
                                    <div className='color_section'>
                                        <TextField
                                            label="Reviewer name"
                                            type="text"
                                            value={innerFormData.reviewer_name_color}
                                            onChange={(e) => {
                                                handleFocus("reviewer_name_color")
                                                handleChange(e, "reviewer_name_color")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={innerFormData.reviewer_name_color}
                                                    onChange={(e) => {
                                                        handleFocus("reviewer_name_color")
                                                        handleColorChange(e, "reviewer_name_color")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                    <div className='color_section'>
                                        <TextField
                                            label="Review text"
                                            type="text"
                                            value={innerFormData.reviewer_text_color}
                                            onChange={(e) => {
                                                handleFocus("reviewer_text_color")
                                                handleChange(e, "reviewer_text_color")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={innerFormData.reviewer_text_color}
                                                    onChange={(e) => {
                                                        handleFocus("reviewer_text_color")
                                                        handleColorChange(e, "reviewer_text_color")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                    <div className='color_section'>
                                        <TextField
                                            label="Review card background"
                                            type="text"
                                            value={innerFormData.border_colors}
                                            onChange={(e) => {
                                                handleFocus("review_card_bg")
                                                handleChange(e, "review_card_bg")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={innerFormData.review_card_bg}
                                                    onChange={(e) => {
                                                        handleFocus("review_card_bg")
                                                        handleColorChange(e, "review_card_bg")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                    <div className='color_section'>
                                        <TextField
                                            label="Review card shadow"
                                            type="text"
                                            value={innerFormData.review_card_shadow}
                                            onChange={(e) => {
                                                handleFocus("review_card_shadow")
                                                handleChange(e, "review_card_shadow")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={innerFormData.review_card_shadow}
                                                    onChange={(e) => {
                                                        handleFocus("review_card_shadow")
                                                        handleColorChange(e, "review_card_shadow")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                    <div className='color_section'>
                                        <TextField
                                            label="Review date"
                                            type="text"
                                            value={innerFormData.review_date}
                                            onChange={(e) => {
                                                handleFocus("review_date")
                                                handleChange(e, "review_date")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={innerFormData.review_date}
                                                    onChange={(e) => {
                                                        handleFocus("review_date")
                                                        handleColorChange(e, "review_date")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                </InlineGrid>
                                <Select
                                    label="Number of columns on mobile"
                                    options={columns_on_mobile_options}
                                    onChange={(e) => {
                                        handleFocus("columns_on_mobile")
                                        handleChange(e, "columns_on_mobile")
                                    }}
                                    value={innerFormData.columns_on_mobile}
                                />

                            </BlockStack>
                        </Box>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <BlockStack gap="200">
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>List</Text>
                                <InlineGrid columns={2} gap={200}>
                                    <div className='color_section'>
                                        <TextField
                                            label="Avatar background"
                                            type="text"
                                            value={innerFormData.avatar_bg}
                                            onChange={(e) => {
                                                handleFocus("avatar_bg")
                                                handleChange(e, "avatar_bg")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={innerFormData.avatar_bg}
                                                    onChange={(e) => {
                                                        handleFocus("avatar_bg")
                                                        handleColorChange(e, "avatar_bg")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                    <div className='color_section'>
                                        <TextField
                                            label="Avatar icon"
                                            type="text"
                                            value={innerFormData.avatar_icon_color}
                                            onChange={(e) => {
                                                handleFocus("avatar_icon_color")
                                                handleChange(e, "avatar_icon_color")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={innerFormData.avatar_icon_color}
                                                    onChange={(e) => {
                                                        handleFocus("avatar_icon_color")
                                                        handleColorChange(e, "avatar_icon_color")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                </InlineGrid>
                            </BlockStack>
                        </Box>
                        <Box background="bg-surface-secondary" padding="200" borderRadius="200">
                            <BlockStack gap="200">
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>List</Text>
                                <InlineGrid columns={2} gap={200}>
                                    <div className='color_section'>
                                        <TextField
                                            label="Store reply title"
                                            type="text"
                                            value={innerFormData.storyreply_title_color}
                                            onChange={(e) => {
                                                handleFocus("storyreply_title_color")
                                                handleChange(e, "storyreply_title_color")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={innerFormData.storyreply_title_color}
                                                    onChange={(e) => {
                                                        handleFocus("storyreply_title_color")
                                                        handleColorChange(e, "storyreply_title_color")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                    <div className='color_section'>
                                        <TextField
                                            label="Store reply text"
                                            type="text"
                                            value={innerFormData.storyreply_text_color}
                                            onChange={(e) => {
                                                handleFocus("storyreply_text_color")
                                                handleChange(e, "storyreply_text_color")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={innerFormData.storyreply_text_color}
                                                    onChange={(e) => {
                                                        handleFocus("storyreply_text_color")
                                                        handleColorChange(e, "storyreply_text_color")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                    <div className='color_section'>
                                        <TextField
                                            label="Store reply card background"
                                            type="text"
                                            value={innerFormData.storyreply_card_bg}
                                            onChange={(e) => {
                                                handleFocus("storyreply_card_bg")
                                                handleChange(e, "storyreply_card_bg")
                                            }}
                                            autoComplete="off"
                                            connectedLeft={
                                                <input
                                                    type="color"
                                                    value={innerFormData.storyreply_card_bg}
                                                    onChange={(e) => {
                                                        handleFocus("storyreply_card_bg")
                                                        handleColorChange(e, "storyreply_card_bg")
                                                    }
                                                    }
                                                />
                                            }
                                        />
                                    </div>
                                </InlineGrid>
                            </BlockStack>
                        </Box>
                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Write a review form</Text>
                        <Checkbox
                            label="Allow customers to upload a photo"
                            checked={innerFormData.form_allow_img}
                            onChange={(e) => {
                                handleFocus("form_allow_img")
                                handleChange(e, "form_allow_img")
                            }}
                        />
                        <InlineGrid columns={2} gap={200}>
                            <div className='color_section'>
                                <TextField
                                    label="Form text"
                                    type="text"
                                    value={innerFormData.form_text_color}
                                    onChange={(e) => {
                                        handleFocus("form_text_color")
                                        handleChange(e, "form_text_color")
                                    }}
                                    autoComplete="off"
                                    connectedLeft={
                                        <input
                                            type="color"
                                            value={innerFormData.form_text_color}
                                            onChange={(e) => {
                                                handleFocus("form_text_color")
                                                handleColorChange(e, "form_text_color")
                                            }
                                            }
                                        />
                                    }
                                />
                            </div>
                            <div className='color_section'>
                                <TextField
                                    label="Form background"
                                    type="text"
                                    value={innerFormData.form_bg_color}
                                    onChange={(e) => {
                                        handleFocus("form_bg_color")
                                        handleChange(e, "form_bg_color")
                                    }}
                                    autoComplete="off"
                                    connectedLeft={
                                        <input
                                            type="color"
                                            value={innerFormData.form_bg_color}
                                            onChange={(e) => {
                                                handleFocus("form_bg_color")
                                                handleColorChange(e, "form_bg_color")
                                            }
                                            }
                                        />
                                    }
                                />
                            </div>
                            <div className='color_section'>
                                <TextField
                                    label={<InlineStack gap={200}>Button text
                                        <Tooltip content={`Controls the color of 2 buttons:
                                                            - Write review button
                                                            - Submit review button
                                                            `}>
                                            <Icon source={AlertCircleIcon} tone='base'></Icon></Tooltip></InlineStack>}
                                    type="text"
                                    value={innerFormData.form_btn_text}
                                    onChange={(e) => {
                                        handleFocus("form_btn_text")
                                        handleChange(e, "form_btn_text")
                                    }}
                                    autoComplete="off"
                                    connectedLeft={
                                        <input
                                            type="color"
                                            value={innerFormData.form_btn_text}
                                            onChange={(e) => {
                                                handleFocus("form_btn_text")
                                                handleColorChange(e, "form_btn_text")
                                            }
                                            }
                                        />
                                    }
                                />
                            </div>
                            <div className='color_section'>
                                <TextField
                                    label={<InlineStack gap={200} >Button background
                                        <Tooltip content={`Controls the color of 2 buttons:
                                                            - Write review button
                                                            - Submit review button
                                                            `}>
                                            <Icon source={AlertCircleIcon} tone='base'></Icon></Tooltip></InlineStack>}
                                    type="text"
                                    value={innerFormData.form_btn_bg}
                                    onChange={(e) => {
                                        handleFocus("form_btn_bg")
                                        handleChange(e, "form_btn_bg")
                                    }}
                                    autoComplete="off"
                                    connectedLeft={
                                        <input
                                            type="color"
                                            value={innerFormData.form_btn_bg}
                                            onChange={(e) => {
                                                handleFocus("form_btn_bg")
                                                handleColorChange(e, "form_btn_bg")
                                            }
                                            }
                                        />
                                    }
                                />
                            </div>
                        </InlineGrid>
                    </BlockStack>
                </Card>
            </Layout.Section>
            <Layout.Section>
                <Card roundedAbove="sm">
                    <BlockStack gap="400">
                        <Text variant="headingSm" as="h6" fontWeight='semibold'>Position</Text>
                        <Box background="bg-surface-secondary" padding="300" borderRadius="200">
                            <BlockStack gap={200}>
                                <Text variant="headingSm" as="h6" fontWeight='semibold'>Place or move this app using Shopify Editor</Text>
                                <Text variant="headingSm" as="p" fontWeight='regular' tone="subdued" >Choose where to show the app using the Theme Editor. Click 'Add Section' or 'Add Block', then find the Vitals app you need.</Text>
                                <InlineStack align="start">
                                    <ButtonGroup>
                                        <Button onClick={() => { }} accessibilityLabel="Go to editor"> Go to editor</Button>
                                        <Button variant="plain">Learn more</Button>
                                    </ButtonGroup>
                                </InlineStack>
                            </BlockStack>
                        </Box>
                    </BlockStack>
                </Card>
            </Layout.Section>
        </>
    );

    return (
        <div className=''>
               {FormFields}
               {activeField && (
                    <div className='contextual-frame'>
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
                                    loading: isbuttonloading,
                                    disabled: false,
                                }}
                                discardAction={{
                                    onAction: toggleModal,
                                }}
                            />
                        </Frame>
                    </div>
            )}
            {toastMarkupContent}
            <DiscardModal toggleModal={toggleModal} handleDiscard={handleDiscard} activemodal={activemodal}/>
        </div>
    );
}

export default ReviewsWidget;
