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
      amount: 8.99,
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
      console.log("i m called Noww")
      shopify.registerWebhooks({ session });
  
console.log("session=-----",session)
      console.log("I m called")
      const stores = await db.stores.findUnique({
        where: {
          store: session.shop,
        },
        select: {
          id: true,
        },
      });

      if (stores) {
        const data = {
          token: session.accessToken,
          name: stores.name,
        };
        const updatedData = await db.stores.update({
          where: { store: session.shop },
          data: data,
        });
      } else {
        try {
          const insertedData = await db.stores.create({
            data: {
              store: session.shop,
              token: session.accessToken,
            },
          });

const appSettingsData = {
  show_on_desktop: 1, 
  show_on_mobile: 1, 
  button_color: '#0000',
  fill_animation: 0,
  theme_icon: 'SvgIcon1',
};
const appSettingsDataJson = JSON.stringify(appSettingsData);
          const appsettings = await db.AppSettings.create({
            data:{
              store_id :parseInt(insertedData.id),
              isActive :false,
              app_name:"Sticky Add To Cart",
              appJsonData :appSettingsDataJson ,
    }
          })
         
        } catch (err) {
          console.log(err, "there is error while insertting data");
        }
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
