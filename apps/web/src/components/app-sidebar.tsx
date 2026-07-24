import { Show, UserButton } from "@clerk/tanstack-react-start";
import { Link, useLocation } from "@tanstack/react-router";
import {
  ChevronRightIcon,
  CirclePlusIcon,
  HashIcon,
  MoreHorizontalIcon,
  PlusIcon,
} from "lucide-react";
import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@tasky-web-ui/ui/components/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@tasky-web-ui/ui/components/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@tasky-web-ui/ui/components/tooltip";

import { logo } from "@/assets";
import { SIDEBAR_LINKS } from "@/assets/constants";

import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { ProjectActionsMenu } from "./project-actions-menu";
import {
  ProjectFormDialog,
  ProjectFormDialogContent,
  ProjectFormDialogContextProvider,
} from "./project-form-dialog";
import {
  TaskFormDialog,
  TaskFormDialogContent,
  TaskFormDialogContextProvider,
} from "./task-form-dialog";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [openTaskForm, setOpenTaskForm] = React.useState(false);
  const [openProjectForm, setOpenProjectForm] = React.useState(false);

  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  const { data } = useQuery(
    orpc.projects.getAll.queryOptions({ input: { q: "" } })
  );

  const { data: inboxCount } = useQuery(orpc.tasks.inboxCount.queryOptions());
  const { data: todayCount } = useQuery(orpc.tasks.todayCount.queryOptions());
  const { data: upcomingCount } = useQuery(
    orpc.tasks.upcomingCount.queryOptions()
  );
  const { data: completeCount } = useQuery(
    orpc.tasks.completeCount.queryOptions()
  );

  return (
    <React.Fragment>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img
                    src={logo}
                    alt="logo"
                    width={24}
                    height={24}
                    className="size-6"
                  />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Tasky AI</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setOpenTaskForm(true)}>
                    <CirclePlusIcon className="text-primary!" />
                    <span>Add task</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {SIDEBAR_LINKS.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link to={item.href} />}
                      isActive={item.href === pathname}
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>

                    {/* Show task count in inbox menu items */}
                    {item.href === "/app/inbox" ? (
                      <SidebarMenuBadge>
                        {inboxCount ? inboxCount : 0}
                      </SidebarMenuBadge>
                    ) : null}

                    {item.href === "/app/today" ? (
                      <SidebarMenuBadge>
                        {todayCount ? todayCount : 0}
                      </SidebarMenuBadge>
                    ) : null}

                    {item.href === "/app/upcoming" ? (
                      <SidebarMenuBadge>
                        {upcomingCount ? upcomingCount : 0}
                      </SidebarMenuBadge>
                    ) : null}

                    {item.href === "/app/completed" ? (
                      <SidebarMenuBadge>
                        {completeCount ? completeCount : 0}
                      </SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroupLabel
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-sm"
                render={<CollapsibleTrigger />}
              >
                <ChevronRightIcon className="me-2 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                <span>Projects</span>
              </SidebarGroupLabel>

              <Tooltip>
                <TooltipTrigger
                  onClick={() => setOpenProjectForm(true)}
                  render={<SidebarGroupAction aria-label="Add project" />}
                >
                  <PlusIcon />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-sm">Add project</p>
                </TooltipContent>
              </Tooltip>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {!data || data.length === 0 ? (
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <p className="text-muted-foreground p-2 text-sm">
                            Click + to add some projects
                          </p>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ) : (
                      data.slice(0, 5).map((project) => (
                        <SidebarMenuItem key={project.id}>
                          <SidebarMenuButton
                            onClick={() => {
                              if (isMobile) {
                                setOpenMobile(false);
                              }
                            }}
                            isActive={
                              pathname === `/app/projects/${project.id}`
                            }
                            render={
                              <Link
                                to="/app/projects/$id"
                                params={{ id: project.id }}
                              />
                            }
                          >
                            <HashIcon color={project.colorHex} />
                            <span className="truncate">{project.name}</span>
                          </SidebarMenuButton>

                          <ProjectActionsMenu
                            // side="right"
                            // align="start"
                            project={project}
                            render={
                              <SidebarMenuAction
                                className="bg-sidebar-accent"
                                aria-label="More actions"
                                showOnHover
                              />
                            }
                          >
                            <MoreHorizontalIcon />
                          </ProjectActionsMenu>
                        </SidebarMenuItem>
                      ))
                    )}

                    {data && data.length > 5 ? (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => {
                            if (isMobile) {
                              setOpenMobile(false);
                            }
                          }}
                          isActive={pathname === "/app/projects"}
                          className="text-muted-foreground"
                          render={<Link to="/app/projects" />}
                        >
                          <MoreHorizontalIcon />
                          <span>All projects</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ) : null}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        </SidebarContent>

        <Show when="signed-in">
          <SidebarFooter>
            <UserButton
              showName
              appearance={{
                elements: {
                  popoverBox: "pointer-events-auto",
                  rootBox: "w-full",
                  userButtonBox: " shadow-none",
                  userButtonOuterIdentifier: "ps-0",
                  userButtonTrigger:
                    "shadow-none! flex-row-reverse! w-full justify-start p-2 gap-2 rounded-md hover:bg-sidebar-accent",
                },
              }}
            />
          </SidebarFooter>
        </Show>
        <SidebarRail />
      </Sidebar>

      <TaskFormDialogContextProvider
        open={openTaskForm}
        setOpen={setOpenTaskForm}
      >
        <TaskFormDialog>
          <TaskFormDialogContent />
        </TaskFormDialog>
      </TaskFormDialogContextProvider>

      <ProjectFormDialogContextProvider
        open={openProjectForm}
        setOpen={setOpenProjectForm}
      >
        <ProjectFormDialog>
          <ProjectFormDialogContent className="rounded-xl! border-0 p-0" />
        </ProjectFormDialog>
      </ProjectFormDialogContextProvider>
    </React.Fragment>
  );
}
