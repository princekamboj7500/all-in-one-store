import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useChangeLanguage } from "remix-i18next/react";
import { useTranslation } from "react-i18next";
import i18next from "./i18next.server";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import React, { useEffect, useState } from 'react';
export async function loader({ request }) {
 
 
  let locale_test = await i18next.getLocale(request);

var URI = new URL(request.url);
const url = new URL(URI);

const lt = url.searchParams.get('locale');
  
let locale = lt || 'fr';

return json({ locale });
}

export default function App() {

  let { locale } = useLoaderData();
	let { i18n } = useTranslation();


  return (
    <html lang={locale}  >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = ${JSON.stringify({ env: { NODE_DEBUG: false } })}`,
          }}
        />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}