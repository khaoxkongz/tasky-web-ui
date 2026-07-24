import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/tanstack-react-start";
import { Button } from "@tasky-web-ui/ui/components/button";
import { SidebarTrigger } from "@tasky-web-ui/ui/components/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@tasky-web-ui/ui/components/tooltip";
import { cn } from "@tasky-web-ui/ui/lib/utils";
import * as React from "react";

import { KbdWrapper } from "./kbd-wrapper";

type TopAppBarProps = React.ComponentProps<"div"> & {
  title: string;
  tasksCount?: number;
};

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  tasksCount,
  className,
  ...props
}) => {
  const [showTitle, setShowTitle] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowTitle(window.scrollY > 70);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        "sticky top-0 grid h-16 grid-cols-[40px_minmax(0,1fr)_40px] items-center bg-background px-4",
        showTitle && "border-b",
        className
      )}
      {...props}
    >
      <Tooltip>
        <TooltipTrigger render={<SidebarTrigger className="-ml-1" />} />
        <TooltipContent>
          <span>Toggle sidebar</span>

          <KbdWrapper kbdList={["Ctrl", "B"]} />
        </TooltipContent>
      </Tooltip>

      <div
        className={cn(
          "mx-auto max-w-120 text-center transition-[transform,opacity]",
          showTitle ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        )}
      >
        <p className="truncate font-semibold">{title}</p>

        {Boolean(tasksCount) && (
          <p className="text-muted-foreground text-xs">{tasksCount} tasks</p>
        )}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm">Sign up</Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </div>
  );
};
