
import { json } from "@remix-run/node";

import db from "../db.server";



export const loader =async ({request})=>{
    const  shopName = new URL(request.url).searchParams.get("shop");
    const id = new URL(request.url).searchParams.get("id");
    const getData = await db.Reviews.findMany({
        where :{
           product_id:id,
           store_name:shopName
      }
    })
    return json({success:true, data:getData })
}