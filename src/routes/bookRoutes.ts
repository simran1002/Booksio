import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/authMiddleware';
import { uploadBooks, getBooks, getBookById, updateBook, deleteBook } from '../controllers/bookController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', authMiddleware, upload.single('file'), uploadBooks);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/:id', authMiddleware, updateBook);
router.delete('/:id', authMiddleware, deleteBook);

export default router;
