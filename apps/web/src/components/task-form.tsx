import * as chronoParser from "chrono-node";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  HashIcon,
  InboxIcon,
  SendHorizonalIcon,
  XIcon,
} from "lucide-react";
import * as React from "react";

import { Button } from "@tasky-web-ui/ui/components/button";
import { Calendar } from "@tasky-web-ui/ui/components/calendar";
import {
  Card,
  CardContent,
  CardFooter,
} from "@tasky-web-ui/ui/components/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@tasky-web-ui/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@tasky-web-ui/ui/components/popover";
import { ScrollArea } from "@tasky-web-ui/ui/components/scroll-area";
import { Separator } from "@tasky-web-ui/ui/components/separator";
import { Textarea } from "@tasky-web-ui/ui/components/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@tasky-web-ui/ui/components/tooltip";
import {
  cn,
  formatCustomDate,
  getTaskDueDateColorClass,
} from "@tasky-web-ui/ui/lib/utils";

import type { TaskForm as ITaskForm } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

const DEFAULT_PROJECT_NAME = "Untitled";
// const _DEFAULT_PROJECT_COLOR_NAME = "Slate";
const DEFAULT_PROJECT_COLOR_HEX = "#64748b";

const DEFAULT_TASK_FORM: ITaskForm = {
  completed: undefined,
  content: "",
  dueDate: null,
  id: undefined,
  projectId: null,
};

type TaskFormProps = {
  defaultValues?: ITaskForm;
  mode?: "create" | "edit";
  onSubmit?: (values: ITaskForm) => void;
  onCancel?: () => void;
} & Omit<React.ComponentProps<typeof Card>, "onSubmit" | "onCancel">;

export const TaskForm: React.FC<TaskFormProps> = ({
  defaultValues = DEFAULT_TASK_FORM,
  mode,
  onSubmit,
  onCancel,
  className,
  ...props
}) => {
  const [taskContent, setTaskContent] = React.useState(defaultValues.content);
  const [dueDate, setDueDate] = React.useState(defaultValues.dueDate);
  const [projectId, setProjectId] = React.useState(defaultValues.projectId);

  const [projectName, setProjectName] = React.useState(DEFAULT_PROJECT_NAME);
  const [projectColorHex, setProjectColorHex] = React.useState(
    DEFAULT_PROJECT_COLOR_HEX
  );

  const [dueDateOpen, setDueDateOpen] = React.useState(false);
  const [projectOpen, setProjectOpen] = React.useState(false);

  const [formData, setFormData] = React.useState(defaultValues);

  const { data } = useQuery(
    orpc.projects.getAll.queryOptions({ input: { q: "" } })
  );

  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      content: taskContent,
      dueDate,
      projectId,
    }));
  }, [taskContent, dueDate, projectId]);

  React.useEffect(() => {
    const parsedDate = chronoParser.parse(taskContent);

    if (parsedDate.length > 0) {
      const lastDate = parsedDate.at(-1);
      setDueDate(lastDate?.date() || null);
    }
  }, [taskContent]);

  const handleSubmit = React.useCallback(() => {
    if (!taskContent) {
      return;
    }

    onSubmit?.(formData);
  }, [taskContent, formData, onSubmit]);

  return (
    <Card
      className={cn("focus-within:border-foreground/30", className)}
      {...props}
    >
      <CardContent className="p-2">
        <Textarea
          className="mb-2 border-0 p-1 ring-0"
          placeholder="After finishing the project, Take a tour"
          autoFocus
          value={taskContent}
          onChange={(e) => setTaskContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />

        <div className="ring-border max-w-max rounded-md ring-1">
          <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(getTaskDueDateColorClass(dueDate, false))}
                />
              }
            >
              <CalendarIcon />
              <span>{dueDate ? formatCustomDate(dueDate) : "Due date"}</span>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                disabled={{ before: new Date() }}
                selected={dueDate ? new Date(dueDate) : undefined}
                onSelect={(selected) => {
                  setDueDate(selected || null);
                  setDueDateOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>

          {dueDate && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="-ms-2 px-2"
                    aria-label="Remove due date"
                    onClick={() => setDueDate(null)}
                  />
                }
              >
                <XIcon />
              </TooltipTrigger>

              <TooltipContent>
                <span>Remove due date</span>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="grid grid-cols-[minmax(0,1fr)_max-content] gap-2 p-2">
        <Popover modal open={projectOpen} onOpenChange={setProjectOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="max-w-max"
                aria-label="Inbox"
                role="combobox"
                aria-controls="project-list"
                aria-expanded={projectOpen}
              />
            }
          >
            {projectName ? <HashIcon color={projectColorHex} /> : <InboxIcon />}
            <span className="truncate">{projectName || "Inbox"}</span>
            <ChevronDownIcon />
          </PopoverTrigger>
          <PopoverContent className="w-60 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search project..." />

              <CommandList>
                <ScrollArea>
                  <CommandEmpty>No projects found</CommandEmpty>

                  <CommandGroup>
                    {data?.map((project) => (
                      <CommandItem
                        key={project.id}
                        onSelect={(value) => {
                          setProjectName(
                            value === projectName ? "" : project.name
                          );
                          setProjectId(value === projectId ? null : project.id);
                          setProjectColorHex(
                            value === projectColorHex ? "" : project.colorHex
                          );
                          setProjectOpen(false);
                        }}
                      >
                        <HashIcon color={project.colorHex} />
                        <span>{project.name}</span>

                        {projectName === project.name ? (
                          <CheckIcon className="ms-auto" />
                        ) : null}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onCancel}>
            <span className="max-md:hidden">Cancel</span>
            <XIcon className="max-md:hidden" />
          </Button>

          <Button disabled={!taskContent} onClick={handleSubmit}>
            <span className="max-md:hidden">
              {mode === "create" ? "Add task" : "Update task"}
            </span>
            <SendHorizonalIcon className="max-md:hidden" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
