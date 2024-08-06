import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
  BillingInterval,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-04";
import prisma from "./db.server";
import db from "./db.server";
export const MONTHLY_PLAN = "Monthly subscription";
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.April24,
  billing: {
    [MONTHLY_PLAN]: {
      amount: process.env.APP_PRICE,
      currencyCode: "USD",
      trialDays: 30,
      interval: BillingInterval.Every30Days,
    },
  },
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks",
    },
  },
  hooks: {
    afterAuth: async ({ session }) => {
      shopify.registerWebhooks({ session });
      const response = await admin.graphql(`query {
        currentAppInstallation {
          id
          metafields(first: 6) {
            edges {
              node {
                namespace
                key
                value
              }
            }
          }
        }
      }`);
      const result = await response.json();
       const appId = result.data.currentAppInstallation.id;
       console.log(appId,"appId_______________")
      try {
        const createMetafield = await admin.graphql(
          `#graphql
    mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafieldsSetInput) {
    metafields {
      id
      namespace
      key
    }
    userErrors {
      field
      message
    }
    }
    }`,
          {
            variables: {
              metafieldsSetInput: [
                {
                  namespace: "AllInOneStore",
                  key: "status",
                  type: "boolean",
                  value: "false",
                  ownerId: appId,
                },
              ],
            },
          },
        );
        const response  = await createMetafield.json();
        console.log(response.data.metafieldsSet.metafields,"craeted successfulyy");
      } catch (err) {
        console.log(err, "errr");
      }
    },
  },
  future: {
    v3_webhookAdminContext: true,
    v3_authenticatePublic: true,
    v3_lineItemBilling: true,
    unstable_newEmbeddedAuthStrategy: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.April24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
