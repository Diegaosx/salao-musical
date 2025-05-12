export interface ScheduledNotification {
  id: string
  title: string
  body: string
  url?: string
  icon?: string
  scheduledFor: Date | string
  sent: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface NotificationFormData {
  title: string
  body: string
  url?: string
  scheduledDate: string
  scheduledTime: string
}
