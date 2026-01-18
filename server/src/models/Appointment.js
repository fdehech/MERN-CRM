import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  reminderEnabled: {
    type: Boolean,
    default: false,
  },
  reminderTime: {
    type: String,
    enum: ['15min', '30min', '1hour', '1day'],
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  },
});

// Index for faster queries by client and date
appointmentSchema.index({ clientId: 1, dateTime: 1 });
appointmentSchema.index({ dateTime: 1 });

export default mongoose.model('Appointment', appointmentSchema);
