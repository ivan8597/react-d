export type Assignee = {
  id: number;
  name: string;
}

export type Status = {
  id: number;
  name: string;
}

export type Task = {
  id: string;
  taskName: string;
  description: string;
  assigneeId: number;
  taskAssigneeName?: string;
  statusId: number;
  createdAt: string;
}

export type Dictionary = {
  assignees: Record<string, string>;
  statuses: Record<string, string>;
}