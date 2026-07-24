import { Kbd, KbdGroup } from "@tasky-web-ui/ui/components/kbd";
import { cn } from "@tasky-web-ui/ui/lib/utils";
import * as React from "react";

type KbdWrapperProps = React.ComponentProps<typeof KbdGroup> & {
  kbdList: Array<string>;
};

export const KbdWrapper: React.FC<KbdWrapperProps> = ({
  kbdList,
  className,
  ...props
}) => (
  <KbdGroup className={cn("", className)} {...props}>
    <span className="sr-only">Keyboard shortcut is, </span>

    {kbdList.map((k) => (
      <Kbd key={k}>{k}</Kbd>
    ))}
  </KbdGroup>
);
