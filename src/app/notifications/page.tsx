import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PageHeader } from "@/components/layout/page-header"
import { NotificationList } from "@/components/notifications/notification-list"

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Notifications Center"
        description="Monitor campaign transmission stats, webhook errors, billing actions, and security credentials updates."
      />
      <NotificationList />
    </DashboardLayout>
  )
}
