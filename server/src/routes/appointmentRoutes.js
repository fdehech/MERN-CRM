import express from 'express';
import {
  getAppointmentsByClientId,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointmentController.js';

const router = express.Router();

// Client-specific routes
router.route('/clients/:clientId/appointments')
  .get(getAppointmentsByClientId)
  .post(createAppointment);

// Appointment-specific routes
router.route('/appointments/:id')
  .put(updateAppointment)
  .delete(deleteAppointment);

export default router;
