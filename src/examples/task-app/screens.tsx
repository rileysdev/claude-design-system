import * as React from "react";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CopyIcon,
  FlagIcon,
  FolderIcon,
  InboxIcon,
  MoonIcon,
  MoreVerticalIcon,
  PencilIcon,
  SearchXIcon,
  Trash2Icon,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/accordion";
import { Alert, AlertDescription, AlertTitle } from "../../components/alert";
import { AppBar } from "../../components/app-bar";
import { Avatar, AvatarFallback } from "../../components/avatar";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card";
import { Checkbox } from "../../components/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/dropdown-menu";
import { EmptyState } from "../../components/empty-state";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { List, ListItem } from "../../components/list";
import { Progress } from "../../components/progress";
import { RadioGroup, RadioGroupItem } from "../../components/radio-group";
import { Separator } from "../../components/separator";
import { Skeleton } from "../../components/skeleton";
import { Stack } from "../../components/stack";
import { Switch } from "../../components/switch";
import { Tabs, TabsList, TabsTrigger } from "../../components/tabs";
import { toast } from "../../components/toast";
import { cn } from "../../lib/utils";
import {
  PRIORITY_LABEL,
  PRIORITY_VARIANT,
  projectName,
  type Bucket,
  type Task,
} from "./data";

/* ── Today ────────────────────────────────────────────────────────────────── */

export interface TodayScreenProps {
  tasks: Task[];
  bucket: Bucket;
  onBucketChange: (bucket: Bucket) => void;
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
  onNew: () => void;
  loading?: boolean;
}

