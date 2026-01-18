import type { ClientStatus } from '@/components/client-status-badge';

export type { ClientStatus };

export interface CustomField {
  key: string;
  value: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  photo?: string;
  status: ClientStatus;
  customFields: CustomField[];
  lastActivity?: Date;
}

export interface Note {
  id: string;
  clientId: string;
  title?: string;
  body: string;
  isPinned: boolean;
  isHighlighted: boolean;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  clientId: string;
  amount: number;
  description?: string;
  date: Date;
}

export interface Appointment {
  id: string;
  clientId: string;
  dateTime: Date;
  location: string;
  reminderEnabled: boolean;
  reminderTime?: '15min' | '30min' | '1hour' | '1day';
  createdAt: Date;
}
