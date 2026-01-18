import { z } from 'zod';

export const clientFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(7, 'Phone must be valid'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  status: z.enum(['Lead', 'Active', 'Inactive', 'Closed']),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;

export const noteFormSchema = z.object({
  title: z.string().optional(),
  body: z.string().min(1, 'Note body is required'),
});

export type NoteFormData = z.infer<typeof noteFormSchema>;

export const transactionFormSchema = z.object({
  amount: z.coerce.number().min(0, 'Amount must be positive'),
  description: z.string().optional(),
  date: z.date(),
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;

export const appointmentFormSchema = z.object({
  dateTime: z.date(),
  location: z.string().min(2, 'Location is required'),
  reminderEnabled: z.boolean(),
  reminderTime: z.enum(['15min', '30min', '1hour', '1day']).optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;
