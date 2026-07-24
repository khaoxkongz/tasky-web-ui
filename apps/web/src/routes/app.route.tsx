import {
  createFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import {
  SidebarInset,
  SidebarProvider,
} from "@tasky-web-ui/ui/components/sidebar";

import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@tasky-web-ui/ui/lib/utils";

function RouteComponent() {
  const { isLoading, isTransitioning } = useRouterState();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset
        className={cn({
          "opacity-50 pointer-events-none": isLoading || isTransitioning,
        })}
      >
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Route = createFileRoute("/app")({
  component: RouteComponent,
});
