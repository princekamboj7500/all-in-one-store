import db from "../db.server";
import { json } from "@remix-run/node";

const updateReview = async (product_id, store_name, updateData, ids) => {
  try {
    console.log(updateData, product_id, store_name,ids, "lllll" )
    const reviews = await db.Reviews.updateMany({
      where: {
        store_name: store_name,
        id: {
          in: ids,
        },
        product_id: product_id,
      },
      data: updateData,
    });
   console.log(reviews,"reviews____")
    const updateddata = await db.Reviews.findMany({
      where: {
        store_name: store_name,
        product_id: product_id,
      },
    });
  
    // const review = await db.Reviews.findMany ({
    //   where: {
    //     product_id,
    //     store_name,
    //   },
    // });

    // if (review) {
    //   const updatedReview = await db.Reviews.update({
    //     where: {
    //       id: review.id,
    //     },
    //     data: updateData,
    //   });

    return { success: true, data: updateddata };
  } catch (error) {
    console.error("Error updating review:", error);
    return { success: false, error: "Failed to update review" };
  }
};

export const action = async ({ request }) => {
  const reqData = await request.json();

  const { product_id, store_name, action, ids } = reqData;

  let updateData;  
  if(action =="Delete"){
    const reviews = await db.Reviews.deleteMany({
      where: {
        store_name: store_name,
        id: {
          in: ids,
        },
        product_id: product_id,
      }
    });
    const updateddata = await db.Reviews.findMany({
      where: {
        store_name: store_name,
        product_id: product_id,
      },
    });
    return { success: true, data: updateddata };
  }else{

  switch (action) {
    case "publish":
      updateData = { status: "Published" };
      break;
    case "unfeatured":
      updateData = { featured: false };
      break;
    case "featured":
      updateData = { featured: true };
      break;
    case "Unpublished":
      updateData = { status: "Unpublished" };
      break;
    case "Verified":
      updateData = { verified: true };
      break;
    case "Not Verified":
      updateData = { verified: false };
      break;
   
    default:
      return json({ success: false, error: "Invalid action" });
  }

  const result = await updateReview(product_id, store_name, updateData, ids);
  return json(result);
}
};
