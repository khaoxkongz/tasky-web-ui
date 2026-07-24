import { Button } from "@tasky-web-ui/ui/components/button";
import { cn } from "@tasky-web-ui/ui/lib/utils";
import { CirclePlusIcon } from "lucide-react";
import * as React from "react";

type TaskCreateButtonProps = React.ComponentProps<typeof Button>;

export const TaskCreateButton: React.FC<TaskCreateButtonProps> = ({
  className,
  ...props
}) => (
  <Button
    variant="link"
    className={cn("mb-4 w-full justify-start px-0", className)}
    {...props}
  >
    <CirclePlusIcon />
    <span>Create Task</span>
  </Button>
);
