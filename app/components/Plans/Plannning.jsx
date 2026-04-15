import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";
import Script from "next/script";

function PricingCard({ plan }) {
  const handlePayment = async (planKey, planName) => {
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planKey,
      }),
    });

    if (!res.ok) {
      toast.error("Failed to create payment order");
      return;
    }

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Habitory",
      description: `${planName} Plan`,
      order_id: order.id,

      handler: async function (response) {
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...response,
            planKey,
          }),
        });

        if (!verifyRes.ok) {
          toast.error("Payment verification failed");
          return;
        }

        toast.success("Payment successful. Subscription activated.");
      },

      // Use project accent color instead of hard black so popup matches theme
      theme: {
        color: "#C08457",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Card
        className={`relative hover:shadow-xl transition-all duration-300 ${
          plan.recommended ? "border-2 border-[#C08457]" : ""
        }`}
      >
        {plan.recommended && (
          <span className="absolute top-3 right-3 text-xs bg-[#C08457] text-white px-2 py-1 rounded">
            Most Popular
          </span>
        )}

        <CardHeader>
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          <p className="text-3xl font-bold mt-2">₹{plan.price} / Month</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="font-medium">{plan.tips}</p>

          <div className="space-y-2">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-[#C08457]" />
                {feature}
              </div>
            ))}
          </div>

          <Button
            className="w-full mt-4 bg-[#C08457] hover:opacity-90 text-white"
            onClick={() => handlePayment(plan.key, plan.name)}
          >
            Subscribe to {plan.name}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
export default PricingCard;
