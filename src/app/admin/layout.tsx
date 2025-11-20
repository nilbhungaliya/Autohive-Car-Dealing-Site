import { auth } from "@/auth";
import { routes } from "@/config/routes";
import { AdminHeader } from "@/components/layouts/admin-header";
import { AdminSidebar } from "@/components/layouts/admin-sidebar";
import type { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { AI } from "../_actions/ai";

export default async function AdminLayout({ children }: PropsWithChildren) {
  const session = await auth();

  if (!session?.user) {
    redirect(routes.signIn);
  }

  return (
    <AI>
      <div className="flex bg-background text-foreground min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader />
          <main className="admin-scrollbar flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 overflow-auto bg-background text-white">
            {children}
          </main>
        </div>
      </div>
    </AI>
  );
}
