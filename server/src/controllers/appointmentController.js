import Appointment from '../models/Appointment.js';
import Client from '../models/Client.js';

// @desc    Get appointments for a client
// @route   GET /api/clients/:clientId/appointments
export const getAppointmentsByClientId = async (req, res) => {
  try {
    const appointments = await Appointment.find({ clientId: req.params.clientId })
      .sort({ dateTime: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new appointment
// @route   POST /api/clients/:clientId/appointments
export const createAppointment = async (req, res) => {
  try {
    const { dateTime, location, reminderEnabled, reminderTime } = req.body;
    
    // Verify client exists
    const client = await Client.findById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    const appointment = new Appointment({
      clientId: req.params.clientId,
      dateTime,
      location,
      reminderEnabled: reminderEnabled || false,
      reminderTime,
    });
    
    const savedAppointment = await appointment.save();
    
    // Update client's last activity
    client.lastActivity = new Date();
    await client.save();
    
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
export const updateAppointment = async (req, res) => {
  try {
    const { dateTime, location, reminderEnabled, reminderTime } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Update fields
    if (dateTime !== undefined) appointment.dateTime = dateTime;
    if (location !== undefined) appointment.location = location;
    if (reminderEnabled !== undefined) appointment.reminderEnabled = reminderEnabled;
    if (reminderTime !== undefined) appointment.reminderTime = reminderTime;
    
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    await appointment.deleteOne();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
