import { isAdminAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function AdminProtect({ children }: { children: React.ReactNode }) {
  if (!isAdminAuthenticated()) redirect("/admin");
  return <>{children}</>;
}
