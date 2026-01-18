import Client from '../models/Client.js';
import Transaction from '../models/Transaction.js';
import Appointment from '../models/Appointment.js';

export const getStats = async (req, res) => {
  try {
    const [totalClients, activeClients, transactions, upcomingAppointments] = await Promise.all([
      Client.countDocuments(),
      Client.countDocuments({ status: 'Active' }),
      Transaction.find(),
      Appointment.countDocuments({ dateTime: { $gte: new Date() } }),
    ]);

    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

    res.json({
      totalClients,
      activeClients,
      totalRevenue,
      upcomingAppointments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
