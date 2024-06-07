import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

import db from "../db.server";
export const action = async ({ request }) => {
    const { session,admin } = await authenticate.admin(request);











}