import { insertOrder, updateOrderSession } from "@/models/order";
import { respData, respErr } from "@/lib/resp";

import { Order } from "@/types/order";
import { currentUser } from "@clerk/nextjs";
import { findUserByEmail } from "@/models/user";
import { genOrderNo } from "@/lib/order";

export const runtime = "edge";

export const maxDuration = 60;

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
    return respErr("not login");
  }
  const user_email = user.emailAddresses[0].emailAddress;

  try {
    const { credits, currency, amount, plan, productId } = await req.json();
    if (!credits || !amount || !plan || !currency) {
      return respErr("invalid params");
    }

    if (!["monthly", "one-time"].includes(plan)) {
      return respErr("invalid plan");
    }

    let user_uuid = "";
    const user_info = await findUserByEmail(user_email);
    if (user_info && user_info.uuid) {
      user_uuid = user_info.uuid;
    }

    const order_no = genOrderNo();

    const currentDate = new Date();
    const oneMonthLater = new Date(currentDate);
    oneMonthLater.setMonth(currentDate.getMonth() + 1);

    const created_at = currentDate.toISOString();
    const expired_at = oneMonthLater.toISOString();

    const order: Order = {
      order_no: order_no,
      created_at: created_at,
      user_email: user_email,
      amount: amount,
      plan: plan,
      expired_at: expired_at,
      order_status: 1,
      credits: credits,
      currency: currency,
      user_uuid: user_uuid,
    };
    await insertOrder(order);
    console.log("create new order: ", order);
    
    const redirect_url = `${process.env.WEB_BASE_URI}/pay-result`
    let checkoutUrl = `${process.env.DODO_PAYMENTS_BASE_URI}/buy/${productId}?quantity=1&metadata_orderNo=${order_no}&redirect_url=${redirect_url}`
    return respData({
        checkoutUrl: checkoutUrl,
    });
  } catch (e) {
    console.log("checkout failed: ", e);
    return respErr("checkout failed");
  }
}
