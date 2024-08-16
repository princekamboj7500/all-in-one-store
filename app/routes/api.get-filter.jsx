import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

import db from "../db.server";
import internal from "stream";



export const action = async ({ request }) => {
    const {  session } = await authenticate.admin(request);
    const reqData = await request.json();
    const url = new URL(request.url);
    const typeParam = url.searchParams.get("type");
    const { action,type, id} = reqData;

    let data ;
    if(action =="offer_types"){
        console.log(type)
        try{
            data = await db.UpsellBuilder.findMany({
                where:{
                    store:session.shop,
                    discount_type: {
                        in: type,
                      },
                }
            })  
            console.log(data,"data___")
        }catch(err){
            console.log(err)
        }
       
    }
 else if(action=="Rating"){
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
