import db from "../db.server";
import {authenticate} from '../shopify.server';
import { json } from "@remix-run/node";
export const loader = async ({ request }) => {
  const proId = new URL(request.url).searchParams.get("pId");
  const shopName = new URL(request.url).searchParams.get("shop");
  const {admin} = await authenticate.public.appProxy(request);
  if (proId) {
    const getReviews = await db.Reviews.findMany({
      where: {
        store_name: shopName,
        product_id: proId,
        status: "Published",
      },
    });

    return json({ success: true, data: getReviews });
  } else {
    const featuredReviews = await db.Reviews.findMany({
      where: {
        store_name: shopName,
        featured: true,
      },
    });
    const allReviews = await db.Reviews.findMany({
      where: {
        store_name: shopName,
      },
    });

    return json({ success: true, data: featuredReviews, total: allReviews });
  }
};
