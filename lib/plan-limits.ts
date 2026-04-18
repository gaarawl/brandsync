export const PLAN_LIMITS = {
  free: {
    dailyEmails: 5,
    maxRecipients: 5,
    aiMessagesPerDay: 10,
  },
  pro: {
    dailyEmails: 50,
    maxRecipients: 50,
    aiMessagesPerDay: 200,
  },
  business: {
    dailyEmails: 200,
    maxRecipients: 200,
    aiMessagesPerDay: 500,
  },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export function getPlanLimits(plan: string) {
  return PLAN_LIMITS[plan as PlanType] || PLAN_LIMITS.free;
}
