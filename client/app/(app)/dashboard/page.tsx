'use client';

import { useEffect, useState } from 'react';
import { Users, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { KpiCard } from '@/components/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getClientStats, getAppointmentsByClientId, getClients } from '@/lib/api';
import type { Appointment, Client } from '@/lib/types';

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalClients: 0, activeClients: 0, totalRevenue: 0, upcomingAppointments: 0 });
  const [upcomingAppointments, setUpcomingAppointments] = useState<(Appointment & { clientName: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Get stats
        const statsData = await getClientStats();
        setStats(statsData);

        // Get upcoming appointments with client names
        const clients = await getClients();
        const allAppointments: (Appointment & { clientName: string })[] = [];

        for (const client of clients) {
          const appointments = await getAppointmentsByClientId(client.id);
          const upcomingForClient = appointments
            .filter((a) => new Date(a.dateTime) > new Date())
            .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
            .slice(0, 2)
            .map((a) => ({ ...a, clientName: client.name }));

          allAppointments.push(...upcomingForClient);
        }

        setUpcomingAppointments(
          allAppointments.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()).slice(0, 5)
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="p-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Total Clients"
          value={stats.totalClients}
          icon={Users}
          description="Active and inactive"
        />
        <KpiCard
          title="Active Clients"
          value={stats.activeClients}
          icon={TrendingUp}
          description="Currently engaged"
        />
        <KpiCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          description="All transactions"
        />
        <KpiCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          icon={Calendar}
          description="Next 30 days"
        />
      </div>

      {/* Upcoming Appointments Widget */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Appointments (Next 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No upcoming appointments</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-secondary transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{apt.clientName}</p>
                    <p className="text-sm text-muted-foreground">{apt.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatDate(apt.dateTime)}</p>
                    {apt.reminderEnabled && (
                      <span className="inline-block mt-1 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Reminder: {apt.reminderTime}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
