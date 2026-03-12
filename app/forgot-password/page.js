"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const ForgotPassword = dynamic(() => import("./ForgotPassword"), {
  ssr: false,
});

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPassword />
    </Suspense>
  );
}
