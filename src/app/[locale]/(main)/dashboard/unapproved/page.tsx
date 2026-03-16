import { Metadata } from "next";
import UnapprovedTagsClient from "./UnapprovedTagsClient";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Loading from "@/components/Loading";

export default async function UnapprovedTagsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <UnapprovedTagsClient />
    </Suspense>
  );
}
