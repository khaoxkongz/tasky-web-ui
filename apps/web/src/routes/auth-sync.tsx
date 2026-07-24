import { useAuth } from "@clerk/tanstack-react-start";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";

function RouteComponent() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, userId } = useAuth();

  React.useEffect(() => {
    // Remove clerkUserId from localStorage when the user is not signed in
    if (isLoaded && !isSignedIn) {
      // Remove clerkUserId from localStorage if it exists
      if (localStorage.getItem("clerkUserId")) {
        localStorage.removeItem("clerkUserId");
      }

      navigate({
        from: "/auth-sync",
        to: "/",
      });
    }

    // Set clerkUserId in localStorage when the user is signed in
    if (isLoaded && isSignedIn) {
      // Set clerkUserId to the user's ID
      localStorage.setItem("clerkUserId", userId);

      navigate({
        from: "/auth-sync",
        to: "/app/inbox",
      });
    }
  }, [isLoaded, isSignedIn, userId, navigate]);

  return <></>;
}

export const Route = createFileRoute("/auth-sync")({
  component: RouteComponent,
});
