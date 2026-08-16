"use client";

import { Task, TaskStatus } from "@/lib/types";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

function isOverdue(deadline: string | null, status: TaskStatus) {
  if (!deadline || status === "done") return false;
  return new Date(deadline) < new Date(new Date().toDateString());
}

export default function TaskCard({
  task,
  onStatusChange,
  onDelete,
}: {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}) {
  const overdue = isOverdue(task.deadline, task.status);

  return (
    <div className="neu-raised-sm p-3.5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-[var(--neu-text)]">{task.title}</h3>
        <button
          onClick={() => onDelete(task.id)}
          className="text-[var(--neu-text-muted)] hover:text-[var(--neu-danger)] text-sm leading-none"
          aria-label="Delete task"
        >
          ✕
        </button>
      </div>

      {task.description && (
        <p className="mt-1 text-sm text-[var(--neu-text-muted)] line-clamp-3">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
        <span className="neu-tag-navy px-2 py-0.5 font-medium">{task.assignee}</span>
        <span className="neu-tag-orange px-2 py-0.5 font-medium">{task.project}</span>
        {task.deadline && (
          <span
            className={`px-2 py-0.5 font-medium ${
              overdue ? "neu-tag-rust" : "neu-tag"
            } ${overdue ? "" : "text-[var(--neu-text-muted)]"}`}
          >
            {overdue ? "Overdue: " : "Due "}
            {task.deadline}
          </span>
        )}
      </div>

      <select
        value={task.status}
        onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
        className="neu-pressed-sm mt-3 w-full text-sm px-2 py-1 text-[var(--neu-text)] outline-none"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
