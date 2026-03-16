import { Metadata } from "next";
import UsersClient from "./UsersClient";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Loading from "@/components/Loading";

export default async function UsersPage() {
  return (
    <Suspense fallback={<Loading />}>
      <UsersClient />
    </Suspense>
  );
}
