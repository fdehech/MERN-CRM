import { Badge } from '@/components/ui/badge';

export type ClientStatus = 'Lead' | 'Active' | 'Inactive' | 'Closed';

interface ClientStatusBadgeProps {
  status: ClientStatus;
}

export function ClientStatusBadge({ status }: ClientStatusBadgeProps) {
  const variants: Record<ClientStatus, 'default' | 'secondary' | 'destructive'> = {
    Lead: 'default',
    Active: 'default',
    Inactive: 'secondary',
    Closed: 'destructive',
  };

  const colors: Record<ClientStatus, string> = {
    Lead: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    Active: 'bg-green-500/10 text-green-700 dark:text-green-400',
    Inactive: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    Closed: 'bg-red-500/10 text-red-700 dark:text-red-400',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[status]}`}
    >
      {status}
    </span>
  );
}
