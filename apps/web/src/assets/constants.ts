/**
 * @copyright 2024 codewithsadee
 * @license Apache-2.0
 * @description Constants for the app
 */

/**
 * Node modules
 */
import { Calendar1, CalendarDays, CircleCheck, Inbox } from "lucide-react";

export const SOCIAL_LINKS = [
  {
    href: "https://youtube.com/codewithsadee",
    label: "YouTube",
  },
  {
    href: "https://linkedin.com/in/codewithsadee",
    label: "LinkedIn",
  },
  {
    href: "https://github.com/codewithsadee",
    label: "GitHub",
  },
  {
    href: "https://instagram.com/codewithsadee",
    label: "Instagram",
  },
] as const;

export const SIDEBAR_LINKS = [
  {
    href: "/app/inbox",
    icon: Inbox,
    label: "Inbox",
  },
  {
    href: "/app/today",
    icon: Calendar1,
    label: "Today",
  },
  {
    href: "/app/upcoming",
    icon: CalendarDays,
    label: "Upcoming",
  },
  {
    href: "/app/completed",
    icon: CircleCheck,
    label: "Completed",
  },
] as const;

export const PROJECT_COLORS = [
  {
    hex: "#64748b",
    name: "Slate",
  },
  {
    hex: "#ef4444",
    name: "Red",
  },
  {
    hex: "#f97316",
    name: "Orange",
  },
  {
    hex: "#f59e0b",
    name: "Amber",
  },
  {
    hex: "#eab308",
    name: "Yellow",
  },
  {
    hex: "#84cc16",
    name: "Lime",
  },
  {
    hex: "#22c55e",
    name: "Green",
  },
  {
    hex: "#10b981",
    name: "Emerald",
  },
  {
    hex: "#06b6d4",
    name: "Teal",
  },
  {
    hex: "#06b6d4",
    name: "Cyan",
  },
  {
    hex: "#0ea5e9",
    name: "Sky",
  },
  {
    hex: "#06b6d4",
    name: "Blue",
  },
  {
    hex: "#6366f1",
    name: "Indigo",
  },
  {
    hex: "#8b5cf6",
    name: "Violet",
  },
  {
    hex: "#a855f7",
    name: "Purple",
  },
  {
    hex: "#d946ef",
    name: "Fuchsia",
  },
  {
    hex: "#ec4899",
    name: "Pink",
  },
  {
    hex: "#f43f5e",
    name: "Rose",
  },
] as const;
