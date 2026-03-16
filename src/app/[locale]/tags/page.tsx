import TagTree from "@/components/TagTree";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Loading from "@/components/Loading";

export default async function TagsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TagTree />
    </Suspense>
  );
}
