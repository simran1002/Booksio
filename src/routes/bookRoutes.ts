import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { uploadBooks, getBooks, getBookById, updateBook, deleteBook } from '../controllers/bookController';

const router = express.Router();

router.post('/upload', authMiddleware, uploadBooks);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/:id', authMiddleware, updateBook);
router.delete('/:id', authMiddleware, deleteBook);

export default router;
