import * as React from "react";

import { Button } from "../../components/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "../../components/form-field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { RadioGroup, RadioGroupItem } from "../../components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../components/sheet";
import { Switch } from "../../components/switch";
import { Textarea } from "../../components/textarea";
import { toast } from "../../components/toast";
import { PRIORITY_LABEL, PROJECTS, type Priority } from "./data";

export interface NewTaskSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (task: { title: string; note: string; project: string; priority: Priority }) => void;
  /** Scope the sheet to a container instead of the viewport. */
  container?: HTMLElement | null;
}

/**
 * The create form, in a bottom sheet.
 *
 * Validation is deliberately real: submitting an empty title shows the error
 * path, which is the state most demos skip and most design systems get wrong.
 */
export function NewTaskSheet({ open, onOpenChange, onCreate, container }: NewTaskSheetProps) {
  const [title, setTitle] = React.useState("");
  const [note, setNote] = React.useState("");
  const [project, setProject] = React.useState<string>("inbox");
  const [priority, setPriority] = React.useState<Priority>("medium");
  const [remind, setRemind] = React.useState(true);
  const [touched, setTouched] = React.useState(false);

  const invalid = touched && title.trim().length === 0;

  function reset() {
    setTitle("");
    setNote("");
    setProject("inbox");
    setPriority("medium");
    setRemind(true);
    setTouched(false);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (title.trim().length === 0) return;
    onCreate({ title: title.trim(), note: note.trim(), project, priority });
    toast.success("Task added", { description: remind ? "You'll be reminded at 09:00." : undefined });
    reset();
    onOpenChange(false);
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <SheetContent side="bottom" container={container} className="max-h-[92dvh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>New task</SheetTitle>
          <SheetDescription>Added to Today unless you pick a date.</SheetDescription>
        </SheetHeader>

        <form className="flex flex-col gap-5" onSubmit={submit}>
          <FormField invalid={invalid}>
            <FormLabel required>Title</FormLabel>
            <FormControl>
              {(props) => (
                <Input
                  {...props}
                  invalid={invalid}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="What needs doing?"
                  autoComplete="off"
                />
              )}
            </FormControl>
            {invalid ? <FormMessage>Give the task a title.</FormMessage> : null}
          </FormField>

          <FormField>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              {(props) => (
                <Textarea
                  {...props}
                  rows={3}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Any detail worth keeping"
                />
              )}
            </FormControl>
            <FormDescription>Optional. Visible to your team.</FormDescription>
          </FormField>

          <FormField>
            <FormLabel>Project</FormLabel>
            <FormControl>
              {(props) => (
                <Select value={project} onValueChange={setProject}>
                  <SelectTrigger {...props} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECTS.map((entry) => (
                      <SelectItem key={entry.id} value={entry.id}>
                        {entry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormControl>
          </FormField>

          <div className="flex flex-col gap-2.5">
            <Label>Priority</Label>
            <RadioGroup
              value={priority}
              onValueChange={(next) => setPriority(next as Priority)}
              className="grid grid-cols-3 gap-2"
            >
              {(Object.keys(PRIORITY_LABEL) as Priority[]).map((value) => (
                <div key={value} className="flex items-center gap-2">
                  <RadioGroupItem value={value} id={`priority-${value}`} />
                  <Label htmlFor={`priority-${value}`}>{PRIORITY_LABEL[value]}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="remind">Remind me</Label>
              <span className="text-sm text-muted-foreground">Morning of the due date</span>
            </div>
            <Switch id="remind" checked={remind} onCheckedChange={setRemind} />
          </div>

          <SheetFooter>
            <Button type="submit" fullWidth>
              Add task
            </Button>
            <Button
              type="button"
              fullWidth
              variant="ghost"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
