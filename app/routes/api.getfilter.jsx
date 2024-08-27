import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

import db from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const typeParam = url.searchParams.get("type");
  const pro_id = url.searchParams.get("id");
  
  const queryParam = `%${typeParam}%`;
  const fromParam = url.searchParams.get("from");
 
  try {

    if (fromParam && queryParam == "%%") {
     
      const getUpsells = await db.UpsellBuilder.findMany({
        where: {
          store: session.shop,
        },
      });
    
      return json(
        { success: true, data: getUpsells, message: "Exists" },
        200,
      );
   }else if(fromParam && queryParam){
      const searchQuery = await db.UpsellBuilder.findMany({
        where: {
          store_name: session.shop,
        
          OR: [
            {
              internal_name: {
                contains: typeParam,
                mode: 'insensitive', 
              },
            },
          ]
        }
      });

      if (searchQuery.length === 0) {
        return json({ success: false, message: "No data Exists" }, 200);
      }  else {
        return json(
          {
            success: true,
            message: "Exists",
            data: searchQuery,
          },
          200,
        );
      }
    } else{
   
      const searchQuery = await db.Reviews.findMany({
        where: {
          store_name: session.shop,
          product_id :pro_id,
          OR: [
            {
              name: {
                contains: typeParam,
                mode: 'insensitive', 
              },
            },
          ]
         
        },
      });

      if (searchQuery.length === 0) {
        return json({ success: false, message: "No data Exists" }, 200);
      } else {
        return json(
          {
            success: true,
            message: "Exists",
            data: searchQuery,
          },
          200,
        );
      }
    }
  } catch (error) {
    return json({ success: false, error: error.message }, 500);
  }
};
