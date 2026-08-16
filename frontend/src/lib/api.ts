import {
  Announcement,
  CalendarEvent,
  CalendarEventInput,
  Grant,
  GrantRefreshResponse,
  Purchase,
  PurchaseInput,
  Task,
  TaskInput,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function listTasks(sortBy: string): Promise<Task[]> {
  return request<Task[]>(`/tasks?sort_by=${sortBy}`);
}

export function createTask(task: TaskInput): Promise<Task> {
  return request<Task>("/tasks", { method: "POST", body: JSON.stringify(task) });
}

export function updateTask(id: string, task: Partial<TaskInput>): Promise<Task> {
  return request<Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(task) });
}

export function deleteTask(id: string): Promise<void> {
  return request<void>(`/tasks/${id}`, { method: "DELETE" });
}

export function listPurchases(sortBy: string): Promise<Purchase[]> {
  return request<Purchase[]>(`/purchases?sort_by=${sortBy}`);
}

export function createPurchase(purchase: PurchaseInput): Promise<Purchase> {
  return request<Purchase>("/purchases", { method: "POST", body: JSON.stringify(purchase) });
}

export function deletePurchase(id: string): Promise<void> {
  return request<void>(`/purchases/${id}`, { method: "DELETE" });
}

export function listGrants(): Promise<Grant[]> {
  return request<Grant[]>("/grants");
}

export function refreshGrants(): Promise<GrantRefreshResponse> {
  return request<GrantRefreshResponse>("/grants/refresh", { method: "POST" });
}

export function listCalendarEvents(): Promise<CalendarEvent[]> {
  return request<CalendarEvent[]>("/calendar-events");
}

export function createCalendarEvent(event: CalendarEventInput): Promise<CalendarEvent> {
  return request<CalendarEvent>("/calendar-events", {
    method: "POST",
    body: JSON.stringify(event),
  });
}

export function deleteCalendarEvent(id: string): Promise<void> {
  return request<void>(`/calendar-events/${id}`, { method: "DELETE" });
}

export function getAnnouncement(): Promise<Announcement | null> {
  return request<Announcement | null>("/announcement");
}

export function setAnnouncement(message: string): Promise<Announcement> {
  return request<Announcement>("/announcement", { method: "PUT", body: JSON.stringify({ message }) });
}

export function clearAnnouncement(): Promise<void> {
  return request<void>("/announcement", { method: "DELETE" });
}
