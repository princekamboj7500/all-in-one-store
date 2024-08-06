import db from "../db.server";
import { json } from "@remix-run/node";

const updateReview = async (product_id, store_name, updateData) => {
  try {
    const review = await db.Reviews.findFirst({
      where: {
        product_id,
        store_name,
      },
    });
 

    if (review) {
      const updatedReview = await db.Reviews.update({
        where: {
          id: review.id,
        },
        data: updateData,
      });

      
      return { success: true, data: updatedReview };
    } else {
      return { success: false, error: "Review not found" };
    }
  } catch (error) {
    console.error("Error updating review:", error);
    return { success: false, error: "Failed to update review" };
  }
};

export const action = async ({ request }) => {
  const reqData = await request.json();
  const { product_id, store_name, id, editReview, action } = reqData;
 
  if(action == "SaveReply"){
    let updateData1 = {
      storeReply:reqData.reply_content
   }
    const reviews = await db.Reviews.update({
      where: {
        id: id,
        store_name:store_name,
        product_id:product_id
      },
      data:updateData1 
    });
  }else{
    const convertToISO = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString();
    };
    const getCurrentISODate = () => {
      return new Date().toISOString();
    };
    const updatedAt = getCurrentISODate();
    const isoDate = convertToISO(editReview.date);
  let updateData = {
    name:reqData.editReview.name,
    email:reqData.editReview.email,
    reviewDesc:reqData.editReview.content,
    createdAt:isoDate,
    updatedAt: updatedAt

  }

  const reviews = await db.Reviews.update({
    where: {
      id: id,
      store_name:store_name,
      product_id:product_id
    },
    data:updateData
  });
}
  const updateddata = await db.Reviews.findMany({
    where: {
      store_name:store_name,
      product_id:product_id,
      
    },
  });

return { success: true, data: updateddata };

};
