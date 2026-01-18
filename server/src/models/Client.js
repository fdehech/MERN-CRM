import mongoose from 'mongoose';

const customFieldSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
}, { _id: false });

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['Lead', 'Active', 'Inactive', 'Closed'],
    default: 'Lead',
  },
  customFields: [customFieldSchema],
  lastActivity: {
    type: Date,
    default: Date.now,
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

// Index for faster searches
clientSchema.index({ name: 'text', phone: 'text', address: 'text' });

export default mongoose.model('Client', clientSchema);
