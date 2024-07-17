import db from "../db.server";
import { json } from "@remix-run/node";




export const action = async ({request})=>{

  const reqData = await request.json();
  const  shopName = new URL(request.url).searchParams.get("shop");

  const date = new Date();

  const dateString = date.toISOString();

  try {
    // Find existing ReviewAnalytics entry
    const existingEntry = await db.ReviewAnalytics.findFirst({
      where: {
        store_name: shopName,
      },
    });
  

    if (existingEntry) {
      const updatedEntry = await db.ReviewAnalytics.update({
        where: {
          id: existingEntry.id,
        },
        data: {
          count: [...existingEntry.count, dateString],
        },
      });
     } else {
    const newEntry = await db.ReviewAnalytics.create({
        data: {
          store_name: shopName,
          count: [dateString],
        },
      });
      console.log('Created ReviewAnalytics:', newEntry);
    }
  } catch (error) {
    console.error('Error:', error);
  }
 return json({success:true})
}