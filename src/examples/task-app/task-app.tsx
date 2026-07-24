import * as React from "react";
import { ListTodoIcon, SearchIcon, SettingsIcon } from "lucide-react";

import { Screen } from "../../components/stack";
import { TabBar, TabBarItem } from "../../components/tab-bar";
import { Toaster, toast } from "../../components/toast";
import { TooltipProvider } from "../../components/tooltip";
import { themeMeta, themeNames } from "../../tokens/generated";
import { TASKS, type Bucket, type Priority, type Task } from "./data";
import { NewTaskSheet } from "./new-task-sheet";
import { DetailScreen, SearchScreen, SettingsScreen, TodayScreen } from "./screens";

type Tab = "today" | "search" | "settings";

export interface TaskAppProps {
  /** Start on a particular tab — used by the per-screen stories. */
  initialTab?: Tab;
  /** Open a task detail immediately. */
  initialTaskId?: string;
  /** Show the create sheet on mount. */
  initialSheetOpen?: boolean;
  /** Render the loading skeletons instead of the list. */
  loading?: boolean;
  /**
   * Let the app drive theme and dark mode itself. Off inside Storybook, where
   * the toolbar already owns those globals and two writers would fight.
   */
  controlsTheme?: boolean;
}

/**
 * A small but complete app built only from this design system.
 *
 * It exists to answer the question a component gallery cannot: do these pieces
 * hold together on a real screen, with real state, real navigation, and content
 * that does not fit neatly.
 */
export function TaskApp({
  initialTab = "today",
  initialTaskId,
  initialSheetOpen = false,
  loading = false,
  controlsTheme = false,
}: TaskAppProps) {
  const [tab, setTab] = React.useState<Tab>(initialTab);
  const [bucket, setBucket] = React.useState<Bucket>("today");
  const [tasks, setTasks] = React.useState<Task[]>(TASKS);
  const [openTaskId, setOpenTaskId] = React.useState<string | undefined>(initialTaskId);
  const [sheetOpen, setSheetOpen] = React.useState(initialSheetOpen);

  const [themeName, setThemeName] = React.useState<string>(themeNames[0]);
  const [dark, setDark] = React.useState(false);

  // Overlays render into the app root rather than <body> so sheets and dialogs
  // stay inside the device frame in Storybook. A real full-screen app would
  // leave this unset and let them cover the viewport.
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => setContainer(rootRef.current), []);

  React.useEffect(() => {
    if (!controlsTheme) return;
    const root = document.documentElement;
    root.dataset.theme = themeName;
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
  }, [controlsTheme, themeName, dark]);

  const openTask = tasks.find((task) => task.id === openTaskId);

  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, bucket: task.bucket === "done" ? "today" : ("done" as Bucket) }
          : task,
      ),
    );
  }

  function toggleSubtask(taskId: string, subtaskId: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, done: !subtask.done } : subtask,
              ),
            }
          : task,
      ),
    );
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
    setOpenTaskId(undefined);
    toast.success("Task deleted");
  }

  function createTask(input: {
    title: string;
    note: string;
    project: string;
    priority: Priority;
  }) {
    setTasks((current) => [
      {
        id: `t${current.length + 1}-${input.title.length}`,
        title: input.title,
        note: input.note || undefined,
        project: input.project,
        priority: input.priority,
        bucket: "today",
        due: "Today",
        subtasks: [],
      },
      ...current,
    ]);
    setBucket("today");
  }

  const openCount = tasks.filter((task) => task.bucket !== "done").length;

  return (
    <TooltipProvider>
      {/* translate-z-0 makes this element the containing block for the fixed
          positioning inside overlays, so they cannot escape the frame. */}
      <Screen ref={rootRef} className="h-[780px] overflow-hidden [transform:translateZ(0)]">
        {openTask ? (
          <DetailScreen
            task={openTask}
            onBack={() => setOpenTaskId(undefined)}
            onDelete={deleteTask}
            onToggleSubtask={toggleSubtask}
          />
        ) : tab === "today" ? (
          <TodayScreen
            tasks={tasks}
            bucket={bucket}
            onBucketChange={setBucket}
            onToggle={toggleTask}
            onOpen={setOpenTaskId}
            onNew={() => setSheetOpen(true)}
            loading={loading}
          />
        ) : tab === "search" ? (
          <SearchScreen tasks={tasks} onOpen={setOpenTaskId} />
        ) : (
          <SettingsScreen
            container={container}
            themeName={themeName}
            onThemeChange={setThemeName}
            themes={themeNames.map((name) => ({ name, label: themeMeta[name].label }))}
            dark={dark}
            onDarkChange={setDark}
          />
        )}

        {/* The tab bar stays put while a detail screen is open, which is what
            native apps do — the detail is inside the tab, not on top of it. */}
        <TabBar>
          <TabBarItem
            icon={<ListTodoIcon />}
            label="Tasks"
            badge={openCount}
            active={tab === "today"}
            onClick={() => {
              setTab("today");
              setOpenTaskId(undefined);
            }}
          />
          <TabBarItem
            icon={<SearchIcon />}
            label="Search"
            active={tab === "search"}
            onClick={() => {
              setTab("search");
              setOpenTaskId(undefined);
            }}
          />
          <TabBarItem
            icon={<SettingsIcon />}
            label="Settings"
            active={tab === "settings"}
            onClick={() => {
              setTab("settings");
              setOpenTaskId(undefined);
            }}
          />
        </TabBar>

        <NewTaskSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          onCreate={createTask}
          container={container}
        />
        <Toaster />
      </Screen>
    </TooltipProvider>
  );
}
