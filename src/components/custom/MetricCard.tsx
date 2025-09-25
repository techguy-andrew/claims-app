import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/active-components/card'
import { Badge } from '@/components/active-components/badge'

interface MetricCardProps {
  title: string
  value: number
  total: number
  variant: 'pending' | 'under-review' | 'approved' | 'rejected' | 'closed'
}

const VARIANT_CONFIG = {
  pending: {
    badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  'under-review': {
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  approved: {
    badgeClass: 'bg-green-100 text-green-800 border-green-200',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  rejected: {
    badgeClass: 'bg-red-100 text-red-800 border-red-200',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600'
  },
  closed: {
    badgeClass: 'bg-gray-100 text-gray-800 border-gray-200',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600'
  }
}

export function MetricCard({ title, value, total, variant }: MetricCardProps) {
  const config = VARIANT_CONFIG[variant]
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-full p-2 ${config.iconBg}`}>
          <div className={`h-2 w-2 rounded-full ${config.iconColor.replace('text-', 'bg-')}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={config.badgeClass}
            >
              {percentage}%
            </Badge>
            <p className="text-xs text-muted-foreground">
              of {total} total claims
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}