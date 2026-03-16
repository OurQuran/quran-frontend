import { ReactNode } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
export const dynamic = "force-dynamic";

export default function DashboardGroupLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
