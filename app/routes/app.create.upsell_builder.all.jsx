import {
    BlockStack,
    Button,
    Banner,
    ButtonGroup,
    ResourceItem,
    ResourceList,
    Avatar,
    Spinner,
    Badge,
    DatePicker,
    Card,
    IndexTable,
    Text,
    ChoiceList,
    useIndexResourceState,
    OptionList,
    Page,
    TextField,
    useBreakpoints,
    Scrollable,
    Select,
    ContextualSaveBar,
    InlineGrid,
    Listbox,
    Tabs,
    Box,
    Filters,
    Layout,
    Toast,
    Grid,
    Frame,
    InlineStack,
    Link,
    Popover,
    ActionList,
    Icon,
    Thumbnail,
  } from "@shopify/polaris";
  import "./assets/style.css";
  import { useState, useCallback, useEffect, useRef } from "react";
  import { product_bundle, bogo } from "./assets";

  import { useNavigate, useLoaderData, useLocation } from "@remix-run/react";
  function UpsellBuilderCreate(){
    const navigate = useNavigate();
    useEffect(() => {
        shopify.loading(false);
      });
    const handleClick = () => {
        shopify.loading(true);
        navigate("/app/upsell_builder");
      };
      const handleLinkClick = (id) => {
        console.log("heloo")
        shopify.loading(true);
        navigate(`/app/create/${id}`);
       

      };
  return(
    <Page
    backAction={{ content: "Back", onAction: handleClick }}
    title="Choose your offer type">
 <Grid>
 <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
 <Card>
     
              <Box >
            
                  <InlineStack wrap="false" align ="space-between" blockAlign="center" alignItems="center">
                  <BlockStack gap="200">
                  <Text variant="headingSm" as="h6">
                    Buy X, Get Y
                  </Text>
                  <Text variant="bodyLg" as="p" >
                  Discount a product when another product is bought
                  </Text>
                  </BlockStack>
                  <BlockStack gap="200">
<Button onClick={()=>handleLinkClick('bogo')}>Create</Button>
                    </BlockStack>
                  </InlineStack>
                </Box>
                <Link url="/app/create/bogo" onClick={handleLinkClick}>
                  <Box padding="400">
                    <img src={bogo} className="upsell_bundle_images" />
                  </Box>
                </Link>
        
     
      </Card>
  </Grid.Cell>
  <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
  <Card>
    
              <Box background="bg-surface">
               
                  <InlineStack wrap="false" align ="space-between" blockAlign="center" alignItems="center">
                  <BlockStack gap="200">
                  <Text variant="headingSm" as="h6">
                  Product Bundle
                  </Text>
                  <Text variant="bodyLg" as="p" >
                  Bundle products frequently bought together
                  </Text>
                  </BlockStack>
                  <BlockStack gap="200">
            <Button onClick={()=>handleLinkClick('productbundle')} >Create</Button>
                    </BlockStack>
                  </InlineStack>
                </Box>
                <Link url="/app/create/productbundle"  onClick={handleLinkClick}>
                  <Box padding="400">
                    <img src={product_bundle} className="upsell_bundle_images" />
                  </Box>
                </Link>
          
          </Card> 
    
    </Grid.Cell>
  </Grid>
    
        
    </Page>
  )
  }

  export default UpsellBuilderCreate