import Client from '../models/Client.js';
import Note from '../models/Note.js';
import Transaction from '../models/Transaction.js';
import Appointment from '../models/Appointment.js';

// @desc    Get all clients
// @route   GET /api/clients
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ lastActivity: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json(client);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new client
// @route   POST /api/clients
export const createClient = async (req, res) => {
  try {
    const { name, phone, address, photo, status, customFields } = req.body;
    
    const client = new Client({
      name,
      phone,
      address,
      photo,
      status,
      customFields: customFields || [],
      lastActivity: new Date(),
    });
    
    const savedClient = await client.save();
    res.status(201).json(savedClient);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
export const updateClient = async (req, res) => {
  try {
    const { name, phone, address, photo, status, customFields } = req.body;
    
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Update fields
    if (name !== undefined) client.name = name;
    if (phone !== undefined) client.phone = phone;
    if (address !== undefined) client.address = address;
    if (photo !== undefined) client.photo = photo;
    if (status !== undefined) client.status = status;
    if (customFields !== undefined) client.customFields = customFields;
    client.lastActivity = new Date();
    
    const updatedClient = await client.save();
    res.json(updatedClient);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Delete all related data
    await Promise.all([
      Note.deleteMany({ clientId: req.params.id }),
      Transaction.deleteMany({ clientId: req.params.id }),
      Appointment.deleteMany({ clientId: req.params.id }),
    ]);
    
    await client.deleteOne();
    res.json({ message: 'Client and related data deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
