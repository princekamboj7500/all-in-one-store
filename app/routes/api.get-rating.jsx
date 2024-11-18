
import { json } from "@remix-run/node";
import {authenticate} from '../shopify.server';
import db from "../db.server";



export const loader =async ({request})=>{
    const {admin} = await authenticate.public.appProxy(request);
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