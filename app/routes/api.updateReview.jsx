import db from "../db.server";



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
