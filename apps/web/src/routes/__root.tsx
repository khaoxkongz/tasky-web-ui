import { ClerkProvider } from "@clerk/tanstack-react-start";
import { shadcn } from "@clerk/ui/themes";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@tasky-web-ui/ui/components/sonner";
import type { orpc } from "@/utils/orpc";

import { TooltipProvider } from "@tasky-web-ui/ui/components/tooltip";
import appCss from "../index.css?url";

function RootDocument() {
  return (
    <ClerkProvider
      appearance={{
        theme: shadcn,
        variables: {
          // colorBackground: "hsl(20 14.3% 4.1%)",
          // colorText: "hsl(60 9.1% 97.8%)",
          colorDanger: "hsl(0 72.2% 50.6%)",
          // colorTextSecondary: "hsl(24 5.4% 63.9%)",
          // colorInputBackground: "hsl(20 14.3% 4.1%)",
          // colorInputText: "hsl(60 9.1% 97.8%)",
          // borderRadius: "0.35rem",
          // colorPrimary: "#CC7D5E",
          // colorTextOnPrimaryBackground: "hsl(60 9.1% 97.8%)",
        },
      }}
    >
      <TooltipProvider>
        <html lang="en" className="dark">
          <head>
            <HeadContent />
          </head>
          <body>
            <Outlet />
            <Toaster richColors position="top-center" />
            <TanStackRouterDevtools position="bottom-left" />
            <ReactQueryDevtools
              position="bottom"
              buttonPosition="bottom-right"
            />
            <Scripts />
          </body>
        </html>
      </TooltipProvider>
    </ClerkProvider>
  );
}

export interface RouterAppContext {
  orpc: typeof orpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "My App",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  component: RootDocument,
});
