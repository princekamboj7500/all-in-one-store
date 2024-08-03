import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

import db from "../db.server";



export const action = async ({ request }) => {
    const {  session } = await authenticate.admin(request);
    const reqData = await request.json();
    const { action,type, id} = reqData;
    console.log(action, type)
    let data ;
 if(action=="Rating"){
   data = await db.Reviews.findMany({
        where:{
            store_name:session.shop,
            product_id:id,
            rating: {
                in: type,
              },
        }
    })
 }
 else if(action =="Source"){
    data = await db.Reviews.findMany({
         where:{
             store_name:session.shop,
             product_id:id,
             source :{
                in:type
             }
         }
     })
  }else{
    data = await db.Reviews.findMany({
        where:{
            store_name:session.shop,
            product_id:id,
            status :{
               in:type
            }
        }
    })
  }
   

return json({ success: true,data: data });
};
