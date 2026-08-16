"use client";

import { useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, listTasks, updateTask } from "@/lib/api";
import { Task, TaskInput, TaskStatus } from "@/lib/types";
import TaskCard from "./TaskCard";
import NewTaskForm from "./NewTaskForm";

const COLUMNS: { status: TaskStatus; label: string; dot: string }[] = [
  { status: "todo", label: "To Do", dot: "bg-[var(--neu-text-muted)]" },
  { status: "in_progress", label: "In Progress", dot: "bg-[var(--neu-accent)]" },
  { status: "done", label: "Done", dot: "bg-[var(--neu-text)]" },
];

type SortBy = "created_at" | "assignee" | "project" | "deadline";

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("deadline");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setError(null);
      const data = await listTasks(sortBy);
      setTasks(data);
    } catch {
      setError("Couldn't reach the API. Is the FastAPI backend running on :8000?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const assignees = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.assignee))).sort(),
    [tasks]
  );
  const projects = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.project))).sort(),
    [tasks]
  );

  const filtered = tasks.filter(
    (t) =>
      (!assigneeFilter || t.assignee === assigneeFilter) &&
      (!projectFilter || t.project === projectFilter)
  );

  const handleCreate = async (task: TaskInput) => {
    await createTask(task);
    await refresh();
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    await updateTask(id, { status });
  };

  const handleDelete = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await deleteTask(id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h1 className="text-3xl text-[var(--neu-text)]">Task Board</h1>
        <button
          onClick={() => setShowForm(true)}
          className="neu-btn neu-btn-primary px-5 py-2.5 text-sm font-medium"
        >
          + New Task
        </button>
      </div>

      <div className="neu-pressed-sm flex flex-wrap gap-4 mb-8 text-sm px-4 py-3">
        <label className="flex items-center gap-2">
          Sort by
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="neu-pressed-sm px-2 py-1 text-[var(--neu-text)] outline-none"
          >
            <option value="deadline">Deadline</option>
            <option value="assignee">Person</option>
            <option value="project">Project</option>
            <option value="created_at">Created</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          Person
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="neu-pressed-sm px-2 py-1 text-[var(--neu-text)] outline-none"
          >
            <option value="">All</option>
            {assignees.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          Project
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="neu-pressed-sm px-2 py-1 text-[var(--neu-text)] outline-none"
          >
            <option value="">All</option>
            {projects.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <div className="neu-pressed-sm text-[var(--neu-danger)] text-sm px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-[var(--neu-text-muted)] text-sm">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((col) => {
            const colTasks = filtered.filter((t) => t.status === col.status);
            return (
              <div key={col.status} className="neu-pressed p-4">
                <h2 className="text-sm font-semibold text-[var(--neu-text)] mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                    {col.label}
                  </span>
                  <span className="text-[var(--neu-text-muted)] font-normal">{colTasks.length}</span>
                </h2>
                <div className="space-y-3">
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
                  {colTasks.length === 0 && (
                    <p className="text-xs text-[var(--neu-text-muted)] text-center py-6">
                      No tasks
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && <NewTaskForm onCreate={handleCreate} onClose={() => setShowForm(false)} />}
    </div>
  );
}
