import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

import db from "../db.server";


export const loader = async ({ request }) => {
   
//  try {
//     const searchQuery = await db.Reviews.findMany({
//         where: {
//           store_name: session.shop,
         
//              name: { contains: queryParam } ,
          
          
//         }
//       });
//       console.log(searchQuery,"queryParam---")
//    if (searchQuery.length === 0) {
//     return json({ success: false, message: "No data Exists" }, 200);
//   } else {
//     return json({
//       success: true,
//       message: "Exists",
//       data: searchQuery,
//     }, 200);
//   }
// }catch (error) {
//   return json({ success: false, error: error.message }, 500);
// }
  }

export const action = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
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
   
    console.log(data,"data-")
return json({ success: true,data: data });
};
