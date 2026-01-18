import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Client from './models/Client.js';
import Note from './models/Note.js';
import Transaction from './models/Transaction.js';
import Appointment from './models/Appointment.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Client.deleteMany({}),
      Note.deleteMany({}),
      Transaction.deleteMany({}),
      Appointment.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create sample clients
    const clients = await Client.insertMany([
      {
        name: 'John Doe',
        phone: '555-0123',
        address: '123 Main St, New York, NY 10001',
        status: 'Active',
        customFields: [{ key: 'Industry', value: 'Technology' }],
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        name: 'Jane Smith',
        phone: '555-0124',
        address: '456 Oak Ave, Los Angeles, CA 90001',
        status: 'Lead',
        customFields: [{ key: 'Budget', value: '$50k-$100k' }],
        lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        name: 'Bob Johnson',
        phone: '555-0125',
        address: '789 Pine Rd, Chicago, IL 60601',
        status: 'Active',
        customFields: [],
        lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'Alice Brown',
        phone: '555-0126',
        address: '321 Elm St, Houston, TX 77001',
        status: 'Inactive',
        customFields: [{ key: 'Priority', value: 'High' }],
        lastActivity: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'Charlie Wilson',
        phone: '555-0127',
        address: '654 Maple Dr, Phoenix, AZ 85001',
        status: 'Closed',
        customFields: [],
        lastActivity: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log(`✅ Created ${clients.length} clients`);

    // Create sample notes
    const notes = await Note.insertMany([
      {
        clientId: clients[0]._id,
        title: 'Initial Meeting',
        body: 'Discussed project scope and timeline. Client is interested in Q1 implementation.',
        isPinned: true,
        isHighlighted: true,
      },
      {
        clientId: clients[0]._id,
        body: 'Follow-up call scheduled for next Monday.',
        isPinned: false,
        isHighlighted: false,
      },
      {
        clientId: clients[1]._id,
        title: 'Budget Proposal',
        body: 'Sent detailed proposal with pricing options.',
        isPinned: true,
        isHighlighted: false,
      },
      {
        clientId: clients[2]._id,
        body: 'Client very satisfied with deliverables.',
        isPinned: false,
        isHighlighted: true,
      },
    ]);
    console.log(`✅ Created ${notes.length} notes`);

    // Create sample transactions
    const transactions = await Transaction.insertMany([
      {
        clientId: clients[0]._id,
        amount: 5000,
        description: 'Phase 1 - Design',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        clientId: clients[0]._id,
        amount: 7500,
        description: 'Phase 2 - Development',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        clientId: clients[1]._id,
        amount: 2000,
        description: 'Consultation Fee',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        clientId: clients[2]._id,
        amount: 10000,
        description: 'Full Project',
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log(`✅ Created ${transactions.length} transactions`);

    // Create sample appointments
    const appointments = await Appointment.insertMany([
      {
        clientId: clients[0]._id,
        dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        location: 'Video Call - Zoom',
        reminderEnabled: true,
        reminderTime: '30min',
      },
      {
        clientId: clients[1]._id,
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        location: 'Conference Room A',
        reminderEnabled: true,
        reminderTime: '1hour',
      },
      {
        clientId: clients[2]._id,
        dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        location: 'Client Office, 5th Floor',
        reminderEnabled: false,
      },
    ]);
    console.log(`✅ Created ${appointments.length} appointments`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
