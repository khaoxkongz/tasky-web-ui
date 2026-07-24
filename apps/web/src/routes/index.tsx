import { useAuth } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";

import { logo } from "@/assets";

function RouteComponenet() {
  const { isLoaded, isSignedIn } = useAuth();

  const isAuthenticated = isLoaded && isSignedIn;

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden">
      <header />

      <main className="grid grow grid-cols-1 items-center pt-36 pb-16" />

      <footer />

      <div className="bg-primary/20 absolute top-20 left-0 h-10 w-80 origin-top-left rotate-45 blur-3xl" />
      <div className="bg-primary/20 absolute top-20 right-0 h-10 w-80 origin-top-right rotate-45 blur-3xl" />

      {!isAuthenticated && (
        <div className="bg-background fixed top-0 left-0 z-50 flex h-dvh w-full flex-col items-center justify-center gap-5">
          <img src={logo} alt="Tasky AI" width={64} height={64} />
          <Loader2Icon className="text-muted-foreground animate-spin" />
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: RouteComponenet,
});
