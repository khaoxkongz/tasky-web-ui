import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import {
  format,
  formatRelative,
  isBefore,
  isSameYear,
  isToday,
  isTomorrow,
  startOfToday,
} from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*
 * Capitalizes the first letter of a string
 */
export const toTitleCase = (str: string | undefined): string => {
  if (!str) {
    return "";
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};

/*
 * Formats a date string to a custom format
 * (e.g. "today", "yesterday", "dd MMM", "MM/dd/yyyy")
 */
export const formatCustomDate = (date: string | number | Date): string => {
  const today = new Date();

  // Get the relative date (e.g. "today", "yesterday")
  const relative = toTitleCase(
    formatRelative(new Date(date), today).split(" at ").at(0)
  );

  // List of relative keywords to check
  const relativeDays = [
    "Today",
    "Tomorrow",
    "Yesterday",
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  // Return the relative day if it matches
  if (relativeDays.includes(relative)) {
    return relative;
  }

  if (isSameYear(date, today)) {
    return format(date, "dd MMM");
  }

  return format(date, "dd MMM yyyy");
};

/*
 * Returns a color class based on the due date of a task
 */
export const getTaskDueDateColorClass = (
  dueDate: Date | null,
  completed?: boolean
): string | undefined => {
  if (dueDate === null || completed === undefined) {
    return;
  }

  if (isBefore(dueDate, startOfToday()) && !completed) {
    return "text-red-500";
  }

  if (isToday(dueDate)) {
    return "text-emerald-500";
  }

  if (isTomorrow(dueDate)) {
    return "text-yellow-500";
  }
};

/*
 * Truncate a string to a specified length and appends an elipsis.
 */
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) {
    return str;
  }

  return `${str.slice(0, length)}...`;
};
