import db from "../db.server";

import { json } from "@remix-run/node";
import { unauthenticated } from "../shopify.server";
export const loader = async ({ request, params }) => {
  const url = new URL(request.url);
  const shopName = url.searchParams.get("shop");
  const type = url.searchParams.get("type");
  const query = url.searchParams.get("str");
  const product_id = url.searchParams.get("product_id");
console.log("helooo____");
  const { admin, session } = await unauthenticated.admin(shopName);

  const getAllCollections = async () => {
    const response = await admin.graphql(
      `#graphql
       query { collections(first: 250) {
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
        products(first: 250, query: "${query}") {
          edges {
              node {
                  title
                  id
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
  
  const response = await admin.graphql(
    `#graphql
    query {
    product(id: "gid://shopify/Product/${product_id}") {
      title
      collections(first: 250){
        edges{
          node{
            id
          }
        }
      }
    }
  }`,
  );
  const collections = await response.json();
  let filter_query = [
    { "rules.customer_buy.products": `gid://shopify/Product/${product_id}` },
    { "rules.customer_buy.chosen_type": "any" },
  ];
  if (collections.data.product.collections.edges.length) {
    collections.data.product.collections.edges.map((c) => {
      filter_query.push({ "rules.customer_buy.collections": c.node.id });
    });
  }

  if (type) {
    try {
   
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
        (r) => r.rules.customer_buy.chosen_type == "any",
      );
      const specificRule = results.cursor.firstBatch.filter(
        (r) => r.rules.customer_buy.chosen_type == "specific",
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
            .map((v) => {
              return "id:" + v.replace("gid://shopify/Product/", "");
            })
            .join(" OR ");
          var products = await getProducts(products_filter);
         
        
          selected_rule.rules.customer_get.products =
            products.data.products.edges;
        }

        let collections_filter = selected_rule.rules.customer_get.collections;
        if (collections_filter.length) {
          collections_filter = collections_filter
            .map((v) => {
              return "id:" + v.replace("gid://shopify/Collection/", "");
            })
            .join(" OR ");
          var Collections = await getCollections(collections_filter);
          // selected_rule.rules.customer_get.collections =
          //   Collections.data.collections.edges[0].node.products.edges;
          
          let combinedProducts = [
            ...selected_rule.rules.customer_get.products,
            ...Collections.data.collections.edges[0].node.products.edges
          ];  
          let uniqueProducts = [];
          let uniqueIds = [];
        
          combinedProducts.forEach(product => {
            if (!uniqueIds.includes(product.node.id)) {
              uniqueIds.push(product.node.id);
              uniqueProducts.push(product);
            }
          });
          selected_rule.rules.customer_get.products = uniqueProducts;
        }

        if (selected_rule.rules.customer_get.chosen_type == "any") {
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
          discount: selected_rule,
         
        });
      } else {
        return json({ success: false, discount: {} });
      }
    } catch (error) {
      return json({ success: false, error: error.message });
    }
  } else {
    try {
      const response = await admin.graphql(
        `#graphql
              query {
                  products(first: 250, query: "${query}") {
                      edges {
                          node {
                              title
                              id
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
      const products = data.data.products.edges;

      return json({ success: true, data: products });
    } catch (error) {
      return json({ success: false, error: error.message });
    }
  }
};