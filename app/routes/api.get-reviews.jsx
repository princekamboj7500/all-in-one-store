import db from "../db.server";

import { json } from "@remix-run/node";
export const loader = async({request}) =>{
  const proId = new URL(request.url).searchParams.get('pId');
  const shop = request.headers.get("X-Shop");

   if(proId){
    const getReviews = await db.Reviews.findMany({
      where:{
          store_name:shop,
          product_id:proId
      }
    })
    return json({success:true, data:getReviews})
    }else{
      const featuredReviews = await db.Reviews.findMany({
        where:{
            store_name:shop,
            featured:true
        }
      })
      const allReviews = await db.Reviews.findMany({
        where:{
            store_name:shop,
         }
      })
      
      return json({success:true, data:featuredReviews, total:allReviews})
    }
 

    
}