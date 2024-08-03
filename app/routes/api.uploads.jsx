import { json } from "@remix-run/node";
import AWS from 'aws-sdk';
import db from "../db.server";
const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com");
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: "DO00TP86GJAEJQJLWQWR",
  secretAccessKey: "bzvG3i8ONdB+Y4ex6CIfWGpbfu+93H0NHk2UwD5QtxE",
  region: 'us-east-1'
});

export const action = async ({ request }) => {

  const formData = await request.formData();

  const files_q = formData.getAll('files');
  const exist_files = formData.getAll('exist');

  if(files_q){
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
   
      const combinedArray = [...exist_files, ...locations];
      const proId = formData.get("product_id");
      const shop = formData.get("store_name");
      const id = formData.get("id");
      const updatedData={
        image:combinedArray
      }
      const reviews = await db.Reviews.update({
        where: {
          id: id,
          store_name:shop,
          product_id:proId
        },
        data:updatedData
      });
      const updateddata = await db.Reviews.findMany({
        where: {
          store_name:shop,
          product_id:proId,
        },
      });
      return json({ success: true, data: updateddata });
    } catch (error) {
      console.error('Error uploading files: ', error);
      return json({ error: 'Error uploading files' }, { status: 500 });
    }
  }else{
    try{
    const proId = formData.get("product_id");
      const shop = formData.get("store_name");
      const id = formData.get("id");
      const updatedData={
        image:exist_files
      }
      const reviews = await db.Reviews.update({
        where: {
          id: id,
          store_name:shop,
          product_id:proId
        },
        data:updatedData
      });
      const updateddata = await db.Reviews.findMany({
        where: {
          store_name:shop,
          product_id:proId,
        },
      });
      return json({ success: true, data: updateddata });
    }
    catch (error) {
      console.error('Error uploading files: ', error);
      return json({ error: 'Error uploading files' }, { status: 500 });
    }
  }


 
}