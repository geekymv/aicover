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
    name: "Free",
    id: "free",
    href: "#",
    priceMonthly: "$0",
    unit: "forever",
    plan: "free",
    amount: 0,
    currency: "usd",
    credits: 5,
    description: "Start creating for free",
    features: [
      "5 coloring pages per day",
      "Basic templates access",
      "Standard quality",
      "PNG download format",
      "Community support",
    ],
    featured: false,
  },
  {
    name: "Basic",
    id: "basic",
    href: "#",
    priceMonthly: "$4.99",
    unit: "per month",
    plan: "monthly",
    amount: 499,
    currency: "usd",
    credits: 100,
    description: "Perfect for casual users",
    features: [
      "Generate 100 coloring pages per month",
      "Access to basic templates",
      "Standard generation speed",
      "Download in PNG format",
      "Basic customization options",
    ],
    featured: true,
  },
  {
    name: "Pro",
    id: "pro",
    href: "#",
    priceMonthly: "$9.99",
    unit: "per month",
    plan: "monthly",
    amount: 999,
    currency: "usd",
    credits: 999999,
    description: "For professional creators",
    features: [
      "Unlimited coloring pages",
      "Access to all premium templates",
      "Priority generation speed",
      "Download in multiple formats",
      "Advanced customization options",
      "Priority customer support",
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
    credits: number
  ) => {
    try {
      const params = {
        plan: plan,
        credits: credits,
        amount: amount,
        currency: currency,
      };

      setLoading(true);
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
          Choose Your Plan
        </h1>
      </div>
      <h2 className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
        Select a plan that best fits your creative needs
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
            <p className="mt-6 text-base leading-7 text-gray-600">
              {tier.description}
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
              className="mt-8 w-full"
              disabled={loading}
              onClick={() => {
                handleCheckout(
                  tier.plan,
                  tier.amount,
                  tier.currency,
                  tier.credits
                );
              }}
            >
              {loading ? "Processing..." : "Subscribe Now"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
