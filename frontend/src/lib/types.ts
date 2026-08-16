export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  assignee: string;
  project: string;
  deadline: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  assignee: string;
  project: string;
  deadline?: string;
  status?: TaskStatus;
}

export interface Purchase {
  id: string;
  item: string;
  amount: number;
  purchaser: string;
  project: string;
  category: string | null;
  date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PurchaseInput {
  item: string;
  amount: number;
  purchaser: string;
  project: string;
  category?: string;
  date: string;
  notes?: string;
}

export interface Grant {
  id: string;
  source: string;
  program_name: string;
  url: string;
  status_text: string | null;
  deadline_text: string | null;
  contact_email: string | null;
  summary: string | null;
  scraped_at: string;
}

export interface GrantRefreshResponse {
  grants: Grant[];
  errors: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  description: string | null;
  created_at: string;
}

export interface CalendarEventInput {
  title: string;
  date: string;
  description?: string;
}

export interface Announcement {
  id: string;
  message: string;
  created_at: string;
  updated_at: string;
}
