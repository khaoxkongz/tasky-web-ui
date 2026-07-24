import { SignUp } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

function RouteComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}

export const Route = createFileRoute("/sign-up/$")({
  component: RouteComponent,
});
