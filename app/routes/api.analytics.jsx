import db from "../db.server";
import { json } from "@remix-run/node";
import {authenticate} from '../shopify.server';
export const loader = async ({ request }) => {
  const shopName = new URL(request.url).searchParams.get("shop");
  const analytType = new URL(request.url).searchParams.get("type");
  const {admin} = await authenticate.public.appProxy(request);
  const date = new Date();
  const dateString = date.toISOString();

  const existingEntry = await db.ReviewAnalytics.findFirst({
    where: {
      store_name: shopName,
    },
  });

  try {
    if (analytType === "buttonClick") {
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
      
      }
    } else if (analytType === "starClick") {
      if (existingEntry) {
        const updatedEntry = await db.ReviewAnalytics.update({
          where: {
            id: existingEntry.id,
          },
          data: {
            starclick: [...existingEntry.count, dateString],
          },
        });
      } else {
        const newEntry = await db.ReviewAnalytics.create({
          data: {
            store_name: shopName,
            starclick: [dateString],
          },
        });
      }
    } else {
    }
    return json({ success: true });
  } catch (error) {
    console.error("Error handling ReviewAnalytics:", error);
    return json({ success: false });
  }
};
