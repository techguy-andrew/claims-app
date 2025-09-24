export const metadata = {
  title: 'Claims App - Dashboard',
  description: 'Dashboard overview and analytics',
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview and analytics for your claims management.
        </p>
      </div>
    </div>
  )
}