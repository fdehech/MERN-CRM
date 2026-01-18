// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

import type { Client, Note, Transaction, Appointment } from '@/lib/types';

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// CLIENTS

export async function getClients(): Promise<Client[]> {
  return apiCall<Client[]>('/clients');
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    return await apiCall<Client>(`/clients/${id}`);
  } catch (error) {
    console.error('Failed to fetch client:', error);
    return null;
  }
}

export async function createClient(payload: Omit<Client, 'id'>): Promise<Client> {
  return apiCall<Client>('/clients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateClient(id: string, payload: Partial<Client>): Promise<Client | null> {
  try {
    return await apiCall<Client>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Failed to update client:', error);
    return null;
  }
}

export async function deleteClient(id: string): Promise<boolean> {
  try {
    await apiCall(`/clients/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.error('Failed to delete client:', error);
    return false;
  }
}

// NOTES

export async function getNotesByClientId(clientId: string): Promise<Note[]> {
  return apiCall<Note[]>(`/clients/${clientId}/notes`);
}

export async function createNote(clientId: string, payload: Omit<Note, 'id' | 'clientId' | 'createdAt'>): Promise<Note> {
  return apiCall<Note>(`/clients/${clientId}/notes`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateNote(id: string, payload: Partial<Note>): Promise<Note | null> {
  try {
    return await apiCall<Note>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Failed to update note:', error);
    return null;
  }
}

export async function deleteNote(id: string): Promise<boolean> {
  try {
    await apiCall(`/notes/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.error('Failed to delete note:', error);
    return false;
  }
}

// TRANSACTIONS

export async function getTransactionsByClientId(clientId: string): Promise<Transaction[]> {
  return apiCall<Transaction[]>(`/clients/${clientId}/transactions`);
}

export async function createTransaction(
  clientId: string,
  payload: Omit<Transaction, 'id' | 'clientId'>
): Promise<Transaction> {
  return apiCall<Transaction>(`/clients/${clientId}/transactions`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteTransaction(id: string): Promise<boolean> {
  try {
    await apiCall(`/transactions/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    return false;
  }
}

// APPOINTMENTS

export async function getAppointmentsByClientId(clientId: string): Promise<Appointment[]> {
  return apiCall<Appointment[]>(`/clients/${clientId}/appointments`);
}

export async function createAppointment(
  clientId: string,
  payload: Omit<Appointment, 'id' | 'clientId' | 'createdAt'>
): Promise<Appointment> {
  return apiCall<Appointment>(`/clients/${clientId}/appointments`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateAppointment(id: string, payload: Partial<Appointment>): Promise<Appointment | null> {
  try {
    return await apiCall<Appointment>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Failed to update appointment:', error);
    return null;
  }
}

export async function deleteAppointment(id: string): Promise<boolean> {
  try {
    await apiCall(`/appointments/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.error('Failed to delete appointment:', error);
    return false;
  }
}

// STATS

export async function getClientStats(): Promise<{
  totalClients: number;
  activeClients: number;
  totalRevenue: number;
  upcomingAppointments: number;
}> {
  return apiCall('/stats');
}
