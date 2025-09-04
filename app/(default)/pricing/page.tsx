"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "@heroicons/react/20/solid";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const runtime = "edge";

const tiers = [
  {
    name: "Small Pack",
    id: "small",
    productId: "pdt_E9ZadRXyaXpm1xZQ32hoa",
    href: "#",
    priceMonthly: "$3.99",
    unit: "lifetime",
    plan: "one-time",
    amount: 399,
    currency: "usd",
    credits: 30,
    features: [
      "50 Credits",
      "Credits lifetime access",
      "All AI models access",
      "Private generation",
      "No watermark outputs",
      "Priority support"
    ],
    featured: false,
  },
  {
    name: "Medium Pack",
    id: "medium",
    productId: "pdt_sIDbkBVwcPrSOzxmBnBmf",
    href: "#",
    priceMonthly: "$9.99",
    unit: "lifetime",
    plan: "one-time",
    amount: 999,
    currency: "usd",
    credits: 200,
    features: [
      "200 Credits",
      "Credits lifetime access",
      "All AI models access",
      "Private generation",
      "No watermark outputs",
      "Priority support"
    ],
    featured: true,
  },
  {
    name: "Large Pack",
    id: "large",
    productId: "pdt_aLUDNcf5Pa6heH8ekpGCq",
    href: "#",
    priceMonthly: "$19.99",
    unit: "lifetime",
    plan: "one-time",
    amount: 1999,
    currency: "usd",
    credits: 500,
    features: [
      "500 Credits",
      "Credits lifetime access",
      "All AI models access",
      "Private generation",
      "No watermark outputs",
      "Priority support"
    ],
    featured: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function () {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (
    plan: string,
    amount: number,
    currency: string,
    credits: number,
    productId: string
  ) => {
    try {
      const params = {
        plan: plan,
        credits: credits,
        amount: amount,
        currency: currency,
        productId: productId,
      };

      setLoading(true);
      const response = await fetch("/api/checkout/onetime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (response.status === 401) {
        setLoading(false);

        toast.error("need login");
        router.push("/sign-in");
        return;
      }

      const { code, message, data } = await response.json();
      if (!data) {
        setLoading(false);

        toast.error(message);
        return;
      }
      const { checkoutUrl } = data;
      
      router.push(checkoutUrl)
      /*
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (response.status === 401) {
        setLoading(false);

        toast.error("need login");
        router.push("/sign-in");
        return;
      }

      const { code, message, data } = await response.json();
      if (!data) {
        setLoading(false);

        toast.error(message);
        return;
      }
      const { public_key, session_id } = data;

      const stripe = await loadStripe(public_key);
      if (!stripe) {
        setLoading(false);

        toast.error("checkout failed");
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session_id,
      });
      console.log("result", result);

      if (result.error) {
        setLoading(false);

        // 处理错误
        toast.error(result.error.message);
      }
      */  
    } catch (e) {
      setLoading(false);

      console.log("checkout failed: ", e);

      toast.error("checkout failed");
    }
  };

  // 修改渲染部分的网格布局
  return (
    <div className="relative isolate bg-white px-6 py-8 md:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-6xl">
          Credit Packs
        </h1>
      </div>
      <h2 className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
        Buy credits once and use them whenever you need.
      </h2>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-6xl lg:grid-cols-3">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured
                ? "relative bg-white shadow-2xl"
                : "bg-white/60 sm:mx-8 lg:mx-0",
              tier.featured
                ? ""
                : tierIdx === 0
                ? "rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl"
                : "sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none",
              "rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10"
            )}
          >
            <p
              id={tier.id}
              className="text-base font-semibold leading-7 text-indigo-600"
            >
              {tier.name}
            </p>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-5xl font-bold tracking-tight text-gray-900">
                {tier.priceMonthly}
              </span>
              <span className="text-base text-gray-500">{tier.unit}</span>
            </p>
            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600 sm:mt-10"
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className="h-6 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="mt-8 w-full text-white"
              disabled={loading}
              onClick={() => {
                handleCheckout(
                  tier.plan,
                  tier.amount,
                  tier.currency,
                  tier.credits,
                  tier.productId
                );
              }}
            >
              {loading ? "Processing..." : "One Time Purchase"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
