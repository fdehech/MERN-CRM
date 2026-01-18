import Note from '../models/Note.js';
import Client from '../models/Client.js';

// @desc    Get notes for a client
// @route   GET /api/clients/:clientId/notes
export const getNotesByClientId = async (req, res) => {
  try {
    const notes = await Note.find({ clientId: req.params.clientId })
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new note
// @route   POST /api/clients/:clientId/notes
export const createNote = async (req, res) => {
  try {
    const { title, body, isPinned, isHighlighted } = req.body;
    
    // Verify client exists
    const client = await Client.findById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    const note = new Note({
      clientId: req.params.clientId,
      title,
      body,
      isPinned: isPinned || false,
      isHighlighted: isHighlighted || false,
    });
    
    const savedNote = await note.save();
    
    // Update client's last activity
    client.lastActivity = new Date();
    await client.save();
    
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
export const updateNote = async (req, res) => {
  try {
    const { title, body, isPinned, isHighlighted } = req.body;
    
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Update fields
    if (title !== undefined) note.title = title;
    if (body !== undefined) note.body = body;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (isHighlighted !== undefined) note.isHighlighted = isHighlighted;
    
    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    await note.deleteOne();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
