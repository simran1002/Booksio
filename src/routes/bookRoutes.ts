import express from 'express';
import { uploadBooks, getBooks, getBookById, updateBook, deleteBook } from '../controllers/bookController';
import { authenticateToken } from '../middleware/authMiddleware';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-books', authenticateToken, upload.single('file'), uploadBooks);
router.get('/books', getBooks);
router.get('/books/:id', getBookById);
router.put('/books/:id', authenticateToken, updateBook);
router.delete('/books/:id', authenticateToken, deleteBook);

export default router;
