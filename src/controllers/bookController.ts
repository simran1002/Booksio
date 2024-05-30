// src/controllers/bookController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { parseCSV } from '../utils/csvParser';
import path from 'path';

const prisma = new PrismaClient();

export const uploadBooks = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.resolve(req.file.path);
    const books = await parseCSV(filePath);

    for (const book of books) {
      const { title, author, price, publishedDate } = book;
      const userId = (req as any).user?.id;

      console.log(userId)

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await prisma.book.create({
        data: {
          title,
          author,
          price: parseFloat(price),
          publishedDate: new Date(publishedDate),
          userId: userId, // Change 'user' to 'userId'
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
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, author, price } = req.body;

    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id) },
      data: { title, author, price: parseFloat(price) },
    });

    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.book.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
};
