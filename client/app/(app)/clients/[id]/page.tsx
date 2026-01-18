'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pin, Highlighter as Highlight2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientStatusBadge } from '@/components/client-status-badge';
import { EmptyState } from '@/components/empty-state';
import { ClientFormModal } from '@/components/client-form-modal';
import { NoteFormModal } from '@/components/note-form-modal';
import { TransactionFormModal } from '@/components/transaction-form-modal';
import { AppointmentFormModal } from '@/components/appointment-form-modal';
import { getClientById, updateClient, createNote, updateNote, deleteNote, createTransaction, deleteTransaction, createAppointment, updateAppointment, deleteAppointment, getNotesByClientId, getTransactionsByClientId, getAppointmentsByClientId } from '@/lib/api';
import type { Client, Note, Transaction, Appointment } from '@/lib/types';
import type { ClientFormData, NoteFormData, TransactionFormData, AppointmentFormData } from '@/lib/schemas';
import { FileText, DollarSign, Calendar } from 'lucide-react';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [clientData, notesData, transactionsData, appointmentsData] = await Promise.all([
          getClientById(clientId),
          getNotesByClientId(clientId),
          getTransactionsByClientId(clientId),
          getAppointmentsByClientId(clientId),
        ]);

        if (clientData) {
          setClient(clientData);
          setNotes(notesData);
          setTransactions(transactionsData);
          setAppointments(appointmentsData);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [clientId]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-40 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-8">
        <EmptyState
          icon={FileText}
          title="Client not found"
          action={{ label: 'Back to Clients', onClick: () => router.push('/clients') }}
        />
      </div>
    );
  }

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const pinnedNotes = notes.filter((n) => n.isPinned);
  const pinnedNotesFirst = [
    ...pinnedNotes,
    ...notes.filter((n) => !n.isPinned),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const handleEditClient = async (data: ClientFormData) => {
    const updated = await updateClient(clientId, data);
    if (updated) setClient(updated);
  };

  const handleAddNote = async (data: NoteFormData) => {
    const newNote = await createNote(clientId, {
      ...data,
      isPinned: false,
      isHighlighted: false,
    });
    setNotes([...notes, newNote]);
  };

  const handleTogglePinNote = async (noteId: string, isPinned: boolean) => {
    const updated = await updateNote(noteId, { isPinned: !isPinned });
    if (updated) {
      setNotes(notes.map((n) => (n.id === noteId ? updated : n)));
    }
  };

  const handleToggleHighlightNote = async (noteId: string, isHighlighted: boolean) => {
    const updated = await updateNote(noteId, { isHighlighted: !isHighlighted });
    if (updated) {
      setNotes(notes.map((n) => (n.id === noteId ? updated : n)));
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);
    setNotes(notes.filter((n) => n.id !== noteId));
  };

  const handleAddTransaction = async (data: TransactionFormData) => {
    const newTransaction = await createTransaction(clientId, data);
    setTransactions([...transactions, newTransaction]);
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    await deleteTransaction(transactionId);
    setTransactions(transactions.filter((t) => t.id !== transactionId));
  };

  const handleAddAppointment = async (data: AppointmentFormData) => {
    const newAppointment = await createAppointment(clientId, data);
    setAppointments([...appointments, newAppointment]);
  };

  const handleUpdateAppointment = async (appointmentId: string, data: Partial<Appointment>) => {
    const updated = await updateAppointment(appointmentId, data);
    if (updated) {
      setAppointments(appointments.map((a) => (a.id === appointmentId ? updated : a)));
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    await deleteAppointment(appointmentId);
    setAppointments(appointments.filter((a) => a.id !== appointmentId));
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/clients')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <ClientStatusBadge status={client.status} />
              <span className="text-muted-foreground text-sm">{client.phone}</span>
              <span className="text-muted-foreground text-sm">{client.address}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditClientOpen(true)}>
            Edit Client
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Notes</p>
            <p className="text-2xl font-bold">{notes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Appointments</p>
            <p className="text-2xl font-bold">{appointments.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            Overview
          </TabsTrigger>
          <TabsTrigger value="notes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            Notes
          </TabsTrigger>
          <TabsTrigger value="transactions" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="appointments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            Appointments
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{client.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium"><ClientStatusBadge status={client.status} /></p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{client.address}</p>
                </div>
              </div>

              {client.customFields.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold mb-3">Custom Fields</h4>
                  <div className="space-y-2">
                    {client.customFields.map((field) => (
                      <div key={field.key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{field.key}</span>
                        <span className="font-medium">{field.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4 mt-6">
          <div className="flex justify-between">
            <h3 className="font-semibold">{notes.length} Notes</h3>
            <Button size="sm" onClick={() => setIsAddNoteOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Note
            </Button>
          </div>

          {notes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No notes yet"
              description="Start by adding your first note"
              action={{ label: 'Add Note', onClick: () => setIsAddNoteOpen(true) }}
            />
          ) : (
            <div className="space-y-3">
              {pinnedNotesFirst.map((note) => (
                <Card key={note.id} className={note.isHighlighted ? 'border-primary border-2' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {note.title && <p className="font-semibold">{note.title}</p>}
                        <p className="text-sm mt-1 text-muted-foreground">{note.body}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleTogglePinNote(note.id, note.isPinned)}
                          className={note.isPinned ? 'text-primary' : ''}
                        >
                          <Pin className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleHighlightNote(note.id, note.isHighlighted)}
                          className={note.isHighlighted ? 'text-primary' : ''}
                        >
                          <Highlight2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4 mt-6">
          <div className="flex justify-between">
            <h3 className="font-semibold">
              Transactions
              {transactions.length > 0 && (
                <span className="text-muted-foreground ml-2 text-sm">
                  Total: ${transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </span>
              )}
            </h3>
            <Button size="sm" onClick={() => setIsAddTransactionOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Transaction
            </Button>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title="No transactions yet"
              description="Add your first transaction"
              action={{ label: 'Add Transaction', onClick: () => setIsAddTransactionOpen(true) }}
            />
          ) : (
            <div className="space-y-2">
              {transactions
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div>
                      {transaction.description && (
                        <p className="font-medium">{transaction.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-lg">${transaction.amount.toLocaleString()}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4 mt-6">
          <div className="flex justify-between">
            <h3 className="font-semibold">Appointments ({appointments.length})</h3>
            <Button size="sm" onClick={() => setIsAddAppointmentOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Appointment
            </Button>
          </div>

          {appointments.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No appointments yet"
              description="Schedule your first appointment"
              action={{ label: 'Add Appointment', onClick: () => setIsAddAppointmentOpen(true) }}
            />
          ) : (
            <div className="space-y-2">
              {appointments
                .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div>
                      <p className="font-medium">{appointment.location}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(appointment.dateTime).toLocaleString()}
                      </p>
                      {appointment.reminderEnabled && (
                        <p className="text-xs text-primary mt-1">
                          Reminder: {appointment.reminderTime}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ClientFormModal
        open={isEditClientOpen}
        client={client}
        onOpenChange={setIsEditClientOpen}
        onSubmit={handleEditClient}
      />
      <NoteFormModal
        open={isAddNoteOpen}
        onOpenChange={setIsAddNoteOpen}
        onSubmit={handleAddNote}
      />
      <TransactionFormModal
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        onSubmit={handleAddTransaction}
      />
      <AppointmentFormModal
        open={isAddAppointmentOpen}
        onOpenChange={setIsAddAppointmentOpen}
        onSubmit={handleAddAppointment}
      />
    </div>
  );
}
