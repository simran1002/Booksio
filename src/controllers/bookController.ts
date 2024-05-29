import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { parseCSV } from '../utils/csvParser';
import multer from 'multer';

const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });

export const uploadBooks = [
  upload.single('file'),
  async (req: Request, res: Response) => {
    const sellerId = (req as any).user.userId;

    const books = await parseCSV(req.file!.path);

    const createdBooks = await prisma.book.createMany({
      data: books.map((book) => ({
        ...book,
        sellerId,
      })),
    });

    res.status(201).send(createdBooks);
  },
];

export const getBooks = async (req: Request, res: Response) => {
  const books = await prisma.book.findMany();
  res.send(books);
};

export const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
  if (!book) return res.status(404).send({ error: 'Book not found' });
  res.send(book);
};

export const updateBook = async (req: Request, res: Response) => {
  const sellerId = (req as any).user.userId;
  const { id } = req.params;
  const { title, author, price } = req.body;

  const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
  if (!book) return res.status(404).send({ error: 'Book not found' });
  if (book.sellerId !== sellerId) return res.status(403).send({ error: 'Access denied' });

  const updatedBook = await prisma.book.update({
    where: { id: parseInt(id) },
    data: { title, author, price },
  });

  res.send(updatedBook);
};

export const deleteBook = async (req: Request, res: Response) => {
  const sellerId = (req as any).user.userId;
  const { id } = req.params;

  const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
  if (!book) return res.status(404).send({ error: 'Book not found' });
  if (book.sellerId !== sellerId) return res.status(403).send({ error: 'Access denied' });

  await prisma.book.delete({ where: { id: parseInt(id) } });

  res.status(204).send();
};
