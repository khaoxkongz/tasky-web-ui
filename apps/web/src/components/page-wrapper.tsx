import { cn } from "@tasky-web-ui/ui/lib/utils";
import * as React from "react";

export const Page: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => <div className={cn("container md:max-w-svh", className)} {...props} />;

export const PageHeader: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => (
  <div
    className={cn("space-y-2 pt-2 pb-3 md:px-4 lg:px-10", className)}
    {...props}
  />
);

export const PageTitle: React.FC<React.ComponentProps<"h1">> = ({
  className,
  ...props
}) => <h1 className={cn("text-2xl font-semibold", className)} {...props} />;

export const PageList: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => (
  <div className={cn("pt-2 pb-20 md:px-4 lg:px-10", className)} {...props} />
);
