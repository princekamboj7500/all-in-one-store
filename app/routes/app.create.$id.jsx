import React, { useCallback, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Card,
  Text,
  Badge,
  Page,
  Layout,
  Icon,
  Filters,
  Modal,
  Link,
  Frame,
  ContextualSaveBar,
  Button,
  Thumbnail,
  InlineStack,
  IndexTable,
  TextField,
  useIndexResourceState,
  useBreakpoints,
  EmptySearchResult,
  InlineGrid,
  BlockStack,
  Tooltip,
  Box,
  ButtonGroup,
  Checkbox,
  Toast,
  Spinner,
  IndexFilters,
  IndexFiltersMode,
  ChoiceList,
  useSetIndexFiltersMode,
} from "@shopify/polaris";
import db from "../db.server";
import { authenticate } from "../shopify.server";
import "./assets/style.css";
import { CheckIcon } from "@shopify/polaris-icons";
import DiscardModal from "./components/DiscardModal";
import Table from "./components/Table";
export const loader = async ({ request, params }) => {
  const productId = params.id;
  const { session, admin } = await authenticate.admin(request);
  console.log(session.shop, "lll");
  const storeName = session.shop.split(".")[0];
  const getReviews = await db.Reviews.findMany({
    where: {
      product_id: productId,
    },
  });

  return { productId };
};

export const SelectProducts = () => {
  <div>
    {/* Content for Tab 1 */}
    <h2>Content for Select Products</h2>
    <p>Details about the products in the offer.</p>
  </div>;
};
function BuilderCreate() {
  const [activeTab, setActiveTab] = useState(1);
  const handleTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <Page>
      <div className="contextual-frame">
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
              onAction: () => {},
            }}
            discardAction={{
              onAction: () => {},
            }}
          />
        </Frame>
      </div>

      <Box background="bg-surface" borderRadius="200" shadow="300">
        <InlineGrid columns={4}>
          <a
            onClick={() => handleTab(1)}
            className={`aios-upsell_nav-link aios-upsell-steps ${activeTab === 1 ? "aios-upsell-current-step" : ""}`}
          >
            <InlineStack blockAlign="center">
              <div className="aios-upsell_step_counter">
              <div className="aios-upsell_step_counter">01</div>
                </div>
              <BlockStack>
                <div className="aios-upsell_step_heading">Select Products</div>
                <div className="aios-upsell_step_sub_title">
                  Products in the offer
                </div>
              </BlockStack>
            </InlineStack>
          </a>
          <a
            onClick={() => handleTab(2)}
            className={`aios-upsell_nav-link aios-upsell-steps ${activeTab === 2 ? "aios-upsell-current-step" : ""}`}
          >
            <InlineStack blockAlign="center">
              <div className="aios-upsell_step_counter">02</div>
              <BlockStack>
                <div className="aios-upsell_step_heading">Discount </div>
                <div className="aios-upsell_step_sub_title">
                  Discount type & amount
                </div>
              </BlockStack>
            </InlineStack>
          </a>
          <a
            onClick={() => handleTab(3)}
            className={`aios-upsell_nav-link aios-upsell-steps ${activeTab === 3 ? "aios-upsell-current-step" : ""}`}
          >
            <InlineStack blockAlign="center">
              <div className="aios-upsell_step_counter">03</div>
              <BlockStack>
                <div className="aios-upsell_step_heading">Discount </div>
                <div className="aios-upsell_step_sub_title">
                  Discount type & amount
                </div>
              </BlockStack>
            </InlineStack>
          </a>
          <a
            onClick={() => handleTab(4)}
            className={`aios-upsell_nav-link aios-upsell-steps ${activeTab === 4 ? "aios-upsell-current-step" : ""}`}
          >
            <InlineStack blockAlign="center">
              <div className="aios-upsell_step_counter">04</div>
              <BlockStack>
                <div className="aios-upsell_step_heading">Discount </div>
                <div className="aios-upsell_step_sub_title">
                  Discount type & amount
                </div>
              </BlockStack>
            </InlineStack>
          </a>
        </InlineGrid>
      </Box>

      {activeTab === 1 && (
        <div>
          {/* Content for Tab 1 */}
          <h2>Content for Select Products</h2>
          <p>Details about the products in the offer.</p>
        </div>
        // <SelectProducts/>
      )}
      {activeTab === 2 && (
        <div>
          {/* Content for Tab 2 */}
          <h2>Content for Another Tab</h2>
          <p>Details about the another offer.</p>
        </div>
      )}
    </Page>
  );
}

export default BuilderCreate;
