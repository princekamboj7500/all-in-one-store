import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

import db from "../db.server";

export const action = async ({ request }) => {
  try {
    const { session, admin } = await authenticate.admin(request);

    const reqData = await request.json();
    

    if (reqData && reqData.actionType === "deactivate") {
    
      const response = await admin.graphql(`query {
                currentAppInstallation {
                  id
                  metafields(first: 3) {
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
      const dataId = result.data.currentAppInstallation.metafields.edges;

      return json({
        success: true,
        message: "Deactivated Successfully",
      });
    } else if (reqData && reqData.actionType === "save") {

   
      const response = await admin.graphql(`query {
            currentAppInstallation {
              id
              metafields(first: 6) {
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
      const dataId = result.data.currentAppInstallation.metafields.edges;

      const appId = result.data.currentAppInstallation.id;

      try {
        const createMetafield = await admin.graphql(
          `#graphql
    mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafieldsSetInput) {
        metafields {
          id
          namespace
          key
        }
        userErrors {
          field
          message
        }
      }
    }`,
          {
            variables: {
              metafieldsSetInput: [
                {
                  namespace: reqData.data.app_name,
                  key: "items",
                  type: "json",
                  value: JSON.stringify(reqData.data),
                  ownerId: appId,
                },
              ],
            },
          },
        );
        const test = await createMetafield.json();
      } catch (err) {
        console.log(err);
      }
      return json({
        success: true,
        message: "Settings Updated",
      });
    } else {
      const response = await admin.graphql(`query {
          currentAppInstallation {
            id
            metafields(first: 6) {
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
   
      const dataId = result.data.currentAppInstallation.metafields.edges;
   
      const appId = result.data.currentAppInstallation.id;
    

      try {
        const createMetafield = await admin.graphql(
          `#graphql
          mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafieldsSetInput) {
              metafields {
                id
                namespace
                key
              }
              userErrors {
                field
                message
              }
            }
          }`,
          {
            variables: {
              metafieldsSetInput: [
                {
                  namespace: reqData.data.app_name,
                  key: "items",
                  type: "json",
                  value: JSON.stringify(reqData.data),
                  ownerId: appId,
                },
              ],
            },
          },
        );
        const test = await createMetafield.json();

      } catch (err) {
        console.log(err);
      }

      return json({
        success: true,
        message: "Activated app Successfully",
      });
    }
  } catch (err) {
    return json({ success: false, message: err.message });
  }
};
