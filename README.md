# ScamCRM

A modern, full-stack CRM (Customer Relationship Management) application for managing clients, notes, transactions, and appointments.

## Project Structure

```
ScamCRM/
├── client/          # Next.js frontend application
├── server/          # Express.js backend API
└── database/        # Database scripts and utilities
```

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Middleware**: CORS, Morgan

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### 1. Setup MongoDB

#### Option A: Using Docker (Recommended)
```bash
docker-compose up -d
```

#### Option B: Local MongoDB
Make sure MongoDB is running on `mongodb://localhost:27017`

### 2. Setup Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run seed    # Seed database with sample data
npm run dev     # Start development server
```

Backend will run on `http://localhost:3001`

### 3. Setup Frontend

```bash
cd client
npm install
cp .env.example .env.local
# Edit .env.local with your API URL
npm run dev     # Start development server
```

Frontend will run on `http://localhost:3000`

## Features

### Client Management
- ✅ Create, read, update, and delete clients
- ✅ Client status tracking (Lead, Active, Inactive, Closed)
- ✅ Custom fields support
- ✅ Search and filter clients
- ✅ Sort by name, activity, or spending

### Notes
- ✅ Add notes to clients
- ✅ Pin important notes
- ✅ Highlight critical notes
- ✅ Rich text support

### Transactions
- ✅ Track financial transactions
- ✅ Calculate total spending per client
- ✅ Transaction history

### Appointments
- ✅ Schedule appointments
- ✅ Set reminders (15min, 30min, 1hour, 1day)
- ✅ View upcoming appointments
- ✅ Calendar integration ready

### Dashboard
- ✅ KPI cards (Total Clients, Active Clients, Revenue, Appointments)
- ✅ Upcoming appointments widget
- ✅ Real-time statistics

## API Documentation

See [server/README.md](./server/README.md) for complete API documentation.

### Base URL
```
http://localhost:3001/api
```

### Main Endpoints
- `/clients` - Client management
- `/clients/:id/notes` - Notes management
- `/clients/:id/transactions` - Transaction management
- `/clients/:id/appointments` - Appointment management
- `/stats` - Dashboard statistics

## Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/scamcrm
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Development

### Backend Development
```bash
cd server
npm run dev    # Auto-reload with nodemon
```

### Frontend Development
```bash
cd client
npm run dev    # Next.js dev server with hot reload
```

### Database Seeding
```bash
cd server
npm run seed   # Populate database with sample data
```

## Production Build

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
npm start
```

## Project Features

- 🎨 Modern, clean UI with dark mode support
- 📱 Fully responsive design
- 🔍 Advanced search and filtering
- 📊 Real-time dashboard statistics
- 🗂️ Organized data management
- ⚡ Fast and efficient API
- 🔒 Input validation and error handling
- 📝 Comprehensive documentation

## Architecture

### Frontend Architecture
- **App Router**: Next.js 13+ app directory structure
- **Components**: Reusable UI components with Radix UI
- **State Management**: React hooks and context
- **API Layer**: Centralized fetch-based API client
- **Validation**: Zod schemas for form validation

### Backend Architecture
- **MVC Pattern**: Models, Controllers, Routes separation
- **RESTful API**: Standard HTTP methods and status codes
- **Database**: MongoDB with Mongoose ODM
- **Middleware**: CORS, body parsing, logging
- **Error Handling**: Centralized error handling

## Database Schema

### Collections
- **clients** - Client information and status
- **notes** - Client notes with pinning/highlighting
- **transactions** - Financial transactions
- **appointments** - Scheduled appointments

See [server/README.md](./server/README.md) for detailed schema documentation.

## Contributing

This is a private project. For any questions or issues, please contact the project maintainer.

## License

Private - All rights reserved

## Support

For setup issues or questions:
1. Check the README files in `/client` and `/server`
2. Verify MongoDB is running
3. Ensure all environment variables are set correctly
4. Check that ports 3000 and 3001 are available

## Roadmap

- [ ] User authentication and authorization
- [ ] Email notifications for appointments
- [ ] File attachments for clients
- [ ] Advanced reporting and analytics
- [ ] Export data to CSV/PDF
- [ ] Calendar view for appointments
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
