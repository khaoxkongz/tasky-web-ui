import { BotIcon, CheckIcon, ChevronDownIcon, CircleIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@tasky-web-ui/ui/lib/utils";

import { PROJECT_COLORS } from "@/assets/constants";

import type { ProjectForm as IProjectForm, Project as IProject } from "@/types";
import { Button } from "@tasky-web-ui/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tasky-web-ui/ui/components/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@tasky-web-ui/ui/components/command";
import { Input } from "@tasky-web-ui/ui/components/input";
import { Label } from "@tasky-web-ui/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@tasky-web-ui/ui/components/popover";
import { ScrollArea } from "@tasky-web-ui/ui/components/scroll-area";
import { Separator } from "@tasky-web-ui/ui/components/separator";
import { Switch } from "@tasky-web-ui/ui/components/switch";
import { Textarea } from "@tasky-web-ui/ui/components/textarea";

const DEFAULT_PROJECT_NAME = "Untitled";
const _DEFAULT_PROJECT_COLOR_NAME = "Slate";
const DEFAULT_PROJECT_COLOR_HEX = "#64748b";

const DEFAULT_FORM_DATA: IProject = {
  id: "",
  name: DEFAULT_PROJECT_NAME,
  colorName: _DEFAULT_PROJECT_COLOR_NAME,
  colorHex: DEFAULT_PROJECT_COLOR_HEX,
};

interface ProjectFormProps {
  defaultValues: IProject;
  mode?: "create" | "edit";
  onSubmit?: (values: IProjectForm) => void;
  onClose?: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  defaultValues = DEFAULT_FORM_DATA,
  mode = "create",
  onSubmit,
  onClose,
}) => {
  const [projectName, setProjectName] = React.useState(
    defaultValues?.name ?? DEFAULT_PROJECT_NAME
  );
  const [projectNameCharCount, setProjectNameCharCount] = React.useState(
    projectName.length
  );
  const [projectColorName, setProjectColorName] = React.useState(
    defaultValues?.colorName ?? _DEFAULT_PROJECT_COLOR_NAME
  );
  const [projectColorHex, setProjectColorHex] = React.useState(
    defaultValues?.colorHex ?? DEFAULT_PROJECT_COLOR_HEX
  );

  const [colorOpen, setColorOpen] = React.useState(false);

  const [aiTaskGen, setAiTaskGen] = React.useState(false);
  const [taskGenPrompt, setTaskGenPrompt] = React.useState("");

  const [formData, setFormData] = React.useState<IProjectForm>({
    ...defaultValues,
    aiTaskGen,
    taskGenPrompt,
  });

  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: projectName ?? "",
      colorName: projectColorName ?? _DEFAULT_PROJECT_COLOR_NAME,
      colorHex: projectColorHex ?? DEFAULT_PROJECT_COLOR_HEX,
      aiTaskGen,
      taskGenPrompt,
    }));
  }, [
    projectName,
    projectColorName,
    projectColorHex,
    aiTaskGen,
    taskGenPrompt,
  ]);

  const handleSubmit = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      onSubmit?.(formData);
    },
    [formData, onSubmit]
  );

  const handleKeySubmit = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit?.(formData);
      }
    },
    [formData, onSubmit]
  );

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle>
          {mode === "create" ? "Create Project" : "Edit Project"}
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="grid grid-cols-1 gap-2 p-4">
        <div>
          <Label htmlFor="projectName">Name</Label>
          <Input
            type="text"
            id="projectName"
            name="projectName"
            className="mt-2 mb-1"
            value={projectName}
            onInput={(e) => {
              setProjectName(e.currentTarget.value);
              setProjectNameCharCount(e.currentTarget.value.length);
            }}
            maxLength={120}
            defaultValue={defaultValues?.name}
            onKeyDown={handleKeySubmit}
          />

          <div
            className={cn(
              "text-muted-foreground ms-auto max-w-max text-xs",
              projectNameCharCount >= 110 && "text-destructive"
            )}
          >
            {projectNameCharCount}/120
          </div>

          <div>
            <Label htmlFor="projectColor">Color</Label>
            <Popover modal={true} open={colorOpen} onOpenChange={setColorOpen}>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2 w-full"
                    id="projectColor"
                  />
                }
              >
                <CircleIcon fill={projectColorHex} />
                <span>{projectColorName}</span>
                <ChevronDownIcon className="ms-auto" />
              </PopoverTrigger>
              <PopoverContent align="start" className="w-119.5 p-0 max-sm:w-90">
                <Command>
                  <CommandInput placeholder="Search color..." />
                  <CommandList>
                    <ScrollArea>
                      <CommandEmpty>No color found.</CommandEmpty>

                      <CommandGroup>
                        {PROJECT_COLORS.map(({ name, hex }) => (
                          <CommandItem
                            key={name}
                            value={`${name}-${hex}`}
                            onSelect={(value) => {
                              const [selectedName, selectedHex] =
                                value.split("-");

                              setProjectColorName(selectedName);
                              setProjectColorHex(selectedHex);
                              setColorOpen(false);
                            }}
                          >
                            <CircleIcon fill={hex} />
                            <span className="text-muted-foreground text-xs">
                              {name}
                            </span>
                            {projectColorName === name && (
                              <CheckIcon className="ms-auto" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </ScrollArea>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {mode === "create" && (
            <div className="mt-6 rounded-md border">
              <div className="flex items-center gap-3 px-3 py-2">
                <BotIcon className="text-muted-foreground shrink-0" />

                <div className="me-auto! space-y-0.5">
                  <Label htmlFor="aiGenerate" className="block text-sm">
                    AI Task Generator
                  </Label>

                  <p className="text-muted-foreground text-xs">
                    Automatically create tasks by providing a simple prompt.
                  </p>
                </div>

                <Switch id="aiGenerate" onCheckedChange={setAiTaskGen} />
              </div>

              {aiTaskGen && (
                <Textarea
                  autoFocus
                  className="border-none"
                  value={taskGenPrompt}
                  onChange={(e) => setTaskGenPrompt(e.currentTarget.value)}
                  placeholder="Tell me about your project. What you want to accomplish?"
                  onKeyDown={handleKeySubmit}
                />
              )}
            </div>
          )}
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-end gap-3 p-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button
          type="button"
          disabled={!projectName || (aiTaskGen && !taskGenPrompt)}
          onClick={handleSubmit}
        >
          {mode === "create" ? "Add" : "Save"}
        </Button>
      </CardFooter>
    </Card>
  );
};
