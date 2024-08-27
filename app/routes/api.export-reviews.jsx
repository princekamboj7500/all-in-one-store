import { json } from "@remix-run/node";

import db from "../db.server";
import fs from "fs";
import csvParser from "csv-parser";
import { PassThrough } from "stream";
export const action = async ({ request }) => {
  try {
    // Fetch reviews from the database
    const reviews = await prisma.reviews.findMany();

    // Define CSV file path
    const csvFilePath = path.join(__dirname, "reviews.csv");

    // Define the CSV writer
    const csvWriter = createCsvWriter({
      path: csvFilePath,
      header: [
        { id: "id", title: "ID" },
       
        { id: "product_id", title: "Product ID" },
        { id: "product_handle", title: "Product Handle" },
        { id: "product_image", title: "Product Image" },
        { id: "product_title", title: "Product Title" },
        { id: "rating", title: "Rating" },
        { id: "name", title: "Name" },
        { id: "email", title: "Email" },
        { id: "reviewDesc", title: "Review Description" },
        { id: "image", title: "Images" },
        { id: "status", title: "Status" },
        { id: "source", title: "Source" },
        { id: "verified", title: "Verified" },
        { id: "featured", title: "Featured" },
        { id: "storeReply", title: "Store Reply" },
        { id: "createdAt", title: "Created At" },
      
      ],
    });

    // Write records to the CSV file
    await csvWriter.writeRecords(
      reviews.map((review) => ({
        ...review,
        image: review.image.join(", "), 
        createdAt: review.createdAt.toISOString(),
        
      })),
    );

   
    res.download(csvFilePath, "reviews.csv", (err) => {
      if (err) {
        console.error("Error downloading the file:", err);
        res.status(500).send("Could not download the file");
      }
    });
  } catch (error) {
    console.error("Error exporting reviews:", error);
    res.status(500).send("Error exporting reviews");
  }
};
