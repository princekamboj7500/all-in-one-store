import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { authenticate } from "../shopify.server";
export const links = () => [{ rel: "stylesheet", href: polarisStyles }];
export const loader = async ({ request }) => {

  const { admin, redirect } = await authenticate.admin(request);
  const queryParams = new URLSearchParams(request.url.split('?')[1]);
  const chargeId = queryParams.get('charge_id');

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
  const appId = result.data.currentAppInstallation.id;
  console.log(appId, "appId______")
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
    const test = await createMetafield.json();
    console.log(test.data.metafieldsSet.metafields, "craeted successfulyy FROM BILLING");
  } catch (err) {
    console.log(err, "errr");
  }

  return redirect("/app");
}
