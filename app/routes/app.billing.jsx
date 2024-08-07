import { authenticate } from "../shopify.server";
export const loader = async ({ request }) => {

    const { session, admin, redirect } = await authenticate.admin(request);
    const queryParams = new URLSearchParams(request.url.split('?')[1]);
    const chargeId = queryParams.get('charge_id');
    const reoccuringplan =
    await admin.rest.resources.RecurringApplicationCharge.find({
      session: session,
      id: chargeId,
    });
    if (reoccuringplan.status == "active") {

    }
    return redirect("/app");
}


