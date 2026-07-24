/**
 * @copyright 2024 codewithsadee
 * @license Apache-2.0
 * @description Types for the app
 */

interface Project {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
}

interface ProjectForm {
  id: string | null;
  name: string;
  colorName: string;
  colorHex: string;
  aiTaskGen: boolean;
  taskGenPrompt: string;
}

interface Task {
  id?: string;
  content: string;
  dueDate: Date | null;
  completed?: boolean;
  projectId: Project | null;
  userId: string;
}

interface TaskForm {
  id?: string;
  content: string;
  dueDate: Date | null;
  completed?: boolean;
  projectId: string | null;
}

export type { Project, ProjectForm, Task, TaskForm };
