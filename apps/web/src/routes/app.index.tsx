import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";

function RouteComponent() {
  const navigate = useNavigate();

  navigate({
    from: "/app",
    to: "/app/inbox",
  });

  return <Outlet />;
}

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});
