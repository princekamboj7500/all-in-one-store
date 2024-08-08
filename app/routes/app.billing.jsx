
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {

    const { admin, redirect } = await authenticate.admin(request);
    const queryParams = new URLSearchParams(request.url.split('?')[1]);
    const chargeId = queryParams.get('charge_id');

    const response = await admin.graphql(`query {
      currentAppInstallation {
        id
        metafields(first: 20) {
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
                namespace: "AllInOneStore",
                key: "status",
                type: "boolean",
                value: "true",
                ownerId: appId,
              },
            ],
          },
        },
      );
      const result = await createMetafield.json();
    
    } catch (err) {
      console.log(err, "errr");
    }
  
    return redirect("/app");
}


