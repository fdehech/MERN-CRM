import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
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

// Index for faster queries by client and date
transactionSchema.index({ clientId: 1, date: -1 });

export default mongoose.model('Transaction', transactionSchema);
