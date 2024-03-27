"use client";

import { setUser } from "@/slices/userSlice";
import useAsync from "@/utils/hooks/useAsync";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  const { user: clerkUser } = useUser();
  const userId = clerkUser?.id;

  //   const { execute, value, status } = useAsync(async () => {
  //     if (!userId) return;
  //     const { data: user } = await axios.get(`/api/v1/user/${userId}`);

  //     dispatch(
  //       setUser({
  //         email: user.email,
  //         id: user.id,
  //         imageUrl: user.image_url,
  //         firstName: user.first_name,
  //         lastName: user.last_name,
  //         stripeCustomerId: user.stripe_customer_id,
  //         paymentMethodId: user.payment_method_id,
  //         billingAddress: user.billing_address,
  //         subscriptionPlan: user.subscription_plan,
  //         subscriptionIsActive: user.subscription_is_active,
  //       })
  //     );
  //   });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateUser = async () => {
    if (!userId) return;
    const { data: user } = await axios.get("/api/v1/user");

    console.log("%capp/(user)/layout.tsx:45 data", "color: #007acc;", user);

    dispatch(
      setUser({
        email: user.email,
        id: user.id,
        imageUrl: user.image_url,
        firstName: user.first_name,
        lastName: user.last_name,
        stripeCustomerId: user.stripe_customer_id,
        paymentMethod: user.payment_method,
        billingAddress: user.billing_address,
        subscriptionPlan: user.subscription_plan,
        subscriptionIsActive: user.subscription_is_active,
        subscriptionMetadata: user.subscription_metadata,
      })
    );
  };

  useEffect(() => {
    updateUser();
  }, [dispatch, updateUser, userId]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
