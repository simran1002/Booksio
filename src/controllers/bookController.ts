import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { parseCSV } from '../utils/csvParser';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });

export const uploadBooks = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.resolve(req.file.path);
    const books = await parseCSV(filePath);

    for (const book of books) {
      await prisma.book.create({
        data: {
          title: book.title,
          author: book.author,
          price: parseFloat(book.price),
          publishedDate: new Date(book.publishedDate), // Ensure this is properly parsed as a Date
          userId: parseInt(req.user!.id), // Use non-null assertion operator
        },
      });
    }

    res.status(201).json({ message: 'Books uploaded successfully' });
  } catch (error) {
    console.error('Error uploading books:', error);
    res.status(500).json({ error: 'Failed to upload books' });
  }
};



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
  const sellerId = parseInt(req.user?.id || ''); // Access user ID safely and convert to number
  const { id } = req.params;
  const { title, author, price } = req.body;

  const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
  if (!book) return res.status(404).send({ error: 'Book not found' });
  if (book.userId !== sellerId) return res.status(403).send({ error: 'Access denied' });

  const updatedBook = await prisma.book.update({
    where: { id: parseInt(id) },
    data: { title, author, price },
  });

  res.send(updatedBook);
};

export const deleteBook = async (req: Request, res: Response) => {
  const sellerId = parseInt(req.user?.id || ''); // Access user ID safely and convert to number
  const { id } = req.params;

  const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
  if (!book) return res.status(404).send({ error: 'Book not found' });
  if (book.userId !== sellerId) return res.status(403).send({ error: 'Access denied' });

  await prisma.book.delete({ where: { id: parseInt(id) } });

  res.status(204).send();
};
