'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientStatusBadge } from '@/components/client-status-badge';
import { EmptyState } from '@/components/empty-state';
import { ClientFormModal } from '@/components/client-form-modal';
import { Users } from 'lucide-react';
import { getClients, createClient, getTransactionsByClientId } from '@/lib/api';
import type { Client, ClientStatus } from '@/lib/types';
import type { ClientFormData } from '@/lib/schemas';
import { useSearchParams } from 'next/navigation';
import Loading from './loading';

type SortField = 'name' | 'lastActivity' | 'moneySpent';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientTransactions, setClientTransactions] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | ClientStatus>('all');
  const [sortBy, setSortBy] = useState<SortField>('lastActivity');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      try {
        const data = await getClients();
        setClients(data);
        
        // Load transactions for all clients
        const transactionsMap: Record<string, number> = {};
        await Promise.all(
          data.map(async (client) => {
            const transactions = await getTransactionsByClientId(client.id);
            transactionsMap[client.id] = transactions.reduce((sum, t) => sum + t.amount, 0);
          })
        );
        setClientTransactions(transactionsMap);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  const handleAddClient = async (data: ClientFormData) => {
    const newClient = await createClient({
      ...data,
      customFields: [],
    });
    setClients([...clients, newClient]);
  };

  // Calculate money spent per client
  const getClientMoneySpent = (clientId: string) => {
    return clientTransactions[clientId] || 0;
  };

  // Filter and search
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterStatus === 'all' || client.status === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [clients, searchTerm, filterStatus]);

  // Sort
  const sortedClients = useMemo(() => {
    const sorted = [...filteredClients];

    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'lastActivity':
        sorted.sort((a, b) => {
          const dateA = a.lastActivity?.getTime() || 0;
          const dateB = b.lastActivity?.getTime() || 0;
          return dateB - dateA;
        });
        break;
      case 'moneySpent':
        sorted.sort((a, b) => {
          const spentA = getClientMoneySpent(a.id);
          const spentB = getClientMoneySpent(b.id);
          return spentB - spentA;
        });
        break;
    }

    return sorted;
  }, [filteredClients, sortBy]);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Manage and track all your clients</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex gap-4">
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastActivity">Last Activity</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="moneySpent">Money Spent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clients List ({sortedClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loading />
          ) : sortedClients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No clients found"
              description="Try adjusting your search or filters"
              action={{ label: 'Add Client', onClick: () => setIsFormOpen(true) }}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Money Spent</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedClients.map((client) => {
                    const moneySpent = getClientMoneySpent(client.id);
                    const lastActivity = client.lastActivity
                      ? new Intl.DateTimeFormat('en-US', {
                          month: 'short',
                          day: 'numeric',
                        }).format(client.lastActivity)
                      : 'N/A';

                    return (
                      <TableRow key={client.id} className="hover:bg-muted/50 cursor-pointer">
                        <TableCell className="font-medium">
                          <Link href={`/clients/${client.id}`} className="text-primary hover:underline">
                            {client.name}
                          </Link>
                        </TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell>
                          <ClientStatusBadge status={client.status} />
                        </TableCell>
                        <TableCell>${moneySpent.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">{lastActivity}</TableCell>
                        <TableCell className="text-right">
                          <Link
                            href={`/clients/${client.id}`}
                            className="text-primary hover:underline text-sm"
                          >
                            View
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Form Modal */}
      <ClientFormModal open={isFormOpen} onOpenChange={setIsFormOpen} onSubmit={handleAddClient} />
    </div>
  );
}
