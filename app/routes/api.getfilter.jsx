import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

import db from "../db.server";


export const loader = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
   const url = new URL(request.url);
  const typeParam = url.searchParams.get('type');
  const queryParam = `%${typeParam}%`;
  console.log(queryParam,"queryParam---")
 try {
    const searchQuery = await db.Reviews.findMany({
        where: {
          store_name: session.shop,
         
             name: { contains: queryParam } ,
          
          
        }
      });
      console.log(searchQuery,"queryParam---")
   if (searchQuery.length === 0) {
    return json({ success: false, message: "No data Exists" }, 200);
  } else {
    return json({
      success: true,
      message: "Exists",
      data: searchQuery,
    }, 200);
  }
}catch (error) {
  return json({ success: false, error: error.message }, 500);
}
  }

export const action = async ({ request }) => {

};
