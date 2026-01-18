import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true,
  },
  title: {
    type: String,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isHighlighted: {
    type: Boolean,
    default: false,
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

// Index for faster queries by client
noteSchema.index({ clientId: 1, createdAt: -1 });

export default mongoose.model('Note', noteSchema);
