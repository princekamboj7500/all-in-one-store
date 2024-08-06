import db from "../db.server";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const getReviews = await db.Reviews.findMany({
    where:{
      store_name:session.shop
    }
  });
  
  const productHandlesWithRatings = getReviews.map(item => ({
    product_id: item.product_id,  
    product_handle: item.product_handle,
    rating: item.rating,
    review: item.reviewDesc,
    product_image:item.product_image,
   product_title:item.product_title
  }));
  
  
  const formattedHandles = productHandlesWithRatings.map(item => `handle:${item.product_handle}`).join(' OR ');


  const response = await admin.graphql(
    `#graphql
    query {
      products(first: 250, query: "${formattedHandles}") {
        edges {
          node {
            id
            title
            handle
            images(first: 1) {
              edges {
                node {
                  src
                }
              }
            }
          }
        }
      }
    }`
  );

  const data = await response.json();

  const proHandles = data.data.products.edges.map((edge) => {
    const matchingReview = productHandlesWithRatings.find(item => item.product_handle === edge.node.handle);
    const productImage = edge.node.images.edges.length > 0 ? edge.node.images.edges[0].node.src : null;
    return {
      product_id: matchingReview ? matchingReview.product_id : null,  
      title: edge.node.title,
      rating: matchingReview ? matchingReview.rating : null,
      image: productImage
    };
  });


  return json({ success: true, data: proHandles });
}