export function TodayScreen({
  tasks,
  bucket,
  onBucketChange,
  onToggle,
  onOpen,
  onNew,
  loading = false,
}: TodayScreenProps) {
  const visible = tasks.filter((task) => task.bucket === bucket);
  const todayTasks = tasks.filter((task) => task.bucket === "today");
  const doneCount = tasks.filter((task) => task.bucket === "done").length;
  const total = todayTasks.length + doneCount;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return (
    <>
      <AppBar
        title="Tasks"
        trailing={
          <Avatar size="sm">
            <AvatarFallback>RS</AvatarFallback>
          </Avatar>
        }
      >
        <div className="px-4 pb-3">
          <Tabs value={bucket} onValueChange={(value) => onBucketChange(value as Bucket)}>
            <TabsList variant="segmented">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="done">Done</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </AppBar>

      <main className="flex-1 overflow-y-auto">
        <Stack gap={4} className="p-4">
          <Card padded>
            <Stack gap={2}>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">Today&rsquo;s progress</span>
                <span className="text-sm text-muted-foreground">
                  {doneCount} of {total}
                </span>
              </div>
              <Progress value={percent} tone={percent === 100 ? "success" : "primary"} />
            </Stack>
          </Card>

          {loading ? (
            <Stack gap={3}>
              {[0, 1, 2].map((row) => (
                <Card key={row} padded>
                  <Stack direction="horizontal" gap={3} align="center">
                    <Skeleton shape="circle" className="size-5" />
                    <Stack gap={2} className="flex-1">
                      <Skeleton className="w-3/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>
          ) : visible.length === 0 ? (
            <EmptyState
              icon={<InboxIcon />}
              title={bucket === "done" ? "Nothing finished yet" : "All clear"}
              description={
                bucket === "done"
                  ? "Completed tasks collect here."
                  : "Nothing scheduled. Add something you have been putting off."
              }
              action={bucket !== "done" ? <Button onClick={onNew}>New task</Button> : undefined}
            />
          ) : (
            <List inset>
              {visible.map((task) => (
                <ListItem
                  key={task.id}
                  leading={
                    <Checkbox
                      checked={task.bucket === "done"}
                      onCheckedChange={() => onToggle(task.id)}
                      aria-label={`Mark "${task.title}" as done`}
                    />
                  }
                  title={
                    <span className={cn(task.bucket === "done" && "line-through opacity-60")}>
                      {task.title}
                    </span>
                  }
                  description={`${projectName(task.project)} · ${task.due}`}
                  trailing={
                    <Badge variant={PRIORITY_VARIANT[task.priority]} size="sm">
                      {PRIORITY_LABEL[task.priority]}
                    </Badge>
                  }
                  multiline
                  navigable
                  onSelect={() => onOpen(task.id)}
                />
              ))}
            </List>
          )}

          <Button fullWidth size="lg" onClick={onNew}>
            New task
          </Button>
        </Stack>
      </main>
    </>
  );
}

/* ── Task detail ──────────────────────────────────────────────────────────── */

export interface DetailScreenProps {
  task: Task;
  onBack: () => void;
  onDelete: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export function DetailScreen({ task, onBack, onDelete, onToggleSubtask }: DetailScreenProps) {
  const doneSubtasks = task.subtasks.filter((subtask) => subtask.done).length;

  return (
    <>
      <AppBar
        centerTitle
        title="Task"
        leading={
          <Button variant="ghost" size="icon" aria-label="Back" onClick={onBack}>
            <ArrowLeftIcon />
          </Button>
        }
        trailing={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Task actions">
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => toast("Editing is not part of this demo")}>
                <PencilIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast.success("Task duplicated")}>
                <CopyIcon />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onSelect={() => onDelete(task.id)}>
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <main className="flex-1 overflow-y-auto">
        <Stack gap={4} className="p-4">
          {task.overdue ? (
            <Alert variant="warning" icon={<AlertTriangleIcon />}>
              <AlertTitle>Due today at 17:00</AlertTitle>
              <AlertDescription>This one has already slipped once.</AlertDescription>
            </Alert>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle as="h2">{task.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack gap={3}>
                {task.note ? (
                  <p className="text-sm text-muted-foreground">{task.note}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No notes.</p>
                )}
                <Separator />
                <Stack direction="horizontal" gap={2} wrap>
                  <Badge variant="outline">
                    <FolderIcon />
                    {projectName(task.project)}
                  </Badge>
                  <Badge variant="outline">
                    <CalendarIcon />
                    {task.due}
                  </Badge>
                  <Badge variant={PRIORITY_VARIANT[task.priority]}>
                    <FlagIcon />
                    {PRIORITY_LABEL[task.priority]}
                  </Badge>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {task.subtasks.length > 0 ? (
            <Accordion type="single" collapsible defaultValue="subtasks">
              <AccordionItem value="subtasks">
                <AccordionTrigger>
                  Subtasks · {doneSubtasks}/{task.subtasks.length}
                </AccordionTrigger>
                <AccordionContent>
                  <Stack gap={3}>
                    {task.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-2.5">
                        <Checkbox
                          id={`${task.id}-${subtask.id}`}
                          checked={subtask.done}
                          onCheckedChange={() => onToggleSubtask(task.id, subtask.id)}
                        />
                        <Label
                          htmlFor={`${task.id}-${subtask.id}`}
                          className={cn(subtask.done && "line-through opacity-60")}
                        >
                          {subtask.title}
                        </Label>
                      </div>
                    ))}
                  </Stack>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="activity">
                <AccordionTrigger>Activity</AccordionTrigger>
                <AccordionContent>
                  Created 21 July. Moved to Today on 24 July.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : null}
        </Stack>
      </main>
    </>
  );
}

/* ── Search ───────────────────────────────────────────────────────────────── */

export interface SearchScreenProps {
  tasks: Task[];
  onOpen: (id: string) => void;
}

export function SearchScreen({ tasks, onOpen }: SearchScreenProps) {
  const [query, setQuery] = React.useState("");
  const results = query.trim()
    ? tasks.filter((task) => task.title.toLowerCase().includes(query.trim().toLowerCase()))
    : tasks;

  return (
    <>
      <AppBar title="Search" />
      <main className="flex-1 overflow-y-auto">
        <Stack gap={4} className="p-4">
          <Input
            type="search"
            placeholder="Search tasks"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search tasks"
          />

          {results.length === 0 ? (
            <EmptyState
              icon={<SearchXIcon />}
              title={`No results for “${query}”`}
              description="Check the spelling, or try a broader term."
              action={
                <Button variant="outline" onClick={() => setQuery("")}>
                  Clear search
                </Button>
              }
            />
          ) : (
            <List inset>
              {results.map((task) => (
                <ListItem
                  key={task.id}
                  title={task.title}
                  description={`${projectName(task.project)} · ${task.due}`}
                  trailing={
                    task.bucket === "done" ? (
                      <Badge variant="success" size="sm" dot>
                        Done
                      </Badge>
                    ) : undefined
                  }
                  multiline
                  navigable
                  onSelect={() => onOpen(task.id)}
                />
              ))}
            </List>
          )}
        </Stack>
      </main>
    </>
  );
}

/* ── Settings ─────────────────────────────────────────────────────────────── */

export interface SettingsScreenProps {
  container?: HTMLElement | null;
  themeName: string;
  onThemeChange: (theme: string) => void;
  themes: { name: string; label: string }[];
  dark: boolean;
  onDarkChange: (dark: boolean) => void;
}

export function SettingsScreen({
  container,
  themeName,
  onThemeChange,
  themes,
  dark,
  onDarkChange,
}: SettingsScreenProps) {
  return (
    <>
      <AppBar title="Settings" />
      <main className="flex-1 overflow-y-auto">
        <Stack gap={6} className="p-4">
          <Card padded>
            <Stack direction="horizontal" gap={3} align="center">
              <Avatar size="lg">
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">Riley Scheid</span>
                <span className="text-sm text-muted-foreground">riley@example.com</span>
              </div>
            </Stack>
          </Card>

          <Stack gap={2}>
            <span className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Appearance
            </span>
            <List inset>
              <ListItem
                leading={<MoonIcon />}
                title="Dark mode"
                trailing={
                  <Switch
                    checked={dark}
                    onCheckedChange={onDarkChange}
                    aria-label="Dark mode"
                  />
                }
              />
            </List>

            <Card padded>
              <Stack gap={3}>
                <Label>Theme</Label>
                <RadioGroup value={themeName} onValueChange={onThemeChange}>
                  {themes.map((theme) => (
                    <div key={theme.name} className="flex items-center gap-2.5">
                      <RadioGroupItem value={theme.name} id={`theme-${theme.name}`} />
                      <Label htmlFor={`theme-${theme.name}`}>{theme.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </Stack>
            </Card>
          </Stack>

          <Stack gap={2}>
            <span className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Notifications
            </span>
            <List inset>
              <ListItem title="Daily summary" description="09:00" trailing={<Switch defaultChecked />} />
              <ListItem title="Due reminders" trailing={<Switch defaultChecked />} />
              <ListItem title="Weekly report" trailing={<Switch />} />
            </List>
          </Stack>

          <Stack gap={2}>
            <span className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Account
            </span>
            <List inset>
              <ListItem title="Export data" navigable onSelect={() => toast("Export started")} />
              <ListItem title="Privacy" navigable onSelect={() => toast("Nothing to see in the demo")} />
            </List>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" fullWidth className="text-destructive">
                  Delete account
                </Button>
              </DialogTrigger>
              <DialogContent container={container}>
                <DialogHeader>
                  <DialogTitle>Delete account?</DialogTitle>
                  <DialogDescription>
                    This removes every task and cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="destructive" onClick={() => toast.error("Account deleted")}>
                      Delete account
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Stack>
        </Stack>
      </main>
    </>
  );
}
