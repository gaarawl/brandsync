export const PLAN_LIMITS = {
  free: {
    dailyEmails: 5,
    maxRecipients: 3,
    aiMessagesPerDay: 10,
    emailSync: false,
    syncIntervalMinutes: 0,
  },
  pro: {
    dailyEmails: 50,
    maxRecipients: 10,
    aiMessagesPerDay: 200,
    emailSync: true,
    syncIntervalMinutes: 180, // 3h
  },
  business: {
    dailyEmails: 200,
    maxRecipients: 50,
    aiMessagesPerDay: 500,
    emailSync: true,
    syncIntervalMinutes: 30, // 30min
  },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export function getPlanLimits(plan: string) {
  return PLAN_LIMITS[plan as PlanType] || PLAN_LIMITS.free;
}
