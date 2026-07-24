import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  retainSearchParams,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { PlusIcon, SearchIcon } from "lucide-react";
import * as React from "react";
import { z } from "zod/v4";

import { Button } from "@tasky-web-ui/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@tasky-web-ui/ui/components/input-group";
import { cn } from "@tasky-web-ui/ui/lib/utils";

import {
  Page,
  PageHeader,
  PageList,
  PageTitle,
} from "@/components/page-wrapper";
import { ProjectCard } from "@/components/project-card";
import {
  ProjectFormDialog,
  ProjectFormDialogContent,
  ProjectFormDialogContextProvider,
} from "@/components/project-form-dialog";
import { TopAppBar } from "@/components/top-app-bar";
import { orpc } from "@/utils/orpc";

function RouteComponent() {
  const [open, setOpen] = React.useState(false);

  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/app/projects/" });

  const { data, isLoading, isPending } = useQuery(
    orpc.projects.getAll.queryOptions({
      input: { q },
    })
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    navigate({
      to: "/app/projects",
      search: { q: value },
    });
  };

  return (
    <>
      <TopAppBar title="My Projects" />

      <Page>
        <PageHeader>
          <div className="flex items-center gap-2">
            <PageTitle>My Projects</PageTitle>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Create a Project"
              onClick={() => setOpen(true)}
            >
              <PlusIcon />
            </Button>
          </div>

          <InputGroup>
            <InputGroupInput
              type="search"
              placeholder="Search..."
              onChange={handleSearch}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            {q ? (
              <InputGroupAddon align="inline-end">
                {data?.length} results
              </InputGroupAddon>
            ) : null}
          </InputGroup>
        </PageHeader>

        <PageList>
          <div className="flex h-8 items-center border-b">
            <div className="text-sm">{data?.length} projects</div>
          </div>

          {isLoading ? null : !data || data?.length === 0 ? (
            <div className="text-muted-foreground flex h-14 items-center justify-center">
              <span>No project found</span>
            </div>
          ) : (
            <div className={cn("", isPending ? "opacity-25" : "")}>
              {data.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </PageList>
      </Page>

      <ProjectFormDialogContextProvider open={open} setOpen={setOpen}>
        <ProjectFormDialog>
          <ProjectFormDialogContent />
        </ProjectFormDialog>
      </ProjectFormDialogContextProvider>
    </>
  );
}

const defaultValues = {
  q: "",
};

const searchSchema = z.object({
  q: z.string().default(defaultValues.q),
});

export const Route = createFileRoute("/app/projects/")({
  head: () => ({
    meta: [
      {
        title: "My Projects - Tasky AI",
      },
    ],
  }),
  validateSearch: searchSchema,
  search: {
    middlewares: [
      retainSearchParams(["q"]),
      stripSearchParams({ q: defaultValues.q }),
    ],
  },
  loaderDeps: ({ search }) => ({
    search,
  }),
  component: RouteComponent,
});
