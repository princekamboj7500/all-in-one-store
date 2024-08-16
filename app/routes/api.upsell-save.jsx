import db from "../db.server";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
export const action = async ({ request }) => {
  const reqData = await request.json();
  const { actionType, data, id, ids, store } = reqData;

  const { admin } = await authenticate.admin(request);
  function generateUniqueString() {
    const randomString = Math.random().toString(36).substring(2, 12);
    return randomString;
  }

  const perPage = "3";
  let cursor = null;
  let hasNextPage = true;
  let allBuyProducts;
  let allGetProducts;

  const getCustomerAllProducts = async (cursor, type) => {
    cursor = cursor ? `, after: "${cursor}"` : "";
    const response = await admin.graphql(
      `#graphql
    query {
      products(first:250 ${cursor}, query:"status:ACTIVE") {
        edges {
          node {
            id
           
          }
        }
             pageInfo
        {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
        }
      }
    }`,
    );

    const data = await response.json();
    const nodes = data.data.products.edges.map((edge) => edge.node);
    allGetProducts = nodes;

    hasNextPage = data.data.products.pageInfo.hasNextPage;

    if (hasNextPage) {
      cursor = hasNextPage ? data.data.products.pageInfo.endCursor : false;
      return await getAllProducts(cursor);
    }
  };
  const getAllProducts = async (cursor) => {
    cursor = cursor ? `, after: "${cursor}"` : "";
    const response = await admin.graphql(
      `#graphql
    query {
      products(first:250 ${cursor}) {
        edges {
          node {
            id
           
          }
        }
             pageInfo
        {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
        }
      }
    }`,
    );

    const data = await response.json();

    const nodes = data.data.products.edges.map((edge) => edge.node);
    allBuyProducts = nodes;

    hasNextPage = data.data.products.pageInfo.hasNextPage;

    if (hasNextPage) {
      cursor = hasNextPage ? data.data.products.pageInfo.endCursor : false;
      return await getAllProducts(cursor);
    }
  };

  const getCollections = async (query) => {
    const response = await admin.graphql(
      `#graphql
    query {
      collections(first: 250, query: "${query}") {
        edges {
          node {
            id
            title
            products(first: 250) {
              edges {
                  node {
                      id
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

  const customerBuyProducts = async (data) => {
    let products_filter = data.rules.customer_buy.products;
    let collection_filter = data.rules.customer_buy.collections;
    let buyIds;
    if (data.rules.customer_buy.chosen_type == "any") {
      await getAllProducts(cursor);

      buyIds = allBuyProducts.map((item) => item.id);
    } else {
      if (products_filter.length && collection_filter.length === 0) {
        buyIds = products_filter;
      } else if (collection_filter.length && products_filter.length === 0) {
        collection_filter = collection_filter
          .map((v) => {
            return "id:" + v.replace("gid://shopify/Collection/", "");
          })
          .join(" OR ");
        var collections = await getCollections(collection_filter);
        const productsArray = collections.data.collections.edges.flatMap(
          (collection) =>
            collection.node.products.edges.map((product) => product.node),
        );
        const collIds = productsArray.map((item) => item.id);
        let uniqueCollections = [];
        let uniqueIds = [];

        collIds.forEach((id) => {
          if (!uniqueIds.includes(id)) {
            uniqueIds.push(id);
            uniqueCollections.push(id);
          }
        });
        buyIds = uniqueCollections;
      } else if (products_filter.length && collection_filter.length) {
        collection_filter = collection_filter
          .map((v) => {
            return "id:" + v.replace("gid://shopify/Collection/", "");
          })
          .join(" OR ");

        var collections = await getCollections(collection_filter);

        const productsArray = collections.data.collections.edges.flatMap(
          (collection) =>
            collection.node.products.edges.map((product) => product.node),
        );

        const collIds = productsArray.map((item) => item.id);

        let combinedProducts = [...products_filter, ...collIds];
        let uniqueProducts = [];
        let uniqueIds = [];

        combinedProducts.forEach((id) => {
          if (!uniqueIds.includes(id)) {
            uniqueIds.push(id);
            uniqueProducts.push(id);
          }
        });

        buyIds = uniqueProducts;
      } else {
        buyIds = [];
      }
    }
    return buyIds;
  };
  const customerGetProducts = async (data) => {
    let getProducts_filter = data.rules.customer_get.products;
    let getCollections_filter = data.rules.customer_get.collections;
    let getIds;
    if (data.rules.customer_get.chosen_type == "any") {
      await getCustomerAllProducts(cursor);

      getIds = allGetProducts.map((item) => item.id);
    } else {
      if (getProducts_filter.length && getCollections_filter.length === 0) {
        getIds = getProducts_filter;
      } else if (
        getCollections_filter.length &&
        getProducts_filter.length === 0
      ) {
        getCollections_filter = getCollections_filter
          .map((v) => {
            return "id:" + v.replace("gid://shopify/Collection/", "");
          })
          .join(" OR ");

        var collections = await getCollections(getCollections_filter);
        const productsArray = collections.data.collections.edges.flatMap(
          (collection) =>
            collection.node.products.edges.map((product) => product.node),
        );
        const collIds = productsArray.map((item) => item.id);

        let uniqueCollections = [];
        let uniqueIds = [];

        collIds.forEach((id) => {
          if (!uniqueIds.includes(id)) {
            uniqueIds.push(id);
            uniqueCollections.push(id);
          }
        });
        getIds = uniqueCollections;
      } else if (getProducts_filter.length && getCollections_filter.length) {
        getCollections_filter = getCollections_filter
          .map((v) => {
            return "id:" + v.replace("gid://shopify/Collection/", "");
          })
          .join(" OR ");

        var collections = await getCollections(getCollections_filter);

        const productsArray = collections.data.collections.edges.flatMap(
          (collection) =>
            collection.node.products.edges.map((product) => product.node),
        );
        const collIds = productsArray.map((item) => item.id);
        let combinedProducts = [...getProducts_filter, ...collIds];
        let uniqueProducts = [];
        let uniqueIds = [];

        combinedProducts.forEach((id) => {
          if (!uniqueIds.includes(id)) {
            uniqueIds.push(id);
            uniqueProducts.push(id);
          }
        });
        getIds = combinedProducts;
      } else {
        getIds = [];
      }
    }
    return getIds;
  };

  const BogoDiscountCreateShopify = async (data) => {
    const percentage = parseFloat(data.rules.discount.discount_amount) / 100;
    const buyIds = await customerBuyProducts(data);
    const getIds = await customerGetProducts(data);

    let variables = {
      automaticBxgyDiscount: {
        usesPerOrderLimit: "10",
        startsAt: new Date().toISOString(),
        title: generateUniqueString(),
        customerGets: {
          value: {
            discountOnQuantity: {
              quantity: data.rules.customer_get.qty.toString(),
              effect: {
                percentage: percentage,
              },
            },
          },
          items: {
            products: {
              productsToAdd: getIds,
            },
          },
        },
        customerBuys: {
          value: {
            quantity: data.rules.customer_buy.qty.toString(),
          },
          items: {
            products: {
              productsToAdd: buyIds,
            },
          },
        },
      },
    };
    const response = await admin.graphql(
      `#graphql
    mutation discountAutomaticBxgyCreate($automaticBxgyDiscount: DiscountAutomaticBxgyInput!) {
      discountAutomaticBxgyCreate(automaticBxgyDiscount: $automaticBxgyDiscount) {
        automaticDiscountNode {
          id
          automaticDiscount {
            ... on DiscountAutomaticBxgy {
              createdAt
              startsAt
              endsAt
              status
              summary
              title
              usesPerOrderLimit
              customerGets {
                items {
                  ... on DiscountProducts {
                    products(first: 2) {
                      nodes {
                        id
                      }
                    }
                  }
                }
                value {
                  ... on DiscountOnQuantity {
                    quantity {
                      quantity
                    }
                  }
                }
              }
              customerBuys {
                items {
                  ... on DiscountProducts {
                    products(first: 2) {
                      nodes {
                        id
                      }
                    }
                  }
                }
                value {
                  ... on DiscountQuantity {
                    quantity
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          code
          message
        }
      }
    }`,
      {
        variables: {
          automaticBxgyDiscount: variables.automaticBxgyDiscount,
        },
      },
    );

    const result = await response.json();

    return result.data.discountAutomaticBxgyCreate.automaticDiscountNode.id;
  };

  const BogoDiscountDeleteShopify = async (discountId) => {
    const response = await admin.graphql(
      `#graphql
      mutation discountAutomaticDelete($id: ID!) {
        discountAutomaticDelete(id: $id) {
          deletedAutomaticDiscountId
          userErrors {
            field
            code
            message
          }
        }
      }`,
      {
        variables: {
          id: discountId,
        },
      },
    );

    const data = await response.json();
  };
  const processDiscounts = async (discounts, type) => {
    console.log(discounts,"discounts___")
    if(type =="activated"){
    for (const discount of discounts) {
      const discountId = discount.shopify_discount_id;
      if (discountId === null) {
     
     const bogoCreateId = await BogoDiscountCreateShopify(discount);
     const updatedData = {
      store: discount.store,
      discount_type: discount.discount_type,
      rules: discount.rules,
      cart_label: discount.cart_label,
      internal_name: discount.internal_name,
       created_at: new Date(),
      shopify_discount_id: bogoCreateId,
    };
    const updateDiscounts = await db.UpsellBuilder.update({
      where: {
        id: discount.id,
      },
      data: updatedData,
    });
      } else {
        const data = await bogoDiscountActivateShopify(discountId);
        console.log(data);
      }
    }
  }else{
    for (const discount of discounts) {
      const discountId = discount.shopify_discount_id;
      if (discountId === null) {
        // await handleNullDiscountId();
      } else {
        const data = await bogoDiscountDeactivateShopify(discountId);
        console.log(data);
      }
    }
  }
  };
  const bogoDiscountActivateShopify = async (discountId) => {
    const response = await admin.graphql(
      `#graphql
      mutation discountAutomaticActivate($id: ID!) {
        discountAutomaticActivate(id: $id) {
          automaticDiscountNode {
            automaticDiscount {
              ... on DiscountAutomaticBxgy {
                status
                startsAt
                endsAt
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          id: discountId,
        },
      },
    );

    const data = await response.json();
    return data;
  };
  const bogoDiscountDeactivateShopify = async (discountId) => {
    const response = await admin.graphql(
      `#graphql
      mutation discountAutomaticDeactivate($id: ID!) {
        discountAutomaticDeactivate(id: $id) {
          automaticDiscountNode {
            automaticDiscount {
              ... on DiscountAutomaticBxgy {
                status
                startsAt
                endsAt
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          id: discountId,
        },
      },
    );

    const data = await response.json();
    console.log(data,"data_____")
  };

  if (actionType === "update") {
    const existData = await db.UpsellBuilder.findFirst({
      where: {
        id: id,
      },
    });
    if (
      existData.shopify_discount_id != null &&
      data.offer_status == "Active"
    ) {
      const bogoBuy = await BogoDiscountDeleteShopify(
        existData.shopify_discount_id,
      );
      const bogoCreateId = await BogoDiscountCreateShopify();
      const updatedData = {
        store: data.store,
        discount_type: data.discount_type,
        rules: data.rules,
        cart_label: data.cart_label,
        internal_name: data.internal_name,
        offer_status: data.offer_status,
        created_at: new Date(),
        shopify_discount_id: bogoCreateId,
      };
      const updateDiscounts = await db.UpsellBuilder.update({
        where: {
          id: id,
        },
        data: updatedData,
      });
    } else if (
      existData.shopify_discount_id == null &&
      data.offer_status == "Active"
    ) {
      const bogoCreateId = await BogoDiscountCreateShopify();

      const updatedData = {
        store: data.store,
        discount_type: data.discount_type,
        rules: data.rules,
        cart_label: data.cart_label,
        internal_name: data.internal_name,
        offer_status: data.offer_status,
        created_at: new Date(),
        shopify_discount_id: bogoCreateId,
      };
      const updateDiscounts = await db.UpsellBuilder.update({
        where: {
          id: id,
        },
        data: updatedData,
      });
    } else if (
      existData.shopify_discount_id != null &&
      data.offer_status == "Draft"
    ) {
      const bogoBuy = await BogoDiscountDeleteShopify(
        existData.shopify_discount_id,
      );
      const updatedData = {
        store: data.store,
        discount_type: data.discount_type,
        rules: data.rules,
        cart_label: data.cart_label,
        internal_name: data.internal_name,
        offer_status: data.offer_status,
        created_at: new Date(),
        shopify_discount_id: null,
      };
      const updateDiscounts = await db.UpsellBuilder.update({
        where: {
          id: id,
        },
        data: updatedData,
      });
    } else if (
      existData.shopify_discount_id == null &&
      data.offer_status == "Draft"
    ) {
      const updatedData = {
        store: data.store,
        discount_type: data.discount_type,
        rules: data.rules,
        cart_label: data.cart_label,
        internal_name: data.internal_name,
        offer_status: data.offer_status,
        created_at: new Date(),
        shopify_discount_id: null,
      };
      const updateDiscounts = await db.UpsellBuilder.update({
        where: {
          id: id,
        },
        data: updatedData,
      });
    }
    const updateddata = await db.UpsellBuilder.findFirst({
      where: {
        id: id,
      },
    });

    return json({
      success: true,
      message: "Updated  successfully",
      data: updateddata,
    });
  } else if (actionType === "save") {
    let discountId = null;

    if (data.offer_status === "Active") {
      const BoGoId = await BogoDiscountCreateShopify();
      discountId = BoGoId;
    }

    const addDiscounts = await db.UpsellBuilder.create({
      data: {
        store: data.store,
        discount_type: data.discount_type,
        rules: data.rules,
        shopify_discount_id: discountId,
        cart_label: data.cart_label,
        internal_name: data.internal_name,
        offer_status: data.offer_status,
        created_at: new Date(),
      },
    });

    return json({
      success: true,
      message: "Added successfully",
      data: addDiscounts,
    });
  } else if (actionType === "delete") {
    const existData = await db.UpsellBuilder.findFirst({
      where: {
        id: id,
      },
    });
    if (existData.shopify_discount_id != null) {
      const bogoBuy = await BogoDiscountDeleteShopify(
        existData.shopify_discount_id,
      );
    }
    const updateDiscounts = await db.UpsellBuilder.deleteMany({
      where: {
        id: id,
      },
    });
    return json({
      success: true,
      message: "Deleted successfully",
      data: addDiscounts,
    });
  } else if (actionType == "activated") {
 const findDiscountIds = await db.UpsellBuilder.findMany({
      where: {
        id: {
          in: ids,
        },
        store: store,
      }
    });
    processDiscounts(findDiscountIds, "activated");

    const updateDiscounts = await db.UpsellBuilder.updateMany({
      where: {
        id: {
          in: ids,
        },
        store: store,
      },
      data: {
        offer_status: "Active",
      },
    });
    const updateddata = await db.UpsellBuilder.findMany({
      where: {
        store: store,
      },
    });
    return json({
      success: true,
      message: "ACTIVATED  successfully",
      data: updateddata,
    });
  } else if (actionType == "deactivated") {
    const updateStatus = {
      offer_status: "Draft",
    };
    const findDiscountIds = await db.UpsellBuilder.findMany({
      where: {
        id: {
          in: ids,
        },
        store: store,
      },
      select: {
        shopify_discount_id: true,
      },
    });
    processDiscounts(findDiscountIds, "deactivated");
    const updateDiscounts = await db.UpsellBuilder.updateMany({
      where: {
        id: {
          in: ids,
        },
        store: store,
      },
      data: updateStatus,
    });
    const updateddata = await db.UpsellBuilder.findMany({
      where: {
        store: store,
      },
    });
    return json({
      success: true,
      message: "DEACTIVATED  successfully",
      data: updateddata,
    });
  } else if (actionType == "deleted") {
    const updateDiscounts = await db.UpsellBuilder.deleteMany({
      where: {
        id: {
          in: ids,
        },
        store: store,
      },
    });
    const updateddata = await db.UpsellBuilder.findMany({
      where: {
        store: store,
      },
    });
    return json({
      success: true,
      message: "Delete successfully",
      data: updateddata,
    });
  } else {
    const updateDiscounts = await db.UpsellBuilder.updateMany({
      where: {
        id: id,
      },
      data: data,
    });
    const updateddata = await db.UpsellBuilder.findFirst({
      where: {
        id: id,
      },
    });
    return json({
      success: true,
      message: "Updated  successfully",
      data: updateddata,
    });
  }
};
