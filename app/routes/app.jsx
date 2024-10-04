import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate,MONTHLY_PLAN  } from "../shopify.server";
import { useTranslation } from "react-i18next";
export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  const { billing, session  } = await authenticate.admin(request);
  const appTest = false;


  await billing.require({
    plans: [MONTHLY_PLAN],
    isTest: appTest,
    onFailure: async () => billing.request({ plan: MONTHLY_PLAN, isTest: appTest, returnUrl: 'https://'+ session.shop+'/admin/apps/' + process.env.SHOPIFY_API_KEY + '/app/billing' }),
  });

  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export default function App() {
  const { apiKey } = useLoaderData();
  let { t } = useTranslation();
  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
         All -In one store
        </Link>
       </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
 
  const error = useRouteError();
  console.log("Error occurred:", error);
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
