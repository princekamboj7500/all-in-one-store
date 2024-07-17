import { json } from "@remix-run/node";
import db from "../db.server";



export const loader = async ({ request }) => {
  try {


    const query = new URL(request.url).searchParams.get("q");
    const shop = request.headers.get("X-Shop");
    const sessions = await db.session.findUnique({
      where: {
        shop: shop,
      },
      select: {
        shop: true,
        accessToken: true,
      },
    });
    console.log(sessions,"sessions0--")

    const myHeaders = new Headers();
    myHeaders.append("X-Shopify-Access-Token", sessions.accessToken);
    myHeaders.append("Content-Type", "application/json");
    const graphqlQuery = JSON.stringify({
      query: `{
        products(first: 250 query: "${query}") {
           edges {
            node {
              id
              handle
            }
          }
        }
      }`,
      variables: {},
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: graphqlQuery,
      redirect: "follow",
    };
    const result = await fetch(
      `https://${shop}/admin/api/2024-01/graphql.json`,
      requestOptions,
    );
    const response = await result.json();
    console.log(response,"response--")
    const responsedata = response.data.products.edges
    const data = responsedata.map(item => {
      const pId = item.node.id.split("/").pop();
      return {
        id: pId,
        handle: item.node.handle,

      };
    });

    return json({ mesasge: "created", data: data })
  } catch (e) {
    return json({ mesasge: "error", error: e, data: [] })
  }
}