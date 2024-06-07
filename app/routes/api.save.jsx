import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

import db from "../db.server";



export const action = async ({ request }) => {
    try{
        const { session,admin } = await authenticate.admin(request);
    
        const reqData = await request.json();
        const stores = await db.stores.findUnique({
          where: {
            store: session.shop
          },
           select: {
            id: true,
          }   
        });   
       

        if (reqData && reqData.actionType === "deactivate") {
              const newData = {
                isActive: reqData.data.app_status ,
               }
               const updatedData = await db.AppSettings.update({
                 where: { store_id: parseInt(stores.id), app_name:reqData.data.app_name },
                 data:newData ,
               });
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
      
              }`)
              const result = await response.json();
         
            const appId = result.data.currentAppInstallation.id;
            const dataId = result.data.currentAppInstallation.metafields.edges;
        
               return json({
                success: true,
                message: "Deactivated Successfully",
               
              });
        }else if(reqData && reqData.actionType === "save"){
          console.log("Hello-----------");
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
  
          }`)
          const result = await response.json();
         const dataId = result.data.currentAppInstallation.metafields.edges;
        
         const appId = result.data.currentAppInstallation.id;
       
  try{
    const createMetafield = await admin.graphql(`#graphql
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
        "variables": {
          "metafieldsSetInput": [
            {
              "namespace": "settings",
              "key": "items",
              "type": "json",
              "value": JSON.stringify(reqData.data),
              "ownerId": appId
            }
          ]
        },
      },
    );
    const test = await createMetafield.json();
  

   }catch(err){
    console.log(err)
   }
   return json({
    success: true,
    message: "Settings Updated",
   
  });   
        }else{
        
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

        }`)
        const result = await response.json();
        console.log(result,"result---");
        const dataId = result.data.currentAppInstallation.metafields.edges;
        console.log(dataId,"dataId--")
        const appId = result.data.currentAppInstallation.id;
console.log(appId,"appId---------");
  
   const newData = {
            isActive: reqData.data.app_status ,
           }
           const updatedData = await db.AppSettings.update({
             where: { store_id: parseInt(stores.id), app_name:reqData.data.app_name },
             data:newData ,
           });
         console.log(reqData.data,"reqData.data---")
         try{
          const createMetafield = await admin.graphql(`#graphql
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
              "variables": {
                "metafieldsSetInput": [
                  {
                    "namespace": "settings",
                    "key": "items",
                    "type": "json",
                    "value": JSON.stringify(reqData.data),
                    "ownerId": appId
                  }
                ]
              },
            },
          );
          const test = await createMetafield.json();
            console.log(test ,"result---");
         }catch(err){
          console.log(err)
         }
          
         return json({
             success: true,
             message: "Activated app Successfully",
            
           });

 
          }

    }catch(err){
        return json({ success: false,  message: err.message });
    }

}