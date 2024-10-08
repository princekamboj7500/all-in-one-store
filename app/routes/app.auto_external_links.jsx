import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Text,
  Page,
  List,
  Frame,
  Toast,
  Grid,
  InlineStack,
  Link,
  Popover,
  ActionList,
  Icon,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLoaderData } from "@remix-run/react";
import DeactivatePopover from "./components/DeactivatePopover";
import { authenticate } from "../shopify.server";
import { ExternalIcon, XIcon } from "@shopify/polaris-icons";
import { useTranslation } from "react-i18next";
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
  
        }`);
  const result = await response.json();

  const appId = result.data.currentAppInstallation.id;
  const metafielData = result.data.currentAppInstallation.metafields.edges;
  const defaultSettings = {
    app_name: "AutoExternalLinks",
    app_status: false,
  };

  const appName =
    metafielData.length > 0
      ? metafielData.filter(
          (item) => item.node.namespace === "AutoExternalLinks",
        )
      : [];

  let appSettings =
    appName.length > 0 ? appName[0].node.value : defaultSettings;
  
  let data;
  if (typeof appSettings === "string") {
    try {
      data = JSON.parse(appSettings);
    } catch (error) {
      console.error("Error parsing appSettings:", error);
      data = {};
    }
  } else {
    data = appSettings;
  }

  return { data };
};

function Auto_External_Links(props) {
  const navigate = useNavigate();
  const { data } = useLoaderData();
  let { t } = useTranslation();
  const [formData, setFormData] = useState(data);
  const [status, setStatus] = useState(data.app_status);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const [msgData, setMsgData] = useState("");
  const [buttonloading, setButtonLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
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
      //   setActiveField(false);
    }
  };

  const toggleActive = useCallback(
    () => setActive((prevActive) => !prevActive),
    [],
  );

  const toastMarkup = active ? (
    <Frame>
      <Toast content={msgData} onDismiss={toggleActive} error={error} />
    </Frame>
  ) : null;
  useEffect(() => {
    shopify.loading(false);
  }, []);
  const handleClick = () => {
    navigate("/app");
    shopify.loading(true);
  };

  const SettingsDataTab = () => {
    return (
      <div className="Cart_notice_page_SettingsDataTab_container">
        <BlockStack gap="400">
       
        </BlockStack>
      </div>
    );
  };

  const appName =t('Autolinks.appTitle');

  return (
    <div className="Auto_External_Links">
      <Page
        backAction={{ content: "Back", onAction: handleClick }}
        title={t('Autolinks.appTitle')}
        subtitle={t('Autolinks.appdes')}
        primaryAction={
          status ? (
            <DeactivatePopover
              type={appName}
              handleToggleStatus={handleToggleStatus}
              buttonLoading={buttonloading}
            />
          ) : (
            {
              content:t('defaultSettings.activateBtn'),
              tone: "success",
              onAction: handleToggleStatus,
              loading: buttonloading,
            }
          )
        }
      >
        <div className="intant_search">
          <div className="intant_search_TabsField">
            <BlockStack gap="200">
              <SettingsDataTab />
            </BlockStack>
          </div>
        </div>
        {toastMarkup}
      </Page>
    </div>
  );
}

export default Auto_External_Links;
