import db from "../db.server";
import { json } from "@remix-run/node";
import AWS from "aws-sdk";
const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com");
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: "DO00TP86GJAEJQJLWQWR",
  secretAccessKey: "bzvG3i8ONdB+Y4ex6CIfWGpbfu+93H0NHk2UwD5QtxE",
  region: 'us-east-1'
});




export const action = async ({ request }) => {
  const  shopName = new URL(request.url).searchParams.get("shop");
   const formData = await request.formData();
  const files_q = formData.getAll('file');

  const uploadPromises = files_q.map(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const params = {
      Bucket: 'digital-products/allinone',
      Key: `${Date.now()}-${file.name}`,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read',
    };

    return s3.upload(params).promise();
  });
 try {
    const uploaded = await Promise.all(uploadPromises);
  const locations = uploaded.map(item => item.Location);
  const name = formData.get("name");
  const email = formData.get("email");
  const rating = formData.get("rating");
  const proId = formData.get("pId");
  const proHandle = formData.get("pHandle");
  const  review = formData.get("review");
  const pTitle = formData.get("pTitle");
  const pImage = formData.get("pImage")
  const status = formData.get("status")
const addReviews = await db.Reviews.create({
    data:{
        store_name:shopName,
        email:email,
        name:name,
        rating:rating,
        image :locations,
        reviewDesc :review,
        product_id:proId,
        product_handle :proHandle,
        product_image :pImage,
        product_title: pTitle,
        createdAt: new Date(),
        status:status,
        source:"AIOS"
    },
})
return { success: true, message:"Review added successfully",data:addReviews};
}catch (error) {
  console.error('Error: ', error);
  return json({ error: 'Error  adding in review' }, { status: 500 });
}
};
