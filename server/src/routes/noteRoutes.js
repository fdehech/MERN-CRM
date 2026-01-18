import express from 'express';
import {
  getNotesByClientId,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/noteController.js';

const router = express.Router();

// Client-specific routes
router.route('/clients/:clientId/notes')
  .get(getNotesByClientId)
  .post(createNote);

// Note-specific routes
router.route('/notes/:id')
  .put(updateNote)
  .delete(deleteNote);

export default router;
