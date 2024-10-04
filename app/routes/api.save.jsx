import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const action = async ({ request }) => {
  try {
    const { session, admin } = await authenticate.admin(request);

    const reqData = await request.json();
    
    const url = new URL(request.url);
    const typeParam = url.searchParams.get("type");


    if (reqData && reqData.actionType === "save") {

    

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
      
      }
      return json({
        success: true,
        message: "Settings Updated",
      });
    } else if(reqData && typeParam){
      try{
        if(reqData.actionType === "Activate"){
          console.log("heloo___")
          const product = reqData.themedata;
          console.log(product,"product__")
          const id =reqData.themeId;
          console.log(id,"id___")
            const updateAsset = new admin.rest.resources.Asset({session: session});
      updateAsset.theme_id =id;
    updateAsset.key = 'templates/product.json';
    updateAsset.value = product;
    const test = await updateAsset.save({
      update: true,
    });
    console.log(test)
        }
       
      }catch(Err){
        console.log("there is error",Err);
      }
     

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
    else {
      console.log("heloo");
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
