import type { BusinessId, ChannelId, GoalId, PostChannel, PostStatus, TeamId, TimelineId } from "./types.ts";

export const businessLabel: Record<BusinessId, string> = {
  startup: "Youth and initiatives",
  sme: "A cultural institution",
  ecommerce: "General public",
  medical: "Health and giving",
  education: "Education and students",
  personal: "The biography itself",
};

export const goalLabel: Record<GoalId, string> = {
  leads: "Clearer dialogue",
  search: "A sourced search result",
  social: "A presence on platforms",
  identity: "One clear message",
  website: "A standing reference page",
  training: "Share experience",
};

export const channelLabel: Record<ChannelId, string> = {
  facebook: "A Facebook page",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  website: "A website",
  whatsapp: "WhatsApp",
  none: "Nothing yet",
};

export const teamLabel: Record<TeamId, string> = {
  solo: "One person",
  one: "One assistant",
  team: "A small office",
  nobody: "Nobody yet",
};

export const timelineLabel: Record<TimelineId, string> = {
  week: "This week",
  month: "Within a month",
  exploring: "Just exploring",
};

export const postChannelLabel: Record<PostChannel, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  whatsapp: "WhatsApp",
  website: "Website",
};

export const postStatusLabel: Record<PostStatus, string> = {
  idea: "Idea",
  draft: "Draft",
  review: "In review",
  ready: "Ready",
};

export const phaseLabel: Record<1 | 2 | 3 | 4, string> = {
  1: "Days 1–7. Foundation",
  2: "Days 8–14. First release",
  3: "Days 15–21. Learning",
  4: "Days 22–30. Hold the rhythm",
};

export const questions = [
  { key: "businessId", q: "Who are you speaking to first?", labels: businessLabel, multi: false },
  { key: "goalId", q: "What matters most in the next three months?", labels: goalLabel, multi: false },
  { key: "channelIds", q: "Which channels exist today? Choose every one that applies.", labels: channelLabel, multi: true },
  { key: "teamId", q: "Who prepares the materials today?", labels: teamLabel, multi: false },
  { key: "timelineId", q: "When do you want to start?", labels: timelineLabel, multi: false },
] as const;
