# ScamCRM - Client Frontend

Modern CRM application frontend built with Next.js, React, and TypeScript.

## Overview

This is the client-side application for ScamCRM, providing a clean and intuitive interface for managing clients, notes, transactions, and appointments.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

4. Update the API URL in `.env.local` to point to your backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```
client/
├── app/                    # Next.js app directory
│   ├── (app)/             # Main application routes
│   │   ├── clients/       # Clients list and detail pages
│   │   ├── dashboard/     # Dashboard page
│   │   └── settings/      # Settings page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components (Radix)
│   ├── sidebar.tsx       # Navigation sidebar
│   ├── topbar.tsx        # Top navigation bar
│   └── ...               # Feature-specific components
├── lib/                  # Utilities and configurations
│   ├── api.ts           # API client functions
│   ├── types.ts         # TypeScript type definitions
│   ├── schemas.ts       # Zod validation schemas
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

## API Integration

The application communicates with a backend API. All API calls are centralized in `lib/api.ts`.

### API Endpoints Expected

- `GET /clients` - List all clients
- `GET /clients/:id` - Get client details
- `POST /clients` - Create new client
- `PUT /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client
- `GET /clients/:id/notes` - Get client notes
- `POST /clients/:id/notes` - Create note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note
- `GET /clients/:id/transactions` - Get client transactions
- `POST /clients/:id/transactions` - Create transaction
- `DELETE /transactions/:id` - Delete transaction
- `GET /clients/:id/appointments` - Get client appointments
- `POST /clients/:id/appointments` - Create appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Delete appointment
- `GET /stats` - Get dashboard statistics

## Features

### Dashboard
- KPI cards showing total clients, active clients, revenue, and upcoming appointments
- Upcoming appointments widget

### Clients Management
- List all clients with search and filtering
- Sort by name, last activity, or money spent
- Client detail view with tabs for overview, notes, transactions, and appointments
- Create, edit, and delete clients

### Notes
- Add notes to clients
- Pin important notes
- Highlight critical notes
- Delete notes

### Transactions
- Track financial transactions per client
- View total spending per client
- Add and delete transactions

### Appointments
- Schedule appointments with clients
- Set reminders (30min, 1hour, etc.)
- View upcoming appointments
- Delete appointments

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001/api` |

## Development Notes

- The application uses the Next.js App Router with React Server Components where appropriate
- All forms use React Hook Form with Zod validation
- UI components are built with Radix UI primitives
- Dark mode is supported and enabled by default
- The application is fully responsive

## License

Private - All rights reserved
