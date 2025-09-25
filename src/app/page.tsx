import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/active-components/card'

export const metadata = {
  title: 'Claims App - Dashboard',
  description: 'Dashboard overview and analytics',
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:gap-6 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Overview and analytics for your claims management.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}