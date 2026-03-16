import AllTagsClient from "./AllTagsClient";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Loading from "@/components/Loading";

export default async function AllTagsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AllTagsClient />
    </Suspense>
  );
}
