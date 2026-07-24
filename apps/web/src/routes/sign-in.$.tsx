import { SignIn } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

function RouteComponent() {
  return (
    <section>
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <SignIn />
      </div>
    </section>
  );
}

export const Route = createFileRoute("/sign-in/$")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title:
          "Create an Account - Tasky AI to-do List & Project Management App",
      },
    ],
  }),
});
