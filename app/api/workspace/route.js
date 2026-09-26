import {
  context,
  sameOrigin,
  billingError,
  BillingError,
} from "@/app/lib/billing/access";
import { Workspace } from "@/app/models/Billing";
export async function PATCH(request) {
  try {
    sameOrigin(request);
    const { workspace } = await context();
    const body = await request.json();
    if (
      !["personal", "business"].includes(body.type) ||
      typeof body.name !== "string" ||
      !body.name.trim() ||
      body.name.length > 120 ||
      typeof body.billingAddress !== "string" ||
      body.billingAddress.length > 1000 ||
      typeof body.contactEmail !== "string" ||
      body.contactEmail.length > 254 ||
      (body.contactEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.contactEmail))
    )
      throw new BillingError("Check your workspace details.");
    if (
      body.logo &&
      (typeof body.logo !== "string" ||
        body.logo.length > 2000 ||
        !/^https:\/\//.test(body.logo))
    )
      throw new BillingError("Use an HTTPS logo URL.");
    await Workspace.updateOne(
      { _id: workspace._id },
      {
        type: body.type,
        name: body.name.trim(),
        contactEmail: body.contactEmail,
        billingAddress: body.billingAddress,
        logo: body.logo || "",
      },
    );
    return Response.json({ success: true });
  } catch (error) {
    return billingError(error);
  }
}
