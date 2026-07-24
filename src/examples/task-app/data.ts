/**
 * Mock data for the example app.
 *
 * Deliberately mundane and slightly messy — long titles, an overdue item, an
 * empty project — because a demo built from tidy one-line strings hides exactly
 * the layout problems a design system needs to survive.
 */

export type Priority = "low" | "medium" | "high";
export type Bucket = "today" | "upcoming" | "done";

export interface Task {
  id: string;
  title: string;
  note?: string;
  project: string;
  priority: Priority;
  bucket: Bucket;
  due: string;
  overdue?: boolean;
  subtasks: { id: string; title: string; done: boolean }[];
}

export const PROJECTS = [
  { id: "inbox", name: "Inbox" },
  { id: "website", name: "Website relaunch" },
  { id: "mobile", name: "Mobile app" },
  { id: "admin", name: "Admin" },
] as const;

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const PRIORITY_VARIANT: Record<Priority, "neutral" | "warning" | "destructive"> = {
  low: "neutral",
  medium: "warning",
  high: "destructive",
};

export const TASKS: Task[] = [
  {
    id: "t1",
    title: "Rewrite the onboarding email sequence",
    note: "Three emails: welcome, first project, week-one check-in. Keep each under 120 words and lead with the action.",
    project: "website",
    priority: "high",
    bucket: "today",
    due: "Today, 17:00",
    overdue: true,
    subtasks: [
      { id: "s1", title: "Draft welcome email", done: true },
      { id: "s2", title: "Draft first-project email", done: false },
      { id: "s3", title: "Review with Mika", done: false },
    ],
  },
  {
    id: "t2",
    title: "Fix the tab bar badge overlap on small screens",
    note: "Counts over 99 currently sit on top of the icon.",
    project: "mobile",
    priority: "medium",
    bucket: "today",
    due: "Today",
    subtasks: [{ id: "s4", title: "Reproduce on iPhone SE", done: true }],
  },
  {
    id: "t3",
    title: "Approve the Q3 invoice",
    project: "admin",
    priority: "low",
    bucket: "today",
    due: "Today",
    subtasks: [],
  },
  {
    id: "t4",
    title: "Migrate the marketing site to the new token set",
    note: "Blocked until the design system ships.",
    project: "website",
    priority: "medium",
    bucket: "upcoming",
    due: "Thu 30 Jul",
    subtasks: [],
  },
  {
    id: "t5",
    title: "Write the release notes",
    project: "mobile",
    priority: "low",
    bucket: "upcoming",
    due: "Fri 31 Jul",
    subtasks: [],
  },
  {
    id: "t6",
    title: "Renew the TLS certificate",
    project: "admin",
    priority: "high",
    bucket: "done",
    due: "Yesterday",
    subtasks: [],
  },
  {
    id: "t7",
    title: "Ship the OKLCH ramp generator",
    project: "mobile",
    priority: "high",
    bucket: "done",
    due: "Mon 21 Jul",
    subtasks: [],
  },
];

export function projectName(id: string): string {
  return PROJECTS.find((project) => project.id === id)?.name ?? "Inbox";
}
