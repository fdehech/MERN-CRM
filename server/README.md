# ScamCRM - Backend API

RESTful API server for ScamCRM built with Express.js and MongoDB.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Middleware**: CORS, Morgan (logging)
- **Environment**: dotenv

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB 6+ (running locally or remote instance)
- npm or yarn

### Installation

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/scamcrm
```

### Running MongoDB

#### Local MongoDB:
```bash
# Start MongoDB service
mongod
```

#### Using Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Development

Run the development server with auto-reload:

```bash
npm run dev
```

### Production

Start the production server:

```bash
npm start
```

## API Endpoints

Base URL: `http://localhost:3001/api`

### Health Check
- `GET /health` - Server health status

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client (cascades to notes, transactions, appointments)

### Notes
- `GET /api/clients/:clientId/notes` - Get all notes for a client
- `POST /api/clients/:clientId/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Transactions
- `GET /api/clients/:clientId/transactions` - Get all transactions for a client
- `POST /api/clients/:clientId/transactions` - Create new transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Appointments
- `GET /api/clients/:clientId/appointments` - Get all appointments for a client
- `POST /api/clients/:clientId/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Statistics
- `GET /api/stats` - Get dashboard statistics
  - Returns: `{ totalClients, activeClients, totalRevenue, upcomingAppointments }`

## Data Models

### Client
```javascript
{
  name: String (required),
  phone: String (required),
  address: String (required),
  photo: String (optional),
  status: String (enum: ['Lead', 'Active', 'Inactive', 'Closed']),
  customFields: [{ key: String, value: String }],
  lastActivity: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Note
```javascript
{
  clientId: ObjectId (required, ref: Client),
  title: String (optional),
  body: String (required),
  isPinned: Boolean,
  isHighlighted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction
```javascript
{
  clientId: ObjectId (required, ref: Client),
  amount: Number (required, min: 0),
  description: String (optional),
  date: Date (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment
```javascript
{
  clientId: ObjectId (required, ref: Client),
  dateTime: Date (required),
  location: String (required),
  reminderEnabled: Boolean,
  reminderTime: String (enum: ['15min', '30min', '1hour', '1day']),
  createdAt: Date,
  updatedAt: Date
}
```

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── models/
│   │   ├── Client.js          # Client schema
│   │   ├── Note.js            # Note schema
│   │   ├── Transaction.js     # Transaction schema
│   │   └── Appointment.js     # Appointment schema
│   ├── controllers/
│   │   ├── clientController.js
│   │   ├── noteController.js
│   │   ├── transactionController.js
│   │   ├── appointmentController.js
│   │   └── statsController.js
│   ├── routes/
│   │   ├── clientRoutes.js
│   │   ├── noteRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── appointmentRoutes.js
│   │   └── statsRoutes.js
│   └── index.js               # Main application
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Features

### Database
- MongoDB with Mongoose ODM
- Automatic timestamps (createdAt, updatedAt)
- Indexed fields for faster queries
- Text search on client fields
- Cascade delete for client-related data

### API
- RESTful design
- JSON request/response
- CORS enabled
- Request logging with Morgan
- Error handling middleware
- Input validation

### Performance
- Database indexes on frequently queried fields
- Parallel queries for statistics
- Efficient sorting and filtering

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/scamcrm` |

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error

## Development Notes

- Uses ES6 modules (`import/export`)
- Automatic server restart with nodemon
- MongoDB connection with retry logic
- Graceful shutdown handling
- Client's `lastActivity` updated on related operations

## Testing

You can test the API using:
- Postman
- cURL
- Thunder Client (VS Code extension)
- The frontend application

Example cURL request:
```bash
curl http://localhost:3001/api/clients
```

## License

Private - All rights reserved
