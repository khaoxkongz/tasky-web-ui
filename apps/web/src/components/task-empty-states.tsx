import { cn } from "@tasky-web-ui/ui/lib/utils";
import * as React from "react";

import {
  completedTaskEmptyState,
  inboxTaskEmptyState,
  projectTaskEmptyState,
  todayTaskEmptyState,
  upcomingTaskEmptyState,
} from "@/assets";

type EmptyStateType = "inbox" | "today" | "upcoming" | "completed" | "project";

interface EmptyStateContent {
  img?: {
    src: string;
    width: number;
    height: number;
  };
  title: string;
  description: string;
}

const emptyStates: Record<EmptyStateType, EmptyStateContent> = {
  completed: {
    description:
      "All the tasks you’ve completed will appear here. Keep up the great work!",
    img: {
      height: 260,
      src: completedTaskEmptyState,
      width: 231,
    },
    title: "You’ve been productive!",
  },
  inbox: {
    description:
      "Capture tasks that don’t have a specific category. Click + to add a task.",
    img: {
      height: 260,
      src: inboxTaskEmptyState,
      width: 344,
    },
    title: "What’s on your mind?",
  },
  project: {
    description:
      "Add tasks specific to this project. Click + to start planning.",
    img: {
      height: 260,
      src: projectTaskEmptyState,
      width: 228,
    },
    title: "Let’s build something amazing!",
  },
  today: {
    description:
      "By default, tasks added here will be due today. Click + to add a task.",
    img: {
      height: 260,
      src: todayTaskEmptyState,
      width: 226,
    },
    title: "What do you need to get done today?",
  },
  upcoming: {
    description:
      "Tasks added here will be due in the future. Click + to schedule a task.",
    img: {
      height: 260,
      src: upcomingTaskEmptyState,
      width: 208,
    },
    title: "Plan ahead with ease!",
  },
};

type TaskEmptyStateProps = React.ComponentProps<"div"> & {
  type?: EmptyStateType;
};

export const TaskEmptyState: React.FC<TaskEmptyStateProps> = ({
  type = "inbox",
  className,
  ...props
}) => {
  const { img, title, description } = emptyStates[type];

  return (
    <div
      className={cn(
        "mx-auto flex max-w-90 flex-col items-center pt-10 text-center",
        className
      )}
      {...props}
    >
      {img && (
        <figure>
          <img
            src={img.src}
            alt={title}
            width={img.width}
            height={img.height}
          />
        </figure>
      )}

      <p className="mt-4 mb-2">{title}</p>
      <p className="text-muted-foreground px-4 text-sm">{description}</p>
    </div>
  );
};
