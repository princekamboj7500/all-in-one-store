import { json } from "@remix-run/node";

import db from "../db.server";
import fs from "fs";
import csvParser from "csv-parser";
import { PassThrough } from "stream";
export const action = async ({ request }) => {
  async function processFile(file) {
    return new Promise(async (resolve, reject) => {
      const results = [];

      try {
        const arrayBuffer = await file.arrayBuffer();

        const buffer = Buffer.from(arrayBuffer);

        const stream = new PassThrough();
        stream.end(buffer);

        stream
          .pipe(csvParser())
          .on("data", (data) => {
            results.push(data);
          })
          .on("end", () => {
            const keyValueData = results.map((row) => {
              return {
                id: row["id"],
                ...row,
              };
            });

            resolve(keyValueData);
          })
          .on("error", (error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  }
  function parseDate(dateString) {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Note: month is zero-based in JavaScript Date
}
  async function insertReviews(reviews) {
    try {
      const transformedReviews = reviews.map((review) => ({
        store_name: "",
        product_id: review.product_id,
        product_handle: review.product_handle,
        product_image: review.product_image,
        product_title: review.product_title,
        rating: review.rating,
        name: review.name,
        email: review.email,
        reviewDesc: review.reviewDesc,
        image: review.image ? [review.image] : [],
        status: review.status,
        source: "",
        verified: false,
        featured: false,
        storeReply: "",
        createdAt: parseDate(review.created_at),
        updatedAt: new Date(),
      }));

      const createReviews = await db.reviews.createMany({
        data: transformedReviews
       
      });
    } catch (error) {
      console.error("Error inserting reviews:", error);
    }
  }
  try {
    const formData = await request.formData();

    const files = formData.getAll("files");

    const storeName = formData.getAll("store_name");
    let keyValueData;
    for (const file of files) {
      keyValueData = await processFile(file);
    }
    insertReviews(keyValueData, storeName);
    return json({ success: true });
  } catch (err) {
    console.log(err);
  }
};
