import { json } from "@remix-run/node";
import { unauthenticated } from "../shopify.server";
import db from "../db.server";
export const action = async ({ request }) => {
  const payload = await request.json();

  const url = new URL(request.url);
  const shopName = url.searchParams.get("shop");
  const productId = url.searchParams.get("id");
  const cartItems = payload.data.items;

  const { admin, session } = await unauthenticated.admin(shopName);
  const getAllCollections = async () => {
    const response = await admin.graphql(
      `#graphql
       query { collections(first: 5) {
          edges {
           node {
              id
                productsCount{
                   count
                    }
            }
         }
         }
        }`,
    );
    const data = await response.json();
    return data;
  };
  const getProducts = async (query) => {
    const response = await admin.graphql(
      `#graphql
      query {
        products(first: 5, query: "${query}") {
          edges {
              node {
                  title
                  id
                  handle
                  hasOnlyDefaultVariant
                  hasOutOfStockVariants
                  totalVariants
                  featuredImage{
                  src

                  }
                  variants(first: 100) {
                      edges {
                          node {
                              id
                              title
                              price
                          }
                      }
                  }
              }
          }
        }
      }`,
    );

    const data = await response.json();
    return data;
  };
  const getCollections = async (query) => {
    const response = await admin.graphql(
      `#graphql
      query {
        collections(first: 5, query: "${query}") {
          edges {
            node {
              id
              title
              products(first: 250) {
                edges {
                    node {
                        title
                        id
                        hasOnlyDefaultVariant
                           featuredImage{
                  src

                  }
                        hasOutOfStockVariants
                        variants(first: 100) {
                            edges {
                                node {
                                    id
                                    title
                                    price
                                }
                            }
                        }
                    }
                }
              }
            }
          }
        }
      }`,
    );

    const data = await response.json();
    return data;
  };
  const getAnyProducts = async (id) => {
    const response = await admin.graphql(
      `#graphql
      query {
        collections(first: 1, query: "id:${id}") {
          edges {
            node {
              id
              title
          handle
              products(first: 250) {
                edges {
                    node {
                        title
                        id
                        handle
                        featuredImage{
                        src
                      }
                        hasOnlyDefaultVariant
                        hasOutOfStockVariants
                        variants(first: 100) {
                            edges {
                                node {
                                    id
                                    title
                                    price
                                }
                            }
                        }
                    }
                }
              }
            }
          }
        }
      }`,
    );

    const data = await response.json();

    return data;
  };
  const type = "bogo";
  const filteredData = cartItems
    .filter((item) => !item.properties._BOGO)
    .map((item) => item.product_id);
  



  try {
  
    // for (const productId of filteredData) {
   
      const response = await admin.graphql(
        `#graphql
      query {
        product(id: "gid://shopify/Product/${productId}") {
          title
          collections(first: 5) {
            edges {
              node {
                id
              }
            }
          }
        }
      }`,
      );

      const collections = await response.json();
    
      let filter_query = [
        { "rules.customer_buy.products": `gid://shopify/Product/${productId}` },
        { "rules.customer_buy.chosen_type": "any" },
      ];

      if (collections.data.product.collections.edges.length) {
        collections.data.product.collections.edges.forEach((c) => {
          filter_query.push({ "rules.customer_buy.collections": c.node.id });
        });
      }
      const results = await db.$runCommandRaw({
        find: "UpsellBuilder",
        filter: {
          store: shopName,
          discount_type: type.toUpperCase(),
          offer_status: "Active",
          $or: filter_query,
        },
      });
     
    
      
     
      const anyRule = results.cursor.firstBatch.filter(
        (r) => r.rules.customer_buy.chosen_type === "any",
      );
      const specificRule = results.cursor.firstBatch.filter(
        (r) => r.rules.customer_buy.chosen_type === "specific",
      );
      let selected_rule = null;
      if (results.cursor.firstBatch.length) {
        if (specificRule.length) {
          selected_rule = specificRule[0];
        } else if (anyRule.length) {
          selected_rule = anyRule[0];
        }
        let products_filter = selected_rule.rules.customer_get.products;
        if (products_filter.length) {
          products_filter = products_filter
            .map((v) => "id:" + v.replace("gid://shopify/Product/", ""))
            .join(" OR ");
          const products = await getProducts(products_filter);

          selected_rule.rules.customer_get.products =
            products.data.products.edges;
        }

        let collections_filter = selected_rule.rules.customer_get.collections;
        if (collections_filter.length) {
          collections_filter = collections_filter
            .map((v) => "id:" + v.replace("gid://shopify/Collection/", ""))
            .join(" OR ");

          const collections = await getCollections(collections_filter);

          let combinedProducts = [
            ...selected_rule.rules.customer_get.products,
            ...collections.data.collections.edges[0].node.products.edges,
          ];
          let uniqueProducts = [];
          let uniqueIds = [];

          combinedProducts.forEach((product) => {
            if (!uniqueIds.includes(product.node.id)) {
              uniqueIds.push(product.node.id);
              uniqueProducts.push(product);
            }
          });

          selected_rule.rules.customer_get.products = uniqueProducts;
        }

        // Handle case where chosen_type is "any"
        if (selected_rule.rules.customer_get.chosen_type === "any") {
          const anyCollections = await getAllCollections();
          const collectionCount = anyCollections.data.collections.edges;
          const idAndCounts = collectionCount.map((c) => ({
            id: c.node.id,
            count: c.node.productsCount.count,
          }));
          const sortedData = idAndCounts.sort((a, b) => b.count - a.count);
          const countId = sortedData[0].id;
          const allProductsFilter = countId.replace(
            "gid://shopify/Collection/",
            "",
          );

          const getAllProducts = await getAnyProducts(allProductsFilter);

          selected_rule.rules.customer_get.products =
            getAllProducts.data.collections.edges[0].node.products.edges;
        }

        return json({
          success: true,
          product_id:productId,
          discount: selected_rule,
        });
   
      
       
     
      } else {
        return json({
          success: true,
          discount: {},
        });
       
      }
 
    
  } catch (err) {
    console.error(`Error processing product ID ${productId}:`, err);
   
    return json({
      success: false,
      discount: err,
    });
  }
};
